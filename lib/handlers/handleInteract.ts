// src/lib/handlers/handleInteract.ts

import { ethers } from 'ethers';
import { TOKENS } from '../config/addresses';

export async function handleInteract(command: string, signer?: ethers.Signer): Promise<string> {
  if (!signer) {
    return 'Please connect your wallet first.';
  }

  console.log(`Executing Interact → Command: "${command}"`);

  const signerAddress = await signer.getAddress();

  // ETH balance
  if (command.toLowerCase().includes('eth') || command.toLowerCase().includes('wallet')) {
    console.log('→ Fetching ETH balance...');

    const balance = await signer.provider!.getBalance(signerAddress);
    const formatted = (Number(balance) / 1e18).toFixed(4);

    return `Your wallet holds ${formatted} ETH.`;
  }

  // ERC-20 token balances
  if (command.toLowerCase().includes('tokens')) {
    console.log('→ Fetching ERC-20 token balances...');

    const erc20Abi = [
      'function balanceOf(address account) view returns (uint256)',
      'function decimals() view returns (uint8)',
      'function symbol() view returns (string)',
    ];

    let response = 'Your token balances:\n';

    for (const tokenName in TOKENS) {
      const tokenAddress = TOKENS[tokenName as keyof typeof TOKENS];

      const tokenContract = new ethers.Contract(tokenAddress, erc20Abi, signer);

      try {
        const balance = await tokenContract.balanceOf(signerAddress);
        const decimals = await tokenContract.decimals();
        const symbol = await tokenContract.symbol();

        const formatted = (Number(balance) / Math.pow(10, Number(decimals))).toFixed(4);

        response += `- ${symbol}: ${formatted}\n`;
      } catch (error) {
        response += `- ${tokenName}: Unable to fetch balance\n`;
      }
    }

    return response;
  }

  return 'Unknown interact command.';
}