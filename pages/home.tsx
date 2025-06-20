import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import AskMantuaInput from "@/components/AskMantuaInput";
import { SwapModal } from "@/components/SwapModal";

import { MintPositionModal } from "@/components/MintPositionModal";
import { IncreaseLiquidityModal } from "@/components/IncreaseLiquidityModal";
import { DecreaseLiquidityModal } from "@/components/DecreaseLiquidityModal";
import { CollectFeesModal } from "@/components/CollectFeesModal";
import { BurnPositionModal } from "@/components/BurnPositionModal";
import { BatchModifyModal } from "@/components/BatchModifyModal";
import { DeployModal } from "@/components/DeployModal";
import { useThemeContext } from "@/components/theme-provider";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
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
import type { User, Query } from "@shared/schema";
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

export default function Home() {
  const { theme, toggleTheme } = useThemeContext();
  const { address, isConnected } = useAccount();
  const queryClient = useQueryClient();
  const [, setLocation] = useLocation();
  const inputRef = useRef<any>(null);
  const [swapModalOpen, setSwapModalOpen] = useState(false);
  const [swapModalData, setSwapModalData] = useState<{
    fromToken?: string;
    toToken?: string;
    amount?: string;
    command?: string;
  }>({});

  const [mintPositionModalOpen, setMintPositionModalOpen] = useState(false);
  const [mintPositionModalData, setMintPositionModalData] = useState<{
    pair?: string;
    command?: string;
  }>({});
  const [increaseLiquidityModalOpen, setIncreaseLiquidityModalOpen] = useState(false);
  const [increaseLiquidityModalData, setIncreaseLiquidityModalData] = useState<{
    pair?: string;
    command?: string;
  }>({});
  const [decreaseLiquidityModalOpen, setDecreaseLiquidityModalOpen] = useState(false);
  const [decreaseLiquidityModalData, setDecreaseLiquidityModalData] = useState<{
    pair?: string;
    command?: string;
  }>({});
  const [collectFeesModalOpen, setCollectFeesModalOpen] = useState(false);
  const [collectFeesModalData, setCollectFeesModalData] = useState<{
    pair?: string;
    command?: string;
  }>({});
  const [burnPositionModalOpen, setBurnPositionModalOpen] = useState(false);
  const [burnPositionModalData, setBurnPositionModalData] = useState<{
    pair?: string;
    command?: string;
  }>({});
  const [batchModifyModalOpen, setBatchModifyModalOpen] = useState(false);
  const [batchModifyModalData, setBatchModifyModalData] = useState<{
    pair?: string;
    command?: string;
  }>({});
  const [deployModalOpen, setDeployModalOpen] = useState(false);
  const [deployModalData, setDeployModalData] = useState<{
    contractType?: string;
    name?: string;
    description?: string;
    command?: string;
  }>({});

  const handleNewChat = () => {
    inputRef.current?.focusInput();
  };

  // Note: Users can now stay on home page after connecting wallet to use chat interface

  // Get or create user when wallet is connected
  const { data: user } = useQuery<User>({
    queryKey: [`/api/users/wallet/${address}`],
    enabled: !!address && isConnected,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Create user mutation
  const createUserMutation = useMutation<User, Error, { walletAddress: string; username?: string }>({
    mutationFn: async (userData) => {
      return await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      }).then(res => res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/users/wallet/${address}`] });
    },
  });

  // Create query mutation
  const createQueryMutation = useMutation<Query, Error, { userId: number; query: string; chain?: string }>({
    mutationFn: async (queryData) => {
      return await fetch("/api/queries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(queryData),
      }).then(res => res.json());
    },
    onSuccess: () => {
      if (user?.id) {
        queryClient.invalidateQueries({ queryKey: ["/api/users", user.id, "queries"] });
      }
    },
  });

  // Auto-create user when wallet connects and user doesn't exist
  useEffect(() => {
    if (address && isConnected && !user && !createUserMutation.isPending) {
      createUserMutation.mutate({
        walletAddress: address,
        username: `User ${address.slice(0, 6)}...${address.slice(-4)}`,
      });
    }
  }, [address, isConnected, user, createUserMutation]);

  const handleQuickAction = (action: string) => {
    console.log("Quick action clicked:", action);
    // TODO: Implement quick action handlers
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
      <main className="flex-1">
        {/* Main App Interface */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-12">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold mb-4 text-black dark:text-white">
              AI-Powered Blockchain Explorer
            </h1>
            <p className="text-muted-foreground">
              Trade, analyze, and explore blockchain data with AI assistance
            </p>
          </div>

          {/* Ask Mantua Input */}
          <div className="mb-8">
            <AskMantuaInput 
              ref={inputRef} 
              onSwapCommand={(data) => {
                console.log('Home page received swap command:', data);
                setSwapModalData(data);
                setSwapModalOpen(true);
                console.log('SwapModal should now be open');
              }}
              onLiquidityCommand={(data) => {
                console.log('Home page received liquidity command (embedded flow):', data);
                // Liquidity commands now flow through conversation - no modal needed
              }}
              onMintPositionCommand={(data) => {
                console.log('Home page received mint position command:', data);
                setMintPositionModalData(data);
                setMintPositionModalOpen(true);
                console.log('MintPositionModal should now be open');
              }}
              onIncreaseLiquidityCommand={(data) => {
                console.log('Home page received increase liquidity command:', data);
                setIncreaseLiquidityModalData(data);
                setIncreaseLiquidityModalOpen(true);
                console.log('IncreaseLiquidityModal should now be open');
              }}
              onDecreaseLiquidityCommand={(data) => {
                console.log('Home page received decrease liquidity command:', data);
                setDecreaseLiquidityModalData(data);
                setDecreaseLiquidityModalOpen(true);
                console.log('DecreaseLiquidityModal should now be open');
              }}
              onCollectFeesCommand={(data) => {
                console.log('Home page received collect fees command:', data);
                setCollectFeesModalData(data);
                setCollectFeesModalOpen(true);
                console.log('CollectFeesModal should now be open');
              }}
              onBurnPositionCommand={(data) => {
                console.log('Home page received burn position command:', data);
                setBurnPositionModalData(data);
                setBurnPositionModalOpen(true);
                console.log('BurnPositionModal should now be open');
              }}
              onBatchModifyCommand={(data) => {
                console.log('Home page received batch modify command:', data);
                setBatchModifyModalData(data);
                setBatchModifyModalOpen(true);
                console.log('BatchModifyModal should now be open');
              }}
              onDeployCommand={(data) => {
                console.log('Home page received deploy command:', data);
                setDeployModalData(data);
                setDeployModalOpen(true);
                console.log('DeployModal should now be open');
              }}
            />
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            {quickActions.map((action, index) => (
              <Button
                key={index}
                variant="outline"
                onClick={() => handleQuickAction(action)}
                className="bg-secondary hover:bg-muted border-border text-muted-foreground hover:text-foreground text-sm transition-colors"
              >
                {action} <ChevronRight className="ml-1 h-3 w-3" />
              </Button>
            ))}
          </div>

          {/* Navigation to Dashboard */}
          <div className="text-center">
            <Button 
              onClick={() => setLocation("/dashboard")}
              variant="outline"
              className="bg-primary/10 hover:bg-primary/20 border-primary text-primary"
            >
              View Dashboard
            </Button>
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

      {/* SwapModal */}
      <SwapModal
        isOpen={swapModalOpen}
        onClose={() => setSwapModalOpen(false)}
        initialFromToken={swapModalData.fromToken}
        initialToToken={swapModalData.toToken}
        initialAmount={swapModalData.amount}
      />



      {/* MintPositionModal */}
      <MintPositionModal
        isOpen={mintPositionModalOpen}
        onClose={() => setMintPositionModalOpen(false)}
        pair={mintPositionModalData.pair || ''}
        command={mintPositionModalData.command || ''}
      />

      {/* IncreaseLiquidityModal */}
      <IncreaseLiquidityModal
        isOpen={increaseLiquidityModalOpen}
        onClose={() => setIncreaseLiquidityModalOpen(false)}
        pair={increaseLiquidityModalData.pair || ''}
        command={increaseLiquidityModalData.command || ''}
      />

      {/* DecreaseLiquidityModal */}
      <DecreaseLiquidityModal
        isOpen={decreaseLiquidityModalOpen}
        onClose={() => setDecreaseLiquidityModalOpen(false)}
        pair={decreaseLiquidityModalData.pair || ''}
        command={decreaseLiquidityModalData.command || ''}
      />

      {/* CollectFeesModal */}
      <CollectFeesModal
        isOpen={collectFeesModalOpen}
        onClose={() => setCollectFeesModalOpen(false)}
        pair={collectFeesModalData.pair || ''}
        command={collectFeesModalData.command || ''}
      />

      {/* BurnPositionModal */}
      <BurnPositionModal
        isOpen={burnPositionModalOpen}
        onClose={() => setBurnPositionModalOpen(false)}
        pair={burnPositionModalData.pair || ''}
        command={burnPositionModalData.command || ''}
      />

      {/* BatchModifyModal */}
      <BatchModifyModal
        isOpen={batchModifyModalOpen}
        onClose={() => setBatchModifyModalOpen(false)}
        pair={batchModifyModalData.pair || ''}
        command={batchModifyModalData.command || ''}
      />

      {/* DeployModal */}
      <DeployModal
        isOpen={deployModalOpen}
        onClose={() => setDeployModalOpen(false)}
        initialContractType={deployModalData.contractType}
        initialName={deployModalData.name}
        initialDescription={deployModalData.description}
        command={deployModalData.command || ''}
      />
    </div>
  );
}