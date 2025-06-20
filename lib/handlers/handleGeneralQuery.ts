// Known token addresses on Base Sepolia testnet
const KNOWN_TOKENS = {
  'USDC': '0x036CbD53842c5426634e7929541eC2318f3dCF7e',
  'ETH': 'native',
  'cbBTC': '0x0000000000000000000000000000000000000000', // Mock address for testnet
  'EURC': '0x0000000000000000000000000000000000000000', // Mock address for testnet
};

export async function handleGeneralQuery(command: string, signer?: any): Promise<string> {
  if (!signer || !signer.provider) {
    return "Please connect your wallet first.";
  }

  const lowerCommand = command.toLowerCase();
  
  try {
    // Get connected wallet address
    const walletAddress = await signer.getAddress();
    
    // Understand patterns
    if (lowerCommand.includes('erc standards') || lowerCommand.includes('what standards')) {
      if (lowerCommand.includes('0x')) {
        const addressMatch = command.match(/0x[a-fA-F0-9]{40}/);
        if (addressMatch) {
          const contractAddress = addressMatch[0];
          return `To analyze ERC standards for ${contractAddress}, I would need to call the contract's supportsInterface function. This contract appears to be deployed on Base Sepolia. Common ERC standards include ERC20 (tokens), ERC721 (NFTs), ERC1155 (multi-tokens), and ERC165 (interface detection).`;
        }
      }
      return "ERC standards define token interfaces. Common ones include ERC20 (fungible tokens), ERC721 (NFTs), ERC1155 (multi-token), and ERC165 (interface detection).";
    }
    
    if (lowerCommand.includes('functions allow minting') || lowerCommand.includes('minting functions')) {
      return "Common minting functions include: mint(), safeMint(), mintTo(), batchMint(). These are typically restricted to contract owners or approved minters through access control patterns like Ownable or AccessControl.";
    }
    
    // Interact patterns
    if (lowerCommand.includes('how much eth') || lowerCommand.includes('eth balance')) {
      try {
        const balance = await signer.provider.getBalance(walletAddress);
        // Simple formatting without utils
        const ethBalance = (parseInt(balance.toString()) / Math.pow(10, 18)).toFixed(4);
        return `Your wallet (${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}) has ${ethBalance} ETH on Base Sepolia`;
      } catch (error) {
        return `Unable to fetch ETH balance. Please ensure you're connected to Base Sepolia.`;
      }
    }
    
    if (lowerCommand.includes('tokens i hold') || lowerCommand.includes('what tokens')) {
      return `To check your token balances on Base Sepolia, please connect your wallet and ensure you're on the correct network. Common tokens include USDC, cbBTC, and EURC.`;
    }
    
    // Explore patterns
    if (lowerCommand.includes('latest block') || lowerCommand.includes('current block')) {
      const blockNumber = await signer.provider.getBlockNumber();
      const block = await signer.provider.getBlock(blockNumber);
      const timestamp = block ? new Date(block.timestamp * 1000).toLocaleString() : 'unknown';
      return `Latest block on Base Sepolia: #${blockNumber}\nTimestamp: ${timestamp}`;
    }
    
    if (lowerCommand.includes('gas price')) {
      try {
        const gasPrice = await signer.provider.getFeeData();
        const gasPriceGwei = gasPrice.gasPrice ? (parseInt(gasPrice.gasPrice.toString()) / Math.pow(10, 9)).toFixed(2) : 'unknown';
        const maxFeeGwei = gasPrice.maxFeePerGas ? (parseInt(gasPrice.maxFeePerGas.toString()) / Math.pow(10, 9)).toFixed(2) : 'unknown';
        return `Current gas prices on Base Sepolia:\n• Gas Price: ${gasPriceGwei} Gwei\n• Max Fee: ${maxFeeGwei} Gwei`;
      } catch (error) {
        return `Unable to fetch gas prices. Please ensure you're connected to Base Sepolia.`;
      }
    }
    
    // Research patterns
    if (lowerCommand.includes('price of') || lowerCommand.includes('token price')) {
      const tokenMatch = lowerCommand.match(/price of (\w+)/);
      if (tokenMatch) {
        const token = tokenMatch[1].toUpperCase();
        // Mock prices for testnet (real prices would come from price oracles)
        const mockPrices: Record<string, string> = {
          'USDC': '$1.00',
          'ETH': '$3,200.00',
          'CBBTC': '$97,000.00',
          'EURC': '€0.95'
        };
        const price = mockPrices[token] || 'unknown';
        return `The price of ${token} is approximately ${price} (testnet mock data)`;
      }
      return "Please specify which token price you'd like to know (e.g., 'price of USDC')";
    }
    
    if (lowerCommand.includes('address of') || lowerCommand.includes('token address')) {
      const tokenMatch = lowerCommand.match(/address of (\w+)/);
      if (tokenMatch) {
        const token = tokenMatch[1].toUpperCase();
        const address = KNOWN_TOKENS[token as keyof typeof KNOWN_TOKENS];
        if (address) {
          if (address === 'native') {
            return `${token} is the native token on Base Sepolia - no contract address needed`;
          }
          return `The address of ${token} on Base Sepolia is: ${address}`;
        }
        return `Token ${token} is not in my known token list for Base Sepolia`;
      }
      return "Please specify which token address you'd like to know (e.g., 'address of USDC')";
    }
    
    // Network info
    if (lowerCommand.includes('network') || lowerCommand.includes('chain id')) {
      const network = await signer.provider.getNetwork();
      return `Connected to Base Sepolia testnet\n• Chain ID: ${network.chainId}\n• Name: ${network.name || 'Base Sepolia'}`;
    }
    
    // Default response for unmatched queries
    return `I can help you with blockchain queries like:
    
**Understand:**
• "What ERC standards does [address] implement?"
• "What functions allow minting NFTs?"

**Interact:**
• "How much ETH is in my wallet?"
• "What tokens do I hold on Base?"

**Explore:**
• "What's the latest block on Base?"
• "Gas price on Base?"

**Research:**
• "What's the price of USDC?"
• "What's the address of USDC on Base?"

Try asking one of these questions!`;
    
  } catch (error) {
    console.error('Error in handleGeneralQuery:', error);
    return `Error processing your query. Please make sure you're connected to Base Sepolia and try again.`;
  }
}