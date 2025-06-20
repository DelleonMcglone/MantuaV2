import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChainMultiSelectDropdown } from "@/components/ChainMultiSelectDropdown";
import { useThemeContext } from "@/components/theme-provider";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAccount } from "wagmi";
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
  ArrowUp, 
  ChevronRight, 
  Plus,
  History,
  Wallet as WalletIcon,
  X,
  Twitter,
  MoreHorizontal,
  Trash2
} from "lucide-react";
import { SiFarcaster } from "react-icons/si";
import { ethers } from 'ethers';
import { BASE_SEPOLIA } from '@/lib/config/networks';
import { TOKENS } from '@/lib/config/addresses';

export default function Dashboard() {
  const { theme, toggleTheme } = useThemeContext();
  const [query, setQuery] = useState("");
  const [selectedChains, setSelectedChains] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'assets' | 'activity'>('assets');
  const [activeMenu, setActiveMenu] = useState<number | null>(null);
  const [chatHistory, setChatHistory] = useState<Array<{ id: number; title: string }>>([]);
  const [realAssets, setRealAssets] = useState<Array<{ symbol: string; balance: string }>>([]);
  const [realActivity, setRealActivity] = useState<Array<{ description: string; date: string; amount: string }>>([]);
  const { address, isConnected } = useAccount();
  const queryClient = useQueryClient();

  // Clear wallet-specific data when wallet disconnects
  useEffect(() => {
    if (!isConnected || !address) {
      setChatHistory([]);
      setRealAssets([]);
      setRealActivity([]);
    }
  }, [isConnected, address]);

  // Fetch real wallet balances from Base Sepolia
  useEffect(() => {
    const fetchRealAssets = async () => {
      if (!address || !isConnected) return;

      try {
        const provider = new ethers.providers.JsonRpcProvider(BASE_SEPOLIA.rpcUrl);
        const assets: Array<{ symbol: string; balance: string }> = [];

        // Fetch ETH balance
        const ethBalance = await provider.getBalance(address);
        const ethFormatted = parseFloat(ethers.utils.formatEther(ethBalance)).toFixed(4);
        if (parseFloat(ethFormatted) > 0) {
          assets.push({ symbol: 'ETH', balance: ethFormatted });
        }

        // Fetch ERC20 token balances
        const erc20Abi = ['function balanceOf(address owner) view returns (uint256)'];
        
        for (const [symbol, tokenAddress] of Object.entries(TOKENS)) {
          if (symbol === 'WETH') continue; // Skip WETH to avoid duplication with ETH
          
          try {
            const contract = new ethers.Contract(tokenAddress, erc20Abi, provider);
            const balance = await contract.balanceOf(address);
            const formatted = parseFloat(ethers.utils.formatUnits(balance, 6)).toFixed(2); // USDC/USDT typically 6 decimals
            
            if (parseFloat(formatted) > 0) {
              assets.push({ symbol, balance: formatted });
            }
          } catch (error) {
            console.log(`Error fetching ${symbol} balance:`, error);
          }
        }

        setRealAssets(assets);
      } catch (error) {
        console.error('Error fetching real assets:', error);
        setRealAssets([]);
      }
    };

    fetchRealAssets();
  }, [address, isConnected]);

  // Add command to chat history when user makes queries
  const addToChatHistory = (command: string) => {
    if (!address || !isConnected) return;
    
    const newChatId = Date.now();
    const newChat = {
      id: newChatId,
      title: command.length > 30 ? command.substring(0, 30) + '...' : command
    };
    
    setChatHistory(prev => [newChat, ...prev].slice(0, 10)); // Keep last 10 chats
  };

  // Get user data when wallet is connected
  const { data: user } = useQuery<User>({
    queryKey: ["/api/users/wallet", address],
    enabled: !!address && isConnected,
    staleTime: 1000 * 60 * 5,
  });

  // Get user queries
  const { data: userQueries = [] } = useQuery<Query[]>({
    queryKey: ["/api/users", user?.id, "queries"],
    enabled: !!user?.id,
    staleTime: 1000 * 60 * 2,
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

  const handleSubmitQuery = () => {
    if (query.trim() && user?.id) {
      createQueryMutation.mutate({
        userId: user.id,
        query: query.trim(),
        chain: selectedChains.length > 0 ? selectedChains[0]?.name : undefined,
      });
      setQuery("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSubmitQuery();
    }
  };

  const handleNewChat = () => {
    setQuery("");
    setActiveMenu(null);
  };

  const handleDeleteChat = (id: number) => {
    setChatHistory(prev => prev.filter(chat => chat.id !== id));
    setActiveMenu(null);
  };

  const quickActions = [
    "What can Mantua do?",
    "Launch a Token", 
    "Trade Tokens",
    "Research and Analyze contracts",
    "Send ETH to someone"
  ];

  return (
    <div className="min-h-screen bg-background text-foreground flex">
      {/* Sidebar */}
      <div className="w-64 bg-secondary border-r border-border flex flex-col">
        {/* Sidebar Header */}
        <div className="p-4 border-b border-border">
          <div className="flex items-center space-x-2">
            <img 
              src="https://i.imghippo.com/files/lEvl3972zrg.png" 
              alt="Mantua Logo" 
              className="w-8 h-8 rounded-lg dark:hidden"
            />
            <img 
              src="https://i.imghippo.com/files/Fia2034Vk.png" 
              alt="Mantua Logo" 
              className="w-8 h-8 rounded-lg hidden dark:block"
            />
            <span className="text-xl font-semibold text-[#A020F0]">Mantua</span>
          </div>
        </div>

        {/* Wallet Info */}
        {isConnected && address && (
          <div className="p-4 border-b border-border">
            <div className="flex items-center space-x-2 p-3 bg-muted rounded-lg">
              <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
                <WalletIcon className="h-4 w-4 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium">
                  {address.slice(0, 6)}...{address.slice(-4)}
                </div>
                <div className="text-xs text-muted-foreground">Smart Wallet</div>
              </div>
              
            </div>
          </div>
        )}

        {/* Assets/Activity Section */}
        <div className="p-4 border-b border-border">
          {/* Tab Navigation */}
          <div className="flex border-b border-border mb-4">
            <button
              onClick={() => setActiveTab('assets')}
              className={`relative flex-1 text-center py-2 text-sm font-medium transition-colors ${
                activeTab === 'assets' 
                  ? 'text-primary' 
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Assets
              {activeTab === 'assets' && (
                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-primary transition-all duration-200"></div>
              )}
            </button>
            <button
              onClick={() => setActiveTab('activity')}
              className={`relative flex-1 text-center py-2 text-sm font-medium transition-colors ${
                activeTab === 'activity' 
                  ? 'text-primary' 
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Activity
              {activeTab === 'activity' && (
                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-primary transition-all duration-200"></div>
              )}
            </button>
          </div>

          {/* Tab Content */}
          <div className="min-h-[120px]">
            {activeTab === 'assets' ? (
              realAssets && realAssets.length > 0 ? (
                <div className="space-y-3">
                  {realAssets.map((asset, index) => (
                    <div key={index} className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50">
                      <span className="text-sm font-medium">{asset.symbol}</span>
                      <span className="text-sm text-muted-foreground">{asset.balance}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <X className="h-6 w-6 mx-auto mb-2" />
                  <div className="text-sm">No assets found</div>
                </div>
              )
            ) : (
              realActivity && realActivity.length > 0 ? (
                <div className="space-y-3">
                  {realActivity.map((activity, index) => (
                    <div key={index} className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50">
                      <div className="flex-1">
                        <div className="text-sm font-medium">{activity.description}</div>
                        <div className="text-xs text-muted-foreground">{activity.date}</div>
                      </div>
                      <div className="text-xs text-muted-foreground">{activity.amount}</div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <X className="h-6 w-6 mx-auto mb-2" />
                  <div className="text-sm">No activity found</div>
                </div>
              )
            )}
          </div>
        </div>

        

        {/* Chat History */}
        <div className="p-4 flex-1 overflow-y-auto">
          <div className="text-sm font-medium mb-3 text-muted-foreground">Chat History</div>
          {chatHistory.length === 0 ? (
            <div className="text-center py-4 text-muted-foreground">
              <div className="text-sm">No chat history yet</div>
            </div>
          ) : (
            <div className="space-y-1">
              {chatHistory.map((chat) => (
                <div
                  key={chat.id}
                  className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50 group"
                >
                  <span className="text-sm truncate flex-1 mr-2">{chat.title}</span>
                  <div className="relative">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => setActiveMenu(activeMenu === chat.id ? null : chat.id)}
                    >
                      <MoreHorizontal className="h-3 w-3" />
                    </Button>

                    {activeMenu === chat.id && (
                      <div className="absolute right-0 top-full mt-1 bg-popover border border-border rounded-md shadow-lg z-10 min-w-[120px]">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10"
                          onClick={() => handleDeleteChat(chat.id)}
                        >
                          <Trash2 className="h-3 w-3 mr-2" />
                          Delete
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-border">
        </div>
      </div>
      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Header */}
        <header className="border-b border-border">
          <div className="px-6 py-4">
            <div className="flex justify-end items-center space-x-4">
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
                className="hover:text-foreground transition-colors text-sm text-[#A020F0]"
              >
                Support
              </a>
              
              {/* Docs Link */}
              <a 
                href="#" 
                className="hover:text-foreground transition-colors text-sm text-[#A020F0]"
              >
                Docs
              </a>
              
              {/* Connect Wallet Button */}
              <div className="flex items-center">
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
        </header>

        {/* Main Content Area */}
        <main className="flex-1 flex flex-col items-center justify-center px-6 py-12">
          <div className="max-w-3xl w-full text-center">
            {/* Mantua Logo */}
            <div className="flex justify-center mb-8">
              <img 
                src="https://i.imghippo.com/files/lEvl3972zrg.png" 
                alt="Mantua Logo" 
                className="w-16 h-16 rounded-2xl shadow-lg dark:hidden"
              />
              <img 
                src="https://i.imghippo.com/files/Fia2034Vk.png" 
                alt="Mantua Logo" 
                className="w-16 h-16 rounded-2xl shadow-lg hidden dark:block"
              />
            </div>

            {/* Hero Text */}
            <h1 className="text-4xl sm:text-5xl font-bold mb-4 text-black dark:text-white">
              Explore Blockchain Data with AI Intelligence
            </h1>
            <p className="text-lg mb-12 max-w-2xl mx-auto leading-relaxed text-[#A020F0]">
              Discover smart contracts, analyze transactions, and uncover insights across multiple blockchains with Mantua, the AI-powered explorer.
            </p>

            {/* Ask Mantua Input */}
            <Card className="bg-secondary border-border p-6 mb-8">
              <div className="flex items-center space-x-4">
                <div className="flex-1 relative">
                  <Input 
                    type="text" 
                    placeholder="Ask Mantua" 
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="w-full bg-transparent border-none text-lg placeholder:text-muted-foreground focus-visible:ring-0 focus-visible:ring-offset-0"
                  />
                </div>
                
                {/* Chain Selector */}
                <ChainMultiSelectDropdown
                  onSelect={(chains) => setSelectedChains(chains)}
                  placeholder="Select Chains"
                  className="w-auto min-w-[140px]"
                />
                
                {/* Send Button */}
                <Button 
                  onClick={handleSubmitQuery}
                  size="icon"
                  className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl"
                  disabled={createQueryMutation.isPending}
                >
                  <ArrowUp className="h-4 w-4" />
                </Button>
              </div>
            </Card>

            {/* Quick Actions */}
            <div className="flex flex-wrap justify-center gap-3 mb-8">
              {quickActions.map((action, index) => (
                <Button
                  key={index}
                  variant="outline"
                  onClick={() => setQuery(action)}
                  className="bg-secondary hover:bg-muted border-border text-muted-foreground hover:text-foreground text-sm transition-colors"
                >
                  {action}
                </Button>
              ))}
            </div>

            {/* Recent Queries */}
            {userQueries.length > 0 && (
              <div className="text-left max-w-2xl mx-auto">
                <h3 className="text-lg font-semibold mb-4">Recent Queries</h3>
                <div className="space-y-2">
                  {userQueries.slice(0, 5).map((userQuery) => (
                    <Card key={userQuery.id} className="p-3 bg-muted border-border">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">{userQuery.query}</span>
                        <Badge variant="secondary" className="text-xs">
                          {userQuery.status}
                        </Badge>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </div>
        </main>

        {/* Footer */}
        <footer className="border-t border-border bg-background">
          <div className="px-6 py-4">
            <div className="flex justify-between items-center">
              <p className="text-muted-foreground text-sm">
                © 2025 Mantua Protocol. All rights reserved.
              </p>
              <div className="flex items-center space-x-4">
                <a 
                  href="https://farcaster.xyz/mantuaprotocol.eth" 
                  className="text-muted-foreground hover:text-foreground transition-colors" 
                  aria-label="Farcaster"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <SiFarcaster className="h-5 w-5" />
                </a>
                <a 
                  href="https://x.com/Mantuaprotocol" 
                  className="text-muted-foreground hover:text-foreground transition-colors" 
                  aria-label="Twitter"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Twitter className="h-5 w-5" />
                </a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}