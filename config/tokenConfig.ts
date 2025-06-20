// tokenConfig.ts

import type { Token } from '@coinbase/onchainkit/token';

export const BASE_SEPOLIA_CHAIN_ID = 84532;

export const BASE_SEPOLIA_TOKENS: Token[] = [
  {
    symbol: 'USDC',
    name: 'USD Coin',
    decimals: 6,
    chainId: BASE_SEPOLIA_CHAIN_ID,
    address: '0xD58A2C8aC47E6c94E08eA5fBdc9f7d30Cf2b3a05',
    image: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png',
  },
  {
    symbol: 'cbBTC',
    name: 'Base Bridged BTC',
    decimals: 8,
    chainId: BASE_SEPOLIA_CHAIN_ID,
    address: '0xA7032Aa13c41bB9a4f0DdCA27019e77F9e78e1D0',
    image: 'https://cryptologos.cc/logos/bitcoin-btc-logo.png?v=025',
  },
  {
    symbol: 'EURC',
    name: 'Euro Coin',
    decimals: 6,
    chainId: BASE_SEPOLIA_CHAIN_ID,
    address: '0x9bBb6E924Cd0d495A270FFbFb229147b78D9a0bD',
    image: 'https://cryptologos.cc/logos/euro-coin-eurc-logo.png',
  },
];

// Export individual tokens for easy access
export const USDC_SEPOLIA = BASE_SEPOLIA_TOKENS.find(token => token.symbol === 'USDC')!;
export const CBBTC_SEPOLIA = BASE_SEPOLIA_TOKENS.find(token => token.symbol === 'cbBTC')!;
export const EURC_SEPOLIA = BASE_SEPOLIA_TOKENS.find(token => token.symbol === 'EURC')!;

// Helper function to get token by symbol
export const getTokenBySymbol = (symbol: string): Token | undefined => {
  return BASE_SEPOLIA_TOKENS.find(token => 
    token.symbol.toLowerCase() === symbol.toLowerCase()
  );
};

// Helper function to get token by address
export const getTokenByAddress = (address: string): Token | undefined => {
  return BASE_SEPOLIA_TOKENS.find(token => 
    token.address.toLowerCase() === address.toLowerCase()
  );
};