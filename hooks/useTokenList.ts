import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import type { Token } from '@coinbase/onchainkit/token';

interface UseTokenListReturn {
  tokens: Token[];
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

export const useTokenList = (): UseTokenListReturn => {
  const { chain } = useAccount();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tokens, setTokens] = useState<Token[]>([]);

  const loadTokens = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Check if we're on Base Sepolia
      const isBaseSepolia = !chain || chain.id === 84532;
      
      if (!isBaseSepolia) {
        throw new Error('Unsupported network. Please switch to Base Sepolia.');
      }

      // Use verified Base Sepolia tokens that are confirmed to work
      const verifiedTokens: Token[] = [
        {
          symbol: "ETH",
          name: "Ethereum",
          address: "",
          decimals: 18,
          chainId: 84532,
          image: "https://wallet-api-production.s3.amazonaws.com/uploads/tokens/eth_288.png",
        },
        {
          symbol: "WETH",
          name: "Wrapped Ethereum",
          address: "0x4200000000000000000000000000000000000006",
          decimals: 18,
          chainId: 84532,
          image: "https://wallet-api-production.s3.amazonaws.com/uploads/tokens/eth_288.png",
        },
        {
          symbol: "USDC",
          name: "USD Coin",
          address: "0x036CbD53842c5426634e7929541eC2318f3dCF7e",
          decimals: 6,
          chainId: 84532,
          image: "https://d3r81g40ycuhqg.cloudfront.net/wallet/wais/44/2b/442b80bd16af0c0d9b22e03a16753823fe826e5bfd457292b55fa0ba8c1ba213-ZWUzYjJmZGUtMDYxNy00NDcyLTg0NjQtMWI4OGEwYjBiODE2",
        }
      ];

      setTokens(verifiedTokens);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load token list');
      setTokens([]);
    } finally {
      setIsLoading(false);
    }
  };

  const refetch = () => {
    loadTokens();
  };

  useEffect(() => {
    loadTokens();
  }, [chain]);

  return {
    tokens,
    isLoading,
    error,
    refetch,
  };
};

// Export helper functions for token operations
export const getTokenBySymbol = (tokens: Token[], symbol: string): Token | undefined => {
  return tokens.find(token => 
    token.symbol.toLowerCase() === symbol.toLowerCase()
  );
};

export const getTokenByAddress = (tokens: Token[], address: string): Token | undefined => {
  return tokens.find(token => 
    token.address.toLowerCase() === address.toLowerCase()
  );
};

// Export default tokens for direct access
export const DEFAULT_BASE_SEPOLIA_TOKENS = [
  {
    symbol: "ETH",
    name: "Ethereum",
    address: "",
    decimals: 18,
    chainId: 84532,
    image: "https://wallet-api-production.s3.amazonaws.com/uploads/tokens/eth_288.png",
  },
  {
    symbol: "WETH", 
    name: "Wrapped Ethereum",
    address: "0x4200000000000000000000000000000000000006",
    decimals: 18,
    chainId: 84532,
    image: "https://wallet-api-production.s3.amazonaws.com/uploads/tokens/eth_288.png",
  },
  {
    symbol: "USDC",
    name: "USD Coin", 
    address: "0x036CbD53842c5426634e7929541eC2318f3dCF7e",
    decimals: 6,
    chainId: 84532,
    image: "https://d3r81g40ycuhqg.cloudfront.net/wallet/wais/44/2b/442b80bd16af0c0d9b22e03a16753823fe826e5bfd457292b55fa0ba8c1ba213-ZWUzYjJmZGUtMDYxNy00NDcyLTg0NjQtMWI4OGEwYjBiODE2",
  }
];