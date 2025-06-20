import { useEffect, useState } from "react";
import { baseSepoliaTokens } from "../lib/baseSepoliaTokens";
import { ethers } from "ethers";

const erc20ABI = [
  "function balanceOf(address owner) view returns (uint256)",
  "function decimals() view returns (uint8)"
];

export function useTokenBalances(walletAddress: string | undefined) {
  const [balances, setBalances] = useState<Record<string, string>>({});

  useEffect(() => {
    async function fetchBalances() {
      if (!walletAddress) {
        setBalances({});
        return;
      }

      try {
        const provider = new ethers.providers.JsonRpcProvider("https://sepolia.base.org");
        const result: Record<string, string> = {};

        for (const token of baseSepoliaTokens) {
          try {
            if (token.symbol === "ETH" && (token.address === "0x0000000000000000000000000000000000000000" || token.address === "")) {
              // For native ETH, get balance directly
              const balance = await provider.getBalance(walletAddress);
              const formatted = parseFloat(ethers.utils.formatEther(balance)).toFixed(4);
              result[token.symbol] = formatted;
            } else if (token.address && token.address !== "") {
              // For ERC20 tokens, use contract calls with better error handling
              const checksumAddress = ethers.utils.getAddress(token.address);
              const contract = new ethers.Contract(checksumAddress, erc20ABI, provider);
              
              // First check if contract exists
              const code = await provider.getCode(checksumAddress);
              if (code === "0x") {
                console.log(`${token.symbol} contract not found at ${checksumAddress}`);
                result[token.symbol] = "0.0000";
                continue;
              }
              
              const balance = await contract.balanceOf(walletAddress);
              const formatted = parseFloat(ethers.utils.formatUnits(balance, token.decimals)).toFixed(token.decimals === 8 ? 8 : 4);
              result[token.symbol] = formatted;
            }
          } catch (error) {
            console.log(`Error fetching ${token.symbol} balance:`, error);
            result[token.symbol] = "0.0000";
          }
        }

        setBalances(result);
      } catch (error) {
        console.error('Error fetching token balances:', error);
        setBalances({});
      }
    }

    fetchBalances();
  }, [walletAddress]);

  return balances;
}