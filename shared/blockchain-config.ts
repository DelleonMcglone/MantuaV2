// Base Sepolia Chain Configuration
export const BASE_SEPOLIA_CHAIN_ID = 84532;
export const BASE_SEPOLIA_CHAIN_NAME = 'Base Sepolia';

// Environment Configuration
export const getBlockchainConfig = () => {
  return {
    rpcUrl: process.env.BASE_SEPOLIA_RPC_URL,
    preconfUrl: process.env.BASE_SEPOLIA_PRECONF_URL,
    privateKey: process.env.PRIVATE_KEY,
    chainId: BASE_SEPOLIA_CHAIN_ID,
    chainName: BASE_SEPOLIA_CHAIN_NAME,
  };
};

// Network Configuration for OnchainKit
export const BASE_SEPOLIA_CONFIG = {
  id: BASE_SEPOLIA_CHAIN_ID,
  name: BASE_SEPOLIA_CHAIN_NAME,
  nativeCurrency: {
    decimals: 18,
    name: 'Ethereum',
    symbol: 'ETH',
  },
  rpcUrls: {
    default: {
      http: [process.env.BASE_SEPOLIA_RPC_URL || 'https://sepolia.base.org'],
    },
    public: {
      http: ['https://sepolia.base.org'],
    },
  },
  blockExplorers: {
    default: {
      name: 'BaseScan',
      url: 'https://sepolia.basescan.org',
    },
  },
  testnet: true,
};

// Utility function to check environment setup
export const validateEnvironment = () => {
  const missing = [];
  
  if (!process.env.BASE_SEPOLIA_RPC_URL) {
    missing.push('BASE_SEPOLIA_RPC_URL');
  }
  
  if (!process.env.PRIVATE_KEY) {
    missing.push('PRIVATE_KEY');
  }
  
  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }
  
  return true;
};