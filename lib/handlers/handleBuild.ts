// src/lib/handlers/handleBuild.ts

export async function handleBuild(command: string): Promise<string> {
  console.log(`Executing Build → Command: "${command}"`);

  // Connect Wallet button example
  if (command.toLowerCase().includes('connect wallet')) {
    console.log('→ Returning Connect Wallet example...');

    const code = `
    import { ConnectWallet } from '@coinbase/onchainkit/wallet';

    function WalletButton() {
      return (
        <ConnectWallet>
          Connect Wallet
        </ConnectWallet>
      );
    }

    export default WalletButton;
    `;

    return `Here is an example Connect Wallet button:\n\`\`\`tsx\n${code}\n\`\`\``;
  }

  // ERC20 Transfer example
  if (command.toLowerCase().includes('erc20 transfer')) {
    console.log('→ Returning ERC20 transfer example...');

    const code = `
    import { ethers } from 'ethers';

    const erc20Abi = [
      'function transfer(address to, uint amount) returns (bool)',
    ];

    async function transferERC20(tokenAddress, recipient, amount, signer) {
      const tokenContract = new ethers.Contract(tokenAddress, erc20Abi, signer);
      const tx = await tokenContract.transfer(recipient, amount);
      await tx.wait();
      console.log('Transfer confirmed:', tx.hash);
    }
    `;

    return `Here is an example ERC20 transfer using ethers.js:\n\`\`\`js\n${code}\n\`\`\``;
  }

  // SDK example
  if (command.toLowerCase().includes('sdk')) {
    console.log('→ Returning Thirdweb SDK example...');

    const code = `
    import { ThirdwebSDK } from '@thirdweb-dev/sdk';

    async function example(signer) {
      const sdk = ThirdwebSDK.fromSigner(signer, 'base-sepolia');

      // Load ERC20 token
      const token = await sdk.getToken('0xYourTokenAddress');

      // Mint tokens
      await token.mintTo('0xRecipientAddress', '1000');
    }
    `;

    return `Here is an example using Thirdweb SDK:\n\`\`\`js\n${code}\n\`\`\``;
  }

  return 'Unknown build command. Try asking for connect wallet examples, ERC20 transfer code, or SDK usage examples.';
}