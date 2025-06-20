import type { Token } from '@coinbase/onchainkit/token';

export const BASE_SEPOLIA_CHAIN_ID = 84532;

export const baseSepoliaTokens: Token[] = [
  {
    symbol: "ETH",
    name: "Ethereum",
    address: "",
    decimals: 18,
    chainId: BASE_SEPOLIA_CHAIN_ID,
    image: "https://wallet-api-production.s3.amazonaws.com/uploads/tokens/eth_288.png",
  },
  {
    symbol: "WETH",
    name: "Wrapped Ethereum", 
    address: "0x4200000000000000000000000000000000000006",
    decimals: 18,
    chainId: BASE_SEPOLIA_CHAIN_ID,
    image: "https://wallet-api-production.s3.amazonaws.com/uploads/tokens/eth_288.png",
  },
  {
    symbol: 'USDC',
    name: 'USD Coin',
    decimals: 6,
    chainId: BASE_SEPOLIA_CHAIN_ID,
    address: '0x036CbD53842c5426634e7929541eC2318f3dCF7e',
    image: 'https://d3r81g40ycuhqg.cloudfront.net/wallet/wais/44/2b/442b80bd16af0c0d9b22e03a16753823fe826e5bfd457292b55fa0ba8c1ba213-ZWUzYjJmZGUtMDYxNy00NDcyLTg0NjQtMWI4OGEwYjBiODE2',
  },
];