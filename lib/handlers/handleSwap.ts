import { ethers } from 'ethers';
import { UniversalRouterABI } from '../abi/UniversalRouterABI';
import { TOKENS, UNISWAP_V4_ROUTER_ADDRESS } from '../config/addresses';
import { BASE_SEPOLIA } from '../config/networks';

// Helper encoding functions:
const V4_SWAP_COMMAND = 0x08; // V4_SWAP command ID

export async function handleSwap(command: string, signer?: ethers.Signer): Promise<string> {
  if (!signer) {
    return 'Please connect your wallet first.';
  }

  console.log(`Executing Swap on Base Sepolia → Command: "${command}"`);

  // Parse swap command to extract tokens and amounts
  const parseSwapCommand = (cmd: string) => {
    const lowerCmd = cmd.toLowerCase();
    
    // Extract amount and tokens from command like "swap 1 eth to usdc"
    const swapMatch = lowerCmd.match(/swap\s+(\d+(?:\.\d+)?)\s+(\w+)\s+to\s+(\w+)/);
    
    if (swapMatch) {
      const [, amount, fromToken, toToken] = swapMatch;
      return {
        amount,
        fromToken: fromToken.toUpperCase(),
        toToken: toToken.toUpperCase()
      };
    }
    
    // Default fallback
    return {
      amount: '1',
      fromToken: 'ETH',
      toToken: 'USDC'
    };
  };

  const { amount, fromToken, toToken } = parseSwapCommand(command);

  // Return modal trigger response for the UI to handle
  return JSON.stringify({
    type: 'OPEN_SWAP_MODAL',
    data: {
      fromToken,
      toToken,
      amount,
      command
    }
  });
}

// Universal Router swap execution with Hook support
export async function executeSwapWithUniversalRouter(
  fromToken: string,
  toToken: string,
  amount: string,
  hookData: string = '',
  signer: ethers.Signer
): Promise<string> {
  try {
    const tokenIn = TOKENS[fromToken as keyof typeof TOKENS] || TOKENS.USDC;
    const tokenOut = TOKENS[toToken as keyof typeof TOKENS] || TOKENS.WETH;
    const amountIn = ethers.utils.parseUnits(amount, fromToken === 'ETH' ? 18 : 6);
    const minAmountOut = ethers.utils.parseUnits('0.0001', toToken === 'ETH' ? 18 : 6);
    const deadline = Math.floor(Date.now() / 1000) + 120;

    // Build PoolKey (matches PoolKey struct in UniversalRouter / V4Router)
    const poolKey = {
      currency0: tokenIn.toLowerCase() < tokenOut.toLowerCase() ? tokenIn : tokenOut,
      currency1: tokenIn.toLowerCase() < tokenOut.toLowerCase() ? tokenOut : tokenIn,
      fee: 3000, // 0.3% fee tier
      tickSpacing: 60,
      hooks: hookData ? '0xYourHookContractAddress' : ethers.constants.AddressZero, // Hook contract if hookData provided
    };

    // Load Universal Router contract
    const routerContract = new ethers.Contract(
      UNISWAP_V4_ROUTER_ADDRESS,
      UniversalRouterABI,
      signer
    );

    // Build Commands
    const commands = ethers.utils.hexlify([V4_SWAP_COMMAND]);

    // Encode hook data from user input
    const encodedHookData = hookData ? ethers.utils.toUtf8Bytes(hookData) : '0x';

    // Build exact input single params with hook data
    const exactInputParams = ethers.utils.defaultAbiCoder.encode(
      [
        'tuple(address currency0, address currency1, uint24 fee, int24 tickSpacing, address hooks)',
        'bool',
        'uint128',
        'uint128', 
        'bytes'
      ],
      [
        [poolKey.currency0, poolKey.currency1, poolKey.fee, poolKey.tickSpacing, poolKey.hooks],
        tokenIn.toLowerCase() === poolKey.currency0.toLowerCase(),
        amountIn,
        minAmountOut,
        encodedHookData
      ]
    );

    // Build inputs for UniversalRouter execute
    const inputs = [exactInputParams];

    // Execute swap with UniversalRouter
    console.log('Executing swap with Universal Router...');
    const tx = await routerContract.execute(commands, inputs, deadline);
    console.log(`Swap transaction sent: ${tx.hash}`);

    await tx.wait();
    console.log('Swap transaction confirmed');

    return `✅ Swap executed successfully! ${hookData ? 'Hook data processed. ' : ''}View transaction: https://sepolia.basescan.org/tx/${tx.hash}`;

  } catch (error: any) {
    console.error('Swap execution failed:', error);
    return `❌ Swap failed: ${error.message || 'Unknown error'}`;
  }
}

// Helper function to encode hook data
export function encodeHookData(userInput: string): string {
  if (!userInput || userInput.trim() === '') {
    return '0x';
  }
  
  // Convert user input to bytes
  return ethers.utils.hexlify(ethers.utils.toUtf8Bytes(userInput));
}