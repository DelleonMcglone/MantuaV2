// swap-intent.ts - Input Normalization & Intent Parsing

export function normalizeSwapRequest(input: string): boolean {
  const keywords = ['swap', 'exchange', 'convert', 'trade', 'buy', 'sell'];
  return keywords.some((kw) => input.toLowerCase().includes(kw));
}

export function parseSwapParameters(input: string) {
  // Enhanced regex to catch various patterns including "buy X with Y"
  const patterns = [
    /(?:swap|exchange|convert|trade)\s*([0-9.]+)?\s*(\w+)?\s*(?:to|for)\s*(\w+)/i,
    /buy\s*([0-9.]+)?\s*(\w+)?\s*(?:with|using)\s*([0-9.]+)?\s*(\w+)/i,
    /sell\s*([0-9.]+)?\s*(\w+)?\s*(?:for|to)\s*(\w+)/i,
    /([0-9.]+)\s*(\w+)\s*(?:to|for|→)\s*(\w+)/i
  ];

  for (const regex of patterns) {
    const match = input.match(regex);
    if (match) {
      // Handle different pattern structures
      if (input.toLowerCase().includes('buy')) {
        // "buy USDC with 0.01 ETH" -> swap ETH to USDC
        const [, targetAmount, targetToken, sourceAmount, sourceToken] = match;
        return {
          amount: parseFloat(sourceAmount || targetAmount || "0.01"),
          fromToken: sourceToken?.toUpperCase() || 'ETH',
          toToken: targetToken?.toUpperCase() || 'USDC',
        };
      } else {
        // Standard "swap X to Y" patterns
        const [, amount, fromToken, , toToken] = match;
        return {
          amount: parseFloat(amount || "0.01"),
          fromToken: fromToken?.toUpperCase() || 'ETH',
          toToken: toToken?.toUpperCase() || 'USDC',
        };
      }
    }
  }
  
  return null;
}