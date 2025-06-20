import { useState, useRef, forwardRef, useImperativeHandle } from 'react';
import { callNebula } from '@/lib/nebulaClient';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { ArrowUp } from "lucide-react";
import { useAccount } from "wagmi";
import { ConnectWallet, Wallet } from '@coinbase/onchainkit/wallet';

const AskMantuaInputReadOnly = forwardRef<{ focusInput: () => void }>((props, ref) => {
  const [input, setInput] = useState('');
  const [response, setResponse] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const { isConnected } = useAccount();

  useImperativeHandle(ref, () => ({
    focusInput: () => {
      inputRef.current?.focus();
    },
  }));

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    // If not connected, don't process the query - the button will handle wallet connection
    if (!isConnected) return;

    setLoading(true);

    try {
      // Check if this is a transaction command
      const isTransactionCommand = input.toLowerCase().includes('swap') || 
                                   input.toLowerCase().includes('pool') ||
                                   input.toLowerCase().includes('liquidity') ||
                                   input.toLowerCase().includes('deploy') ||
                                   input.toLowerCase().includes('send') ||
                                   input.toLowerCase().includes('transfer') ||
                                   input.toLowerCase().includes('buy') ||
                                   input.toLowerCase().includes('sell');
      
      if (isTransactionCommand) {
        // Show read-only message for transaction commands
        setResponse('Please connect your wallet and go to the Home page to perform onchain actions.');
      } else {
        // Process as informational query only
        const nebulaResponse = await callNebula(input);
        
        // Provide informational responses but don't trigger any onchain actions
        let informationalResponse = '';
        
        if (nebulaResponse.intent) {
          switch (nebulaResponse.intent.toLowerCase()) {
            case 'swap':
            case 'liquidity':
            case 'deploy':
            case 'transfer':
              informationalResponse = 'Please connect your wallet and go to the Home page to perform onchain actions.';
              break;
            default:
              informationalResponse = nebulaResponse.response || 'I can help you explore blockchain data. Connect your wallet to perform transactions.';
          }
        } else {
          informationalResponse = 'I can help you explore blockchain data and answer questions. Connect your wallet to access full trading features.';
        }
        
        setResponse(informationalResponse);
      }
    } catch (err) {
      setResponse('I can help you explore blockchain data. Connect your wallet to access full features.');
      console.error(err);
    } finally {
      setLoading(false);
      setInput('');
    }
  };

  const handleKeyPress = (e: any) => {
    if (e.key === "Enter") {
      onSubmit(e);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <Card className="rounded-lg border shadow-sm bg-secondary border-border p-6 text-[#A020F0]">
        <form onSubmit={onSubmit} className="flex items-center space-x-4">
          <div className="flex-1 relative">
            <Input 
              type="text" 
              placeholder="Ask Mantua about blockchain data" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              className="w-full bg-transparent border-none text-lg placeholder:text-muted-foreground focus-visible:ring-0 focus-visible:ring-offset-0"
              ref={inputRef}
            />
          </div>

          {isConnected ? (
            <Button 
              type="submit"
              size="icon"
              disabled={loading}
              className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl"
            >
              <ArrowUp className="h-4 w-4" />
            </Button>
          ) : (
            <Wallet>
              <ConnectWallet className="bg-[#a020f0] hover:bg-[#8a1bd1] text-black font-bold rounded-xl h-10 w-10 p-0 flex items-center justify-center">
                <ArrowUp className="h-4 w-4" />
              </ConnectWallet>
            </Wallet>
          )}
        </form>
      </Card>

      {response && (
        <Card className="mt-4 p-4 bg-muted border-border">
          <div className="text-foreground">
            <strong className="text-primary">Response:</strong> 
            <div className="mt-2">{response}</div>
          </div>
        </Card>
      )}

      {loading && (
        <Card className="mt-4 p-4 bg-muted border-border">
          <div className="text-muted-foreground">
            Processing your request...
          </div>
        </Card>
      )}
    </div>
  );
});

AskMantuaInputReadOnly.displayName = 'AskMantuaInputReadOnly';

export default AskMantuaInputReadOnly;