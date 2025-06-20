import { Router } from 'express';
import { validateEnvironment, getBlockchainConfig, BASE_SEPOLIA_CONFIG } from '../shared/blockchain-config';

const router = Router();

// Get blockchain configuration status
router.get('/config', (req, res) => {
  try {
    const config = getBlockchainConfig();
    
    // Check which environment variables are available
    const status = {
      hasRpcUrl: !!config.rpcUrl,
      hasPrivateKey: !!config.privateKey,
      hasPreconfUrl: !!config.preconfUrl,
      chainId: config.chainId,
      chainName: config.chainName,
      networkConfig: BASE_SEPOLIA_CONFIG,
    };

    res.json(status);
  } catch (error) {
    res.status(500).json({ 
      error: 'Failed to get blockchain configuration',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Validate environment variables
router.get('/validate', (req, res) => {
  try {
    validateEnvironment();
    res.json({ 
      valid: true, 
      message: 'All required environment variables are configured' 
    });
  } catch (error) {
    res.status(400).json({ 
      valid: false, 
      error: error instanceof Error ? error.message : 'Environment validation failed' 
    });
  }
});

// Get network status (without exposing sensitive data)
router.get('/network', (req, res) => {
  try {
    const config = getBlockchainConfig();
    
    if (!config.rpcUrl) {
      return res.status(400).json({ 
        error: 'RPC URL not configured. Please add BASE_SEPOLIA_RPC_URL to environment variables.' 
      });
    }

    res.json({
      chainId: config.chainId,
      chainName: config.chainName,
      rpcConfigured: !!config.rpcUrl,
      preconfEnabled: !!config.preconfUrl,
      blockExplorer: BASE_SEPOLIA_CONFIG.blockExplorers.default.url,
    });
  } catch (error) {
    res.status(500).json({ 
      error: 'Failed to get network status',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export default router;