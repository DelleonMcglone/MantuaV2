// src/lib/handlers/handleExplore.ts

import { ethers } from 'ethers';
import { BASE_SEPOLIA } from '../config/networks';

export async function handleExplore(command: string): Promise<string> {
  console.log(`Executing Explore → Command: "${command}"`);

  // Connect to Base Sepolia
  const provider = new ethers.providers.JsonRpcProvider(BASE_SEPOLIA.rpcUrl);

  // Latest block
  if (command.toLowerCase().includes('block')) {
    console.log('→ Fetching latest block number...');

    const blockNumber = await provider.getBlockNumber();

    return `Latest block number on Base Sepolia: ${blockNumber}`;
  }

  // Gas price
  if (command.toLowerCase().includes('gas')) {
    console.log('→ Fetching gas price...');

    const gasPrice = await provider.getGasPrice();
    const formatted = (Number(gasPrice) / 1e9).toFixed(2);

    return `Current gas price on Base Sepolia: ${formatted} gwei.`;
  }

  return 'Unknown explore command.';
}