import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import AskMantuaInputReadOnly from "@/components/AskMantuaInputReadOnly";
import { useThemeContext } from "@/components/theme-provider";
import { useAccount } from "wagmi";
import { useLocation } from "wouter";
import { 
  ConnectWallet,
  Wallet,
  WalletDropdown,
  WalletDropdownLink,
  WalletDropdownDisconnect,
} from '@coinbase/onchainkit/wallet';
import { Address, Avatar, Name, Identity, EthBalance } from '@coinbase/onchainkit/identity';
import { 
  Moon, 
  Sun, 
  ChevronRight, 
  TrendingUp, 
  Brain, 
  Code,
  Twitter
} from "lucide-react";
import { SiFarcaster } from "react-icons/si";

export default function Landing() {
  const { theme, toggleTheme } = useThemeContext();
  const { address, isConnected } = useAccount();
  const [, setLocation] = useLocation();
  const inputRef = useRef<any>(null);

  // Redirect to home page when wallet is connected
  useEffect(() => {
    if (isConnected && address) {
      console.log('Wallet connected, redirecting to /home');
      // Small delay to ensure connection is fully established
      setTimeout(() => {
        setLocation("/home");
      }, 100);
    }
  }, [isConnected, address, setLocation]);

  const handleQuickAction = (action: string) => {
    console.log("Quick action clicked:", action);
    // These will only work after wallet connection and redirect to /home
  };

  const quickActions = [
    "What can Mantua do?",
    "Launch a Token",
    "Buy USDC",
    "Analyze the Uniswap contracts",
    "Send ETH to someone"
  ];

  const features = [
    {
      icon: TrendingUp,
      title: "Transaction Insights",
      description: "Deep insights into transaction patterns, gas optimization, and network activity."
    },
    {
      icon: Brain,
      title: "Trade with Intelligence",
      description: "Real-time execution data, route analysis, and slippage detection."
    },
    {
      icon: Code,
      title: "Hook-Powered Automation",
      description: "Custom Uniswap v4 Hook support for dynamic fees, onchain logic, and strategy triggers."
    }
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <a href="/" className="flex items-center space-x-2">
              {/* Dark mode logo */}
              <img
                src="https://i.imghippo.com/files/Fia2034Vk.png"
                className="hidden dark:block h-8 w-auto"
                alt="Mantua Logo Dark"
              />
              {/* Light mode logo */}
              <img
                src="https://i.imghippo.com/files/lEvl3972zrg.png"
                className="block dark:hidden h-8 w-auto"
                alt="Mantua Logo Light"
              />
              <span className="text-xl font-bold text-[#A020F0]">Mantua Protocol</span>
            </a>

            {/* Navigation */}
            <div className="flex items-center space-x-6">
              {/* Theme Toggle */}
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleTheme}
                className="rounded-lg hover:bg-muted"
              >
                {theme === "dark" ? (
                  <Sun className="h-5 w-5 text-yellow-400" />
                ) : (
                  <Moon className="h-5 w-5" />
                )}
              </Button>

              {/* Support Link */}
              <a 
                href="#" 
                className="hover:text-foreground transition-colors text-[#A020F0]"
              >
                Support
              </a>

              {/* Docs Link */}
              <a 
                href="#" 
                className="hover:text-foreground transition-colors text-[#A020F0]"
              >
                Docs
              </a>

              {/* Connect Wallet Button */}
              <div className="flex items-center">
                <div className="wallet-button-wrapper">
                  <Wallet>
                    <ConnectWallet>
                      <Avatar className="h-6 w-6" />
                      <Name />
                    </ConnectWallet>
                    <WalletDropdown>
                      <Identity className="px-4 pt-3 pb-2" hasCopyAddressOnClick>
                        <Avatar />
                        <Name />
                        <Address />
                        <EthBalance />
                      </Identity>
                      <WalletDropdownLink 
                        icon="wallet" 
                        href="https://keys.coinbase.com"
                      >
                        Wallet
                      </WalletDropdownLink>
                      <WalletDropdownDisconnect />
                    </WalletDropdown>
                  </Wallet>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>
      
      <main>
        {/* Hero Section */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12 text-[#A020F0]">
          <div className="text-center">
            {/* Mantua Logo */}
            <div className="flex justify-center mb-6">
              {/* Dark mode logo */}
              <img
                src="https://i.imghippo.com/files/Fia2034Vk.png"
                className="hidden dark:block h-16 w-auto"
                alt="Mantua Logo Dark"
              />
              {/* Light mode logo */}
              <img
                src="https://i.imghippo.com/files/lEvl3972zrg.png"
                className="block dark:hidden h-16 w-auto"
                alt="Mantua Logo Light"
              />
            </div>

            {/* Hero Text */}
            <h1 className="text-4xl sm:text-5xl font-bold mb-4 text-black dark:text-white">
              Explore Blockchain Data with AI Intelligence
            </h1>
            <p className="text-lg mb-12 max-w-2xl mx-auto leading-relaxed text-[#A020F0]">
              The AI-powered programmable liquidity layer on Base.<br/><br/>
              Discover smart contracts, analyze transactions, and uncover insights across multiple blockchains with our AI-powered explorer.
            </p>

            {/* Ask Mantua Input - Read Only */}
            <div className="mb-8">
              <AskMantuaInputReadOnly ref={inputRef} />
            </div>

            {/* Quick Actions Preview */}
            <div className="flex flex-wrap justify-center gap-3 mb-16">
              {quickActions.map((action, index) => (
                <Button
                  key={index}
                  variant="outline"
                  onClick={() => handleQuickAction(action)}
                  className="bg-secondary hover:bg-muted border-border text-muted-foreground hover:text-foreground text-sm transition-colors opacity-60 cursor-not-allowed"
                  disabled
                >
                  {action} <ChevronRight className="ml-1 h-3 w-3" />
                </Button>
              ))}
            </div>
            <p className="text-sm text-muted-foreground mb-16">
              Connect your wallet to unlock these features
            </p>
          </div>
        </div>

        {/* Feature Tiles */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card 
                key={index}
                className="bg-secondary border-2 border-primary rounded-2xl p-8 text-center hover:border-primary/60 transition-colors hover-lift"
              >
                <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="text-primary h-6 w-6" />
                </div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </main>
      
      {/* Footer */}
      <footer className="border-t border-border bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-between items-center">
            <p className="text-muted-foreground text-sm">
              © 2025 Mantua Protocol. All rights reserved.
            </p>
            <div className="flex items-center space-x-4">
              <a 
                href="https://farcaster.xyz/mantuaprotocol.eth" 
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors" 
                aria-label="Farcaster"
              >
                <SiFarcaster className="h-5 w-5" />
              </a>
              <a 
                href="https://x.com/Mantuaprotocol" 
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors" 
                aria-label="Twitter"
              >
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}