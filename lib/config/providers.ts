
// src/lib/config/providers.ts

import { ethers } from 'ethers';
import { BASE_SEPOLIA } from './networks';

export const provider = new ethers.providers.JsonRpcProvider(BASE_SEPOLIA.rpcUrl);

export const getProvider = () => {
  return new ethers.providers.JsonRpcProvider(BASE_SEPOLIA.rpcUrl);
};

export const NETWORK_CONFIG = {
  chainId: BASE_SEPOLIA.chainId,
  name: BASE_SEPOLIA.name,
  rpcUrl: BASE_SEPOLIA.rpcUrl,
  blockExplorerUrl: BASE_SEPOLIA.blockExplorerUrl,
  nativeCurrency: {
    name: 'Ethereum',
    symbol: BASE_SEPOLIA.currencySymbol,
    decimals: 18,
  },
};
