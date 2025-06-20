export interface IntentResult {
  type: 'SWAP' | 'CREATE_POOL' | 'LIQUIDITY' | 'CHAT';
  suppressFallback: boolean;
  data?: any;
}

export function routeUserIntent(message: string): IntentResult {
  const lower = message.toLowerCase();

  // Comprehensive liquidity keywords to trigger CreatePoolHandler
  const liquidityKeywords = [
    "liquidity",
    "add liquidity", 
    "create liquidity",
    "provide liquidity",
    "liquidity pool",
    "launch pool",
    "create pool",
    "new pool",
    "pool setup",
    "start pool",
    "make pool",
    "deploy pool",
    "initialize pool",
    "launch a pool",
    "create a pool",
    "setup liquidity",
    "mint position",
    "position management"
  ];

  // Check for liquidity-related commands
  if (liquidityKeywords.some(kw => lower.includes(kw))) {
    // Parse token pairs if mentioned
    const tokenPairs = parseTokenPairs(message);
    
    return { 
      type: "LIQUIDITY", 
      suppressFallback: true,
      data: tokenPairs
    };
  }

  // Check for swap commands
  const swapKeywords = ["swap", "trade", "exchange", "convert", "buy", "sell"];
  const hasSwapKeyword = swapKeywords.some(kw => lower.includes(kw));
  const hasTokenContext = lower.includes('eth') || lower.includes('usdc') || 
                          lower.includes('weth') || lower.includes('for') || 
                          lower.includes('to') || lower.includes('with');
  
  if (hasSwapKeyword && hasTokenContext) {
    return { 
      type: "SWAP", 
      suppressFallback: true 
    };
  }

  // Default to chat
  return { 
    type: "CHAT", 
    suppressFallback: false 
  };
}

function parseTokenPairs(message: string) {
  const lower = message.toLowerCase();
  const tokens = [];
  
  // Common token symbols to look for
  const tokenSymbols = ['eth', 'weth', 'usdc', 'cbbtc', 'btc', 'eurc'];
  
  for (const symbol of tokenSymbols) {
    if (lower.includes(symbol)) {
      tokens.push(symbol.toUpperCase());
    }
  }
  
  // Look for token pair patterns like "ETH/USDC" or "ETH-USDC"
  const pairPatterns = [
    /(\w+)[\/\-](\w+)/g,
    /(\w+)\s+and\s+(\w+)/g,
    /(\w+)\s+with\s+(\w+)/g
  ];
  
  for (const pattern of pairPatterns) {
    const matches = lower.match(pattern);
    if (matches) {
      matches.forEach(match => {
        const parts = match.split(/[\/\-\s]+/).filter(p => p && p !== 'and' && p !== 'with');
        tokens.push(...parts.map(p => p.toUpperCase()));
      });
    }
  }
  
  // Remove duplicates and return unique tokens
  return Array.from(new Set(tokens));
}

export { parseTokenPairs };