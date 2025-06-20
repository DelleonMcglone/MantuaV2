import { Router } from 'express';
import { getBlockchainConfig } from '../shared/blockchain-config';

const router = Router();

interface RPCResponse {
  jsonrpc: string;
  result?: any;
  error?: {
    code: number;
    message: string;
  };
  id: number;
}

// Test RPC connectivity and chain information
router.get('/test', async (req, res) => {
  try {
    const config = getBlockchainConfig();
    
    if (!config.rpcUrl) {
      return res.status(400).json({
        success: false,
        error: 'BASE_SEPOLIA_RPC_URL not configured',
        suggestion: 'Add BASE_SEPOLIA_RPC_URL to your environment variables'
      });
    }

    // Test chain ID
    const chainIdResponse = await fetch(config.rpcUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        jsonrpc: '2.0',
        method: 'eth_chainId',
        params: [],
        id: 1,
      }),
    });

    const chainIdData: RPCResponse = await chainIdResponse.json();
    
    if (chainIdData.error) {
      return res.status(500).json({
        success: false,
        error: 'RPC call failed',
        details: chainIdData.error,
      });
    }

    const chainId = parseInt(chainIdData.result, 16);
    const expectedChainId = 84532; // Base Sepolia

    if (chainId !== expectedChainId) {
      return res.status(400).json({
        success: false,
        error: 'Unexpected chain ID',
        received: chainId,
        expected: expectedChainId,
        suggestion: 'Verify your RPC URL points to Base Sepolia testnet',
      });
    }

    // Test latest block number
    const blockResponse = await fetch(config.rpcUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        jsonrpc: '2.0',
        method: 'eth_blockNumber',
        params: [],
        id: 2,
      }),
    });

    const blockData: RPCResponse = await blockResponse.json();
    const blockNumber = blockData.result ? parseInt(blockData.result, 16) : 0;

    // Test gas price
    const gasPriceResponse = await fetch(config.rpcUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        jsonrpc: '2.0',
        method: 'eth_gasPrice',
        params: [],
        id: 3,
      }),
    });

    const gasPriceData: RPCResponse = await gasPriceResponse.json();
    const gasPrice = gasPriceData.result ? parseInt(gasPriceData.result, 16) : 0;

    res.json({
      success: true,
      network: {
        name: 'Base Sepolia',
        chainId,
        rpcUrl: config.rpcUrl.substring(0, 50) + '...', // Hide full URL for security
      },
      connectivity: {
        chainIdCorrect: true,
        latestBlock: blockNumber,
        gasPrice: (gasPrice / 1e9).toFixed(2) + ' gwei',
        timestamp: new Date().toISOString(),
      },
      preconfirmation: {
        configured: !!config.preconfUrl,
        url: config.preconfUrl ? config.preconfUrl.substring(0, 50) + '...' : null,
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Network connectivity test failed',
      details: error instanceof Error ? error.message : 'Unknown error',
      suggestion: 'Check your internet connection and RPC URL validity',
    });
  }
});

// Test specific RPC methods
router.post('/method', async (req, res) => {
  try {
    const config = getBlockchainConfig();
    const { method, params = [] } = req.body;

    if (!config.rpcUrl) {
      return res.status(400).json({
        success: false,
        error: 'BASE_SEPOLIA_RPC_URL not configured',
      });
    }

    if (!method) {
      return res.status(400).json({
        success: false,
        error: 'RPC method required',
        example: { method: 'eth_blockNumber', params: [] },
      });
    }

    const response = await fetch(config.rpcUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        jsonrpc: '2.0',
        method,
        params,
        id: Date.now(),
      }),
    });

    const data: RPCResponse = await response.json();

    if (data.error) {
      return res.status(400).json({
        success: false,
        method,
        error: data.error,
      });
    }

    res.json({
      success: true,
      method,
      params,
      result: data.result,
      timestamp: new Date().toISOString(),
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'RPC method test failed',
      details: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

export default router;