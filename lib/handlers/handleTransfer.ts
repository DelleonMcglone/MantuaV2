// src/lib/handlers/handleTransfer.ts

import { ethers } from 'ethers';

export async function handleTransfer(command: string, signer?: ethers.Signer): Promise<string> {
  console.log(`Executing Transfer → Command: "${command}"`);

  if (!signer) {
    return 'Transfer operations require wallet connection. Please connect your wallet to continue.';
  }

  // ETH transfer detection
  if (command.toLowerCase().includes('eth') || command.toLowerCase().includes('ether')) {
    return 'ETH transfer requires recipient address and amount. Please provide these details to proceed with the transfer.';
  }

  // Token transfer detection
  if (command.toLowerCase().includes('token') || command.toLowerCase().includes('erc20')) {
    return 'Token transfer requires token contract address, recipient address, and amount. Please provide these details to proceed.';
  }

  // General transfer command
  if (command.toLowerCase().includes('send') || command.toLowerCase().includes('transfer') || command.toLowerCase().includes('pay')) {
    return 'Transfer command detected. Please specify: token type (ETH or token address), recipient address, and amount to transfer.';
  }

  return 'Transfer functionality requires specific details: token type, recipient address, and amount.';
}