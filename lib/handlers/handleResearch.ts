// src/lib/handlers/handleResearch.ts

import { ethers } from 'ethers';
import { TOKENS } from '../config/addresses';

export async function handleResearch(command: string): Promise<string> {
  console.log(`Executing Research → Command: "${command}"`);

  // Token price → requires external API integration
  if (command.toLowerCase().includes('price')) {
    console.log('→ Price lookup requires API integration...');

    // For authentic price data, integration with CoinGecko or similar API is needed
    return 'Price lookup requires API key configuration. Please provide CoinGecko API credentials to enable real-time price data.';
  }

  // Token address
  if (command.toLowerCase().includes('address')) {
    console.log('→ Returning token address...');

    if (command.toLowerCase().includes('usdc')) {
      return `USDC token address on Base Sepolia: ${TOKENS.USDC}`;
    }

    if (command.toLowerCase().includes('usdt')) {
      return `USDT token address on Base Sepolia: ${TOKENS.USDT}`;
    }

    if (command.toLowerCase().includes('dai')) {
      return `DAI token address on Base Sepolia: ${TOKENS.DAI}`;
    }

    if (command.toLowerCase().includes('weth')) {
      return `WETH token address on Base Sepolia: ${TOKENS.WETH}`;
    }

    return 'Unknown token for address lookup. Available tokens: USDC, USDT, DAI, WETH';
  }

  return 'Unknown research command. Try asking for token addresses or prices.';
}