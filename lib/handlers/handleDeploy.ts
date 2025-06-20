import { ethers } from 'ethers';
import { ThirdwebSDK } from '@thirdweb-dev/sdk';

// Base Sepolia configuration
const BASE_SEPOLIA_CHAIN_ID = 84532;

export async function handleDeploy(command: string, signer?: ethers.Signer): Promise<string> {
  console.log('Processing deploy command:', command);

  // Check if wallet is connected
  if (typeof window === 'undefined' || !window.ethereum) {
    return 'Please connect your wallet first.';
  }

  const lowerCommand = command.toLowerCase();

  // Detect deploy commands
  const isTokenDeploy = lowerCommand.includes('deploy token') || lowerCommand.includes('deploy erc20');
  const isSplitDeploy = lowerCommand.includes('deploy split') || lowerCommand.includes('deploy a split');
  const isERC1155Deploy = lowerCommand.includes('deploy erc1155') || lowerCommand.includes('deploy an erc1155');

  if (!isTokenDeploy && !isSplitDeploy && !isERC1155Deploy) {
    return `I can help you deploy contracts! Try commands like:
    
• "Deploy Token ERC20 Contract named 'Hello World'"
• "Deploy a Split contract with two recipients" 
• "Deploy an ERC1155 Contract named 'Hello World' with description 'Hello badges on Ethereum'"

Supported contract types: Token (ERC20), Split, ERC1155`;
  }

  // Parse contract name from command
  let contractName = 'My Contract';
  const nameMatch = command.match(/named\s+['"]([^'"]+)['"]/i);
  if (nameMatch) {
    contractName = nameMatch[1];
  }

  // Parse description from command
  let description = '';
  const descMatch = command.match(/description\s+['"]([^'"]+)['"]/i);
  if (descMatch) {
    description = descMatch[1];
  }

  // Determine contract type
  let contractType = 'Token';
  if (isSplitDeploy) contractType = 'Split';
  else if (isERC1155Deploy) contractType = 'ERC1155';

  console.log(`→ Opening Deploy Modal for ${contractType} contract...`);

  return JSON.stringify({
    type: 'OPEN_DEPLOY_MODAL',
    data: {
      contractType,
      name: contractName,
      description,
      command
    }
  });
}

// Execute actual contract deployment
export async function executeContractDeployment(
  contractType: string,
  name: string,
  description: string = '',
  recipients: string[] = [],
  symbol: string = ''
): Promise<{ success: boolean; address?: string; txHash?: string; error?: string }> {
  try {
    // Get signer from wallet
    if (typeof window === 'undefined' || !window.ethereum) {
      throw new Error('No wallet found');
    }

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const walletAddress = await signer.getAddress();

    // Ensure we're on Base Sepolia
    const network = await provider.getNetwork();
    if (network.chainId !== BASE_SEPOLIA_CHAIN_ID) {
      throw new Error('Please connect to Base Sepolia network');
    }

    // Initialize ThirdwebSDK
    const sdk = ThirdwebSDK.fromSigner(signer, BASE_SEPOLIA_CHAIN_ID, {
      clientId: 'S6Fduh2AdRTJaoy76EjCGtFuFxB2UeiU'
    });

    console.log(`Deploying ${contractType} contract...`);

    let contractAddress: string;
    let deployTx: any;

    switch (contractType.toLowerCase()) {
      case 'token':
      case 'erc20':
        const tokenData = {
          name,
          symbol: symbol || name.substring(0, 4).toUpperCase(),
          primary_sale_recipient: walletAddress,
          description: description || `${name} token created with Mantua`,
        };
        
        deployTx = await sdk.deployer.deployToken(tokenData);
        contractAddress = deployTx;
        break;

      case 'split':
        // Default to 50/50 split if recipients not provided
        const splitRecipients = recipients.length > 0 ? recipients : [walletAddress];
        const sharesBps = recipients.length > 0 
          ? Array(recipients.length).fill(Math.floor(10000 / recipients.length))
          : [10000]; // 100% to wallet if no recipients

        const splitData = {
          name,
          recipients: splitRecipients.map((recipient, index) => ({
            address: recipient,
            sharesBps: sharesBps[index]
          })),
          description: description || `${name} split contract created with Mantua`,
        };
        
        deployTx = await sdk.deployer.deploySplit(splitData);
        contractAddress = deployTx;
        break;

      case 'erc1155':
        const nftData = {
          name,
          symbol: symbol || name.substring(0, 10),
          primary_sale_recipient: walletAddress,
          description: description || `${name} NFT collection created with Mantua`,
        };
        
        deployTx = await sdk.deployer.deployNFTCollection(nftData);
        contractAddress = deployTx;
        break;

      default:
        throw new Error(`Unsupported contract type: ${contractType}`);
    }

    console.log('Contract deployed successfully:', contractAddress);

    return {
      success: true,
      address: contractAddress,
      txHash: 'deployment-tx' // Thirdweb SDK doesn't always return tx hash directly
    };

  } catch (error: any) {
    console.error('Contract deployment failed:', error);
    return {
      success: false,
      error: error.message || 'Unknown error'
    };
  }
}