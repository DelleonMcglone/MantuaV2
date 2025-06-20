import { ethers } from 'ethers';
import { TOKENS, UNISWAP_V4_POSITION_MANAGER_ADDRESS } from '../config/addresses';
import { BASE_SEPOLIA } from '../config/networks';

// Uniswap v4 Position Manager ABI (simplified for key functions)
const POSITION_MANAGER_ABI = [
  'function modifyLiquidities(bytes calldata unlockData, uint256 deadline) external payable returns (bytes)',
  'function initialize(tuple(address currency0, address currency1, uint24 fee, int24 tickSpacing, address hooks) key, uint160 sqrtPriceX96) external returns (int24)',
  'function mint(address to, uint256 amount) external',
  'function burn(uint256 tokenId) external',
  'function increaseLiquidity(uint256 tokenId, uint128 liquidity) external',
  'function decreaseLiquidity(uint256 tokenId, uint128 liquidity) external'
];

// Action types for Uniswap v4
const Actions = {
  MINT_POSITION: 0x00,
  INCREASE_LIQUIDITY: 0x01,
  DECREASE_LIQUIDITY: 0x02,
  BURN_POSITION: 0x03,
  SETTLE_PAIR: 0x04,
  TAKE_PAIR: 0x05,
  SWEEP: 0x06,
  CLEAR_OR_TAKE: 0x07,
  CLOSE_CURRENCY: 0x08
};

const SUPPORTED_PAIRS = ['USDC/ETH', 'USDC/cbBTC', 'USDC/EURC'];

export async function handleLiquidity(command: string, signer?: ethers.Signer): Promise<string> {
  if (!signer) {
    return 'Please connect your wallet to manage Liquidity Pools.';
  }

  console.log(`Executing Liquidity operation on Base Sepolia → Command: "${command}"`);

  // Parse liquidity command
  const parseLiquidityCommand = (cmd: string) => {
    const lowerCmd = cmd.toLowerCase();
    
    // Extract operation type
    let operation = 'add';
    if (lowerCmd.includes('create pool') || lowerCmd.includes('create liquidity pool')) operation = 'create';
    else if (lowerCmd.includes('mint position')) operation = 'mint';
    else if (lowerCmd.includes('increase liquidity')) operation = 'increase';
    else if (lowerCmd.includes('decrease liquidity')) operation = 'decrease';
    else if (lowerCmd.includes('collect fees')) operation = 'collect';
    else if (lowerCmd.includes('burn position')) operation = 'burn';
    else if (lowerCmd.includes('add')) operation = 'add';
    else if (lowerCmd.includes('remove')) operation = 'remove';
    else if (lowerCmd.includes('batch')) operation = 'batch';
    
    // Extract pair
    let pair = 'USDC/ETH';
    if (lowerCmd.includes('usdc/eth') || lowerCmd.includes('eth/usdc')) pair = 'USDC/ETH';
    else if (lowerCmd.includes('usdc/cbbtc') || lowerCmd.includes('cbbtc/usdc')) pair = 'USDC/cbBTC';
    else if (lowerCmd.includes('usdc/eurc') || lowerCmd.includes('eurc/usdc')) pair = 'USDC/EURC';
    
    return { operation, pair };
  };

  const { operation, pair } = parseLiquidityCommand(command);

  // Handle different liquidity operations
  switch (operation) {
    case 'create':
      console.log('→ Opening Create Pool Modal...');
      break;
    case 'mint':
      console.log('→ Opening Mint Position Modal...');
      break;
    case 'increase':
      console.log('→ Opening Increase Liquidity Modal...');
      break;
    case 'decrease':
      console.log('→ Opening Decrease Liquidity Modal...');
      break;
    case 'collect':
      console.log('→ Opening Collect Fees Modal...');
      break;
    case 'burn':
      console.log('→ Opening Burn Position Modal...');
      break;
    default:
      console.log('→ Opening Liquidity Modal...');
  }

  // Check if pair is supported
  if (!SUPPORTED_PAIRS.includes(pair)) {
    return `❌ Unsupported pool pair. On Base Sepolia, only these pairs are supported:

- USDC / ETH
- USDC / cbBTC  
- USDC / EURC

Please try again using one of these supported pairs.`;
  }

  // Return modal trigger response for the UI to handle
  return JSON.stringify({
    type: 'OPEN_LIQUIDITY_MODAL',
    data: {
      operation,
      pair,
      command
    }
  });
}

// Execute actual liquidity operations with Uniswap v4 Position Manager
export async function executeLiquidityOperation(
  operation: string,
  pair: string,
  amount0: string,
  amount1: string,
  liquidity: string = '1000',
  tokenId: string = '1',
  hookData: string = '',
  action1?: string,
  action2?: string
): Promise<{ success: boolean; txHash?: string; error?: string }> {
  try {
    // Get signer from wallet
    if (typeof window === 'undefined' || !window.ethereum) {
      throw new Error('No wallet found');
    }

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();

    const [token0Symbol, token1Symbol] = pair.split('/');
    const token0 = TOKENS[token0Symbol as keyof typeof TOKENS];
    const token1 = TOKENS[token1Symbol as keyof typeof TOKENS];
    
    if (!token0 || !token1) {
      throw new Error(`Invalid token pair: ${pair}`);
    }

    // Create PoolKey
    const poolKey = {
      currency0: token0.toLowerCase() < token1.toLowerCase() ? token0 : token1,
      currency1: token0.toLowerCase() < token1.toLowerCase() ? token1 : token0,
      fee: 3000, // 0.3% fee
      tickSpacing: 60,
      hooks: hookData ? '0xYourHookContractAddress' : ethers.constants.AddressZero
    };

    // Load Position Manager contract
    const positionManager = new ethers.Contract(
      UNISWAP_V4_POSITION_MANAGER_ADDRESS,
      POSITION_MANAGER_ABI,
      signer
    );

    const deadline = Math.floor(Date.now() / 1000) + 120; // 2 minutes
    
    // Default tick values for position operations
    const tickLower = -60;
    const tickUpper = 60;
    
    let actions: number[] = [];
    let params: any[] = [];

    switch (operation.toLowerCase()) {
      case 'create':
        // Initialize pool
        const sqrtPriceX96 = ethers.BigNumber.from('79228162514264337593543950336'); // 1:1 price
        await positionManager.initialize(poolKey, sqrtPriceX96);
        return {
          success: true,
          txHash: 'pool-created'
        };

      case 'mint':
        actions = [Actions.MINT_POSITION, Actions.SETTLE_PAIR];
        if (token1Symbol === 'ETH') actions.push(Actions.SWEEP);
        
        const mintParams = ethers.utils.defaultAbiCoder.encode(
          ['tuple(address currency0, address currency1, uint24 fee, int24 tickSpacing, address hooks)', 'int24', 'int24', 'uint128', 'uint128', 'bytes'],
          [poolKey, tickLower, tickUpper, ethers.utils.parseUnits(amount0, 6), ethers.utils.parseUnits(amount1, 18), hookData ? ethers.utils.toUtf8Bytes(hookData) : '0x']
        );
        params.push(mintParams);
        break;

      case 'increase':
        actions = [Actions.INCREASE_LIQUIDITY, Actions.SETTLE_PAIR];
        if (token1Symbol === 'ETH') actions.push(Actions.SWEEP);
        
        const increaseParams = ethers.utils.defaultAbiCoder.encode(
          ['uint256', 'uint128', 'uint128', 'uint128', 'bytes'],
          [
            tokenId || '1', 
            ethers.utils.parseUnits(amount0, 6), 
            ethers.utils.parseUnits(amount1, 18),
            ethers.utils.parseUnits('1000', 18), // liquidity amount
            hookData ? ethers.utils.toUtf8Bytes(hookData) : '0x'
          ]
        );
        params.push(increaseParams);
        break;

      case 'decrease':
        actions = [Actions.DECREASE_LIQUIDITY, Actions.TAKE_PAIR];
        
        const decreaseParams = ethers.utils.defaultAbiCoder.encode(
          ['uint256', 'uint128', 'uint128', 'uint128', 'bytes'],
          [
            tokenId || '1',
            ethers.utils.parseUnits(amount0, 6), // amount0Min
            ethers.utils.parseUnits(amount1, 18), // amount1Min
            ethers.utils.parseUnits('500', 18), // liquidity amount to remove
            hookData ? ethers.utils.toUtf8Bytes(hookData) : '0x'
          ]
        );
        params.push(decreaseParams);
        break;

      case 'collect':
        actions = [Actions.DECREASE_LIQUIDITY, Actions.TAKE_PAIR];
        
        const collectParams = ethers.utils.defaultAbiCoder.encode(
          ['uint256', 'uint128', 'uint128', 'uint128', 'bytes'],
          [
            tokenId || '1', // tokenId
            0, // amount0Min = 0 for collect fees
            0, // amount1Min = 0 for collect fees  
            0, // liquidity = 0 (collect fees only)
            hookData ? ethers.utils.toUtf8Bytes(hookData) : '0x'
          ]
        );
        params.push(collectParams);
        
        // Add take pair params for collecting fees
        const collectTakePairParams = ethers.utils.defaultAbiCoder.encode(
          ['address', 'address', 'address'],
          [poolKey.currency0, poolKey.currency1, await signer.getAddress()]
        );
        params.push(collectTakePairParams);
        break;

      case 'burn':
        actions = [Actions.BURN_POSITION, Actions.TAKE_PAIR];
        
        const burnParams = ethers.utils.defaultAbiCoder.encode(
          ['uint256', 'uint128', 'uint128', 'bytes'],
          [
            tokenId || '1', // tokenId
            ethers.utils.parseUnits(amount0, 6), // amount0Min
            ethers.utils.parseUnits(amount1, 18), // amount1Min
            hookData ? ethers.utils.toUtf8Bytes(hookData) : '0x'
          ]
        );
        params.push(burnParams);
        
        // Add take pair params for burning position
        const burnTakePairParams = ethers.utils.defaultAbiCoder.encode(
          ['address', 'address', 'address'],
          [poolKey.currency0, poolKey.currency1, await signer.getAddress()]
        );
        params.push(burnTakePairParams);
        break;

      case 'batch':
        // Batch modify operations with user-selected actions
        const action1Map: { [key: string]: number } = {
          'INCREASE_LIQUIDITY': Actions.INCREASE_LIQUIDITY,
          'DECREASE_LIQUIDITY': Actions.DECREASE_LIQUIDITY,
          'BURN_POSITION': Actions.BURN_POSITION
        };
        
        const action2Map: { [key: string]: number } = {
          'SETTLE_PAIR': Actions.SETTLE_PAIR,
          'TAKE_PAIR': Actions.TAKE_PAIR,
          'CLOSE_CURRENCY': Actions.CLOSE_CURRENCY,
          'CLEAR_OR_TAKE': Actions.CLEAR_OR_TAKE,
          'SWEEP': Actions.SWEEP
        };

        const selectedAction1 = action1Map[action1 || 'INCREASE_LIQUIDITY'];
        const selectedAction2 = action2Map[action2 || 'SETTLE_PAIR'];
        
        actions = [selectedAction1, selectedAction2];
        
        // Parameters for Action 1
        if (action1 === 'INCREASE_LIQUIDITY') {
          const increaseParams = ethers.utils.defaultAbiCoder.encode(
            ['uint256', 'uint256', 'uint128', 'uint128', 'bytes'],
            [
              tokenId || '1',
              ethers.utils.parseUnits(liquidity, 18),
              ethers.utils.parseUnits(amount0, 6),
              ethers.utils.parseUnits(amount1, 18),
              hookData ? ethers.utils.toUtf8Bytes(hookData) : '0x'
            ]
          );
          params.push(increaseParams);
        } else if (action1 === 'DECREASE_LIQUIDITY') {
          const decreaseParams = ethers.utils.defaultAbiCoder.encode(
            ['uint256', 'uint256', 'uint128', 'uint128', 'bytes'],
            [
              tokenId || '1',
              ethers.utils.parseUnits(liquidity, 18),
              ethers.utils.parseUnits(amount0, 6),
              ethers.utils.parseUnits(amount1, 18),
              hookData ? ethers.utils.toUtf8Bytes(hookData) : '0x'
            ]
          );
          params.push(decreaseParams);
        } else if (action1 === 'BURN_POSITION') {
          const burnParams = ethers.utils.defaultAbiCoder.encode(
            ['uint256', 'uint128', 'uint128', 'bytes'],
            [
              tokenId || '1',
              ethers.utils.parseUnits(amount0, 6),
              ethers.utils.parseUnits(amount1, 18),
              hookData ? ethers.utils.toUtf8Bytes(hookData) : '0x'
            ]
          );
          params.push(burnParams);
        }

        // Parameters for Action 2 (mostly settlement/take operations)
        if (action2 === 'SETTLE_PAIR' || action2 === 'TAKE_PAIR') {
          const settleTakeParams = ethers.utils.defaultAbiCoder.encode(
            ['address', 'address'],
            [poolKey.currency0, poolKey.currency1]
          );
          params.push(settleTakeParams);
        } else {
          // For other actions, use basic currency parameter
          const basicParams = ethers.utils.defaultAbiCoder.encode(
            ['address'],
            [poolKey.currency0]
          );
          params.push(basicParams);
        }
        break;

      default:
        throw new Error(`Unsupported operation: ${operation}`);
    }

    // Encode the actions and params
    const unlockData = ethers.utils.defaultAbiCoder.encode(
      ['uint8[]', 'bytes[]'],
      [actions, params]
    );

    // Calculate value to send (for ETH operations)
    const valueToSend = token1Symbol === 'ETH' ? ethers.utils.parseEther(amount1) : 0;

    // Execute the operation
    console.log(`Executing ${operation} operation for ${pair}...`);
    const tx = await positionManager.modifyLiquidities(unlockData, deadline, { value: valueToSend });
    console.log(`Transaction sent: ${tx.hash}`);

    await tx.wait();
    console.log('Transaction confirmed');

    return {
      success: true,
      txHash: tx.hash
    };

  } catch (error: any) {
    console.error('Liquidity operation failed:', error);
    return {
      success: false,
      error: error.message || 'Unknown error'
    };
  }
}