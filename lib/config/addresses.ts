
// src/lib/config/addresses.ts

import { BASE_SEPOLIA } from './networks';

// Base Sepolia testnet token addresses (Verified contracts)
export const TOKENS = {
  ETH: '0x0000000000000000000000000000000000000000', // Native ETH
  WETH: '0x4200000000000000000000000000000000000006', // WETH on Base Sepolia
  USDC: '0x036CbD53842c5426634e7929541eC2318f3dCF7e', // Base Sepolia USDC
  DAI: '0x7d682e65EFC5C13Bf4E394B8f376C48e6baE0355',  // Base Sepolia DAI
};

// Base Sepolia Uniswap v4 contract addresses
export const UNISWAP_V4_ROUTER_ADDRESS = '0x94cC0AaC535CCDB3C01d6787D6413C739ae12bc4';
export const UNISWAP_V4_POSITION_MANAGER_ADDRESS = '0xB7f724d6DDdFd008eFf5cc8848DC2543bb8C6c72';

// Network configuration
export const NETWORK = BASE_SEPOLIA;

export const CHAIN_CONFIG = {
  BASE_SEPOLIA: {
    name: "Base Sepolia",
    chainId: 84532,
    rpcUrl: "https://sepolia.base.org",
    explorerUrl: "https://sepolia.basescan.org",
  }
};
