import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAccount } from 'wagmi';
import { ethers } from 'ethers';
import { executeLiquidityOperation } from '@/lib/handlers/handleLiquidity';

interface MintPositionModalProps {
  isOpen: boolean;
  onClose: () => void;
  pair: string;
  command: string;
}

const SUPPORTED_PAIRS = ['USDC/ETH', 'USDC/cbBTC', 'USDC/EURC'];

export function MintPositionModal({ isOpen, onClose, pair, command }: MintPositionModalProps) {
  const [step, setStep] = useState(1); // Step 1: Mint params, Step 2: Hook selection
  const [selectedPool, setSelectedPool] = useState(pair || 'USDC/ETH');
  const [tickLower, setTickLower] = useState('0');
  const [tickUpper, setTickUpper] = useState('60');
  const [liquidityAmount, setLiquidityAmount] = useState('');
  const [amount0Max, setAmount0Max] = useState('');
  const [amount1Max, setAmount1Max] = useState('');
  const [useHook, setUseHook] = useState<boolean | null>(null);
  const [selectedHook, setSelectedHook] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const { address, isConnected } = useAccount();

  const HOOK_OPTIONS = [
    'beforeAddLiquidity',
    'afterAddLiquidity', 
    'beforeRemoveLiquidity',
    'afterRemoveLiquidity'
  ];

  const handleNext = () => {
    if (!liquidityAmount || !amount0Max || !amount1Max) {
      alert('Please fill in all required fields');
      return;
    }
    setStep(2);
  };

  const handleHookChoice = (choice: boolean) => {
    setUseHook(choice);
    if (!choice) {
      setSelectedHook('');
    }
  };

  const handleMintPosition = async () => {
    if (!isConnected || !address) {
      alert('Please connect your wallet first');
      return;
    }

    if (!SUPPORTED_PAIRS.includes(selectedPool)) {
      alert(`❌ Unsupported pool pair. On Base Sepolia, only these pairs are supported:\n\n- USDC / ETH\n- USDC / cbBTC\n- USDC / EURC\n\nPlease try again using one of these supported pairs.`);
      return;
    }

    if (!liquidityAmount || !amount0Max || !amount1Max) {
      alert('Please fill in all required fields');
      return;
    }

    setIsProcessing(true);

    try {
      // Get signer from wagmi provider
      const provider = new ethers.providers.Web3Provider((window as any).ethereum);
      const signer = provider.getSigner();

      // Encode hook data based on user selection
      let hookData: string = '';
      if (useHook && selectedHook) {
        hookData = selectedHook; // Pass the hook name directly
      } else {
        hookData = ''; // No hook
      }

      // Execute the mint position operation
      const result = await executeLiquidityOperation(
        'mint',
        selectedPool,
        amount0Max,
        amount1Max,
        parseInt(tickLower) || 0,
        parseInt(tickUpper) || 60,
        hookData,
        signer
      );

      // Show success message with hook information
      const hookUsed = useHook && selectedHook ? selectedHook : 'NONE';
      alert(`✅ Mint Position for ${selectedPool} created successfully → Hook used: ${hookUsed}

Position Details:
• Pool: ${selectedPool}
• Ticks: ${tickLower} → ${tickUpper}
• Liquidity: ${liquidityAmount}
• Amounts: ${amount0Max} ${selectedPool.split('/')[0]}, ${amount1Max} ${selectedPool.split('/')[1]}
• Hook used: ${hookUsed}

${result.includes('https://') ? `Transaction: ${result.split('View transaction: ')[1]}` : 'Transaction completed'}`);
      
      onClose();
      
    } catch (error) {
      console.error('Mint position failed:', error);
      alert(`❌ Mint position failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-gray-900 dark:text-white">
            Mint Liquidity Position
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Step 1: Mint Parameters */}
          {step === 1 && (
            <>
              {/* Command Display */}
              <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  <strong>Command:</strong> {command}
                </p>
              </div>

              {/* Select Pool */}
              <div className="space-y-2">
                <Label htmlFor="pool" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Select Pool
                </Label>
                <Select value={selectedPool} onValueChange={setSelectedPool}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a pool" />
                  </SelectTrigger>
                  <SelectContent>
                    {SUPPORTED_PAIRS.map((poolPair) => (
                      <SelectItem key={poolPair} value={poolPair}>
                        {poolPair}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Only Base Sepolia supported pairs available
                </p>
              </div>

              {/* Tick Range */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="tickLower" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Tick Lower
                  </Label>
                  <Input
                    id="tickLower"
                    type="number"
                    value={tickLower}
                    onChange={(e) => setTickLower(e.target.value)}
                    placeholder="0"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="tickUpper" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Tick Upper
                  </Label>
                  <Input
                    id="tickUpper"
                    type="number"
                    value={tickUpper}
                    onChange={(e) => setTickUpper(e.target.value)}
                    placeholder="60"
                    className="mt-1"
                  />
                </div>
              </div>

              {/* Liquidity Amount */}
              <div>
                <Label htmlFor="liquidityAmount" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Liquidity Amount
                </Label>
                <Input
                  id="liquidityAmount"
                  type="number"
                  value={liquidityAmount}
                  onChange={(e) => setLiquidityAmount(e.target.value)}
                  placeholder="1000000000000000000"
                  className="mt-1"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Amount of liquidity to add (uint256)
                </p>
              </div>

              {/* Token Amounts */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="amount0Max" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Amount0 Max ({selectedPool.split('/')[0]})
                  </Label>
                  <Input
                    id="amount0Max"
                    type="number"
                    value={amount0Max}
                    onChange={(e) => setAmount0Max(e.target.value)}
                    placeholder="100"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="amount1Max" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Amount1 Max ({selectedPool.split('/')[1]})
                  </Label>
                  <Input
                    id="amount1Max"
                    type="number"
                    value={amount1Max}
                    onChange={(e) => setAmount1Max(e.target.value)}
                    placeholder="0.1"
                    className="mt-1"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-3">
                <Button
                  onClick={onClose}
                  variant="outline"
                  className="border-gray-300 dark:border-gray-600"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleNext}
                  disabled={!SUPPORTED_PAIRS.includes(selectedPool)}
                  className="bg-purple-600 hover:bg-purple-700 text-white"
                >
                  Next
                </Button>
              </div>
            </>
          )}

          {/* Step 2: Hook Selection */}
          {step === 2 && (
            <>
              {/* Selected Parameters Display */}
              <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  <strong>Pool:</strong> {selectedPool} | <strong>Ticks:</strong> {tickLower} → {tickUpper} | <strong>Liquidity:</strong> {liquidityAmount}
                </p>
              </div>

              {/* Hook Selection */}
              {useHook === null && (
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                      Do you want to use a Hook?
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                      Hooks provide additional functionality for liquidity operations like beforeAddLiquidity, afterAddLiquidity, etc.
                    </p>
                  </div>
                  
                  <div className="flex gap-3">
                    <Button
                      onClick={() => handleHookChoice(true)}
                      className="flex-1 bg-purple-600 hover:bg-purple-700 text-white"
                    >
                      YES
                    </Button>
                    <Button
                      onClick={() => handleHookChoice(false)}
                      variant="outline"
                      className="flex-1 border-gray-300 dark:border-gray-600"
                    >
                      NO
                    </Button>
                  </div>
                </div>
              )}

              {/* Hook Type Selection */}
              {useHook === true && (
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                      Which Hook do you want to use?
                    </h3>
                  </div>
                  
                  <div className="space-y-2">
                    {HOOK_OPTIONS.map((hookOption) => (
                      <div
                        key={hookOption}
                        onClick={() => setSelectedHook(hookOption)}
                        className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                          selectedHook === hookOption
                            ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                            : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                        }`}
                      >
                        <div className="flex justify-between items-center">
                          <div className="font-medium text-gray-900 dark:text-white">
                            {hookOption}
                          </div>
                          {selectedHook === hookOption && (
                            <div className="text-purple-600 font-medium">selected</div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              {useHook !== null && (
                <div className="flex justify-end gap-3">
                  <Button
                    onClick={() => setStep(1)}
                    variant="outline"
                    className="border-gray-300 dark:border-gray-600"
                  >
                    ← Back
                  </Button>
                  <Button
                    onClick={onClose}
                    variant="outline"
                    className="border-gray-300 dark:border-gray-600"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleMintPosition}
                    disabled={isProcessing || (useHook && !selectedHook)}
                    className="bg-purple-600 hover:bg-purple-700 text-white"
                  >
                    {isProcessing ? 'Minting Position...' : 'Mint Position'}
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}