// src/lib/config/thirdweb.ts

import { createThirdwebClient } from 'thirdweb';
import { BASE_SEPOLIA, THIRDWEB_CLIENT_ID } from './networks';

export const thirdwebClient = createThirdwebClient({
  clientId: THIRDWEB_CLIENT_ID,
});

export const BASE_SEPOLIA_CHAIN = {
  id: BASE_SEPOLIA.chainId,
  rpc: BASE_SEPOLIA.rpcUrl,
  name: BASE_SEPOLIA.name,
  nativeCurrency: {
    name: 'Ethereum',
    symbol: BASE_SEPOLIA.currencySymbol,
    decimals: 18,
  },
  blockExplorers: {
    default: { name: 'Base Sepolia Explorer', url: BASE_SEPOLIA.blockExplorerUrl },
  },
};