// lib/agentRouter.ts

import { ethers } from "ethers";
import { handleSwap } from './handlers/handleSwap';
import { handleLiquidity } from './handlers/handleLiquidity';
import { handleHooks } from './handlers/handleHooks';
import { handleAgentAssist } from './handlers/handleAgentAssist';
import { handleTransfer } from './handlers/handleTransfer';
import { handleDeploy } from './handlers/handleDeploy';
import { handleInteract } from './handlers/handleInteract';
import { handleExplore } from './handlers/handleExplore';
import { handleResearch } from './handlers/handleResearch';
import { handleUnderstand } from './handlers/handleUnderstand';
import { handleBuild } from './handlers/handleBuild';

type AgentAction = "swap" | "liquidity" | "transfer" | "deploy" | "hooks" | "agent" | "interact" | "explore" | "understand" | "research" | "build" | "default";

export async function handleAgentCommand(command: string, intent: string, signer?: ethers.Signer): Promise<string> {
  console.log(`Agent Command: "${command}" → Intent: "${intent}"`);

  if (intent === 'swap' || intent === 'bridge') return handleSwap(command, signer);
  if (intent === 'liquidity') return handleLiquidity(command, signer);
  if (intent === 'hook') return handleHooks(command, signer);
  if (intent === 'agent') return handleAgentAssist(command, signer);
  if (intent === 'transfer') return handleTransfer(command, signer);
  if (intent === 'deploy') return handleDeploy(command, signer);
  if (intent === 'interact') return handleInteract(command, signer);
  if (intent === 'explore') return handleExplore(command);
  if (intent === 'research') return handleResearch(command);
  if (intent === 'understand') return handleUnderstand(command);
  if (intent === 'build') return handleBuild(command);

  return `Unknown command: "${command}".`;
}

export async function routeAgentQuery(query: string, signer?: ethers.Signer): Promise<string> {
  const lowerQuery = query.toLowerCase();

  // Determine the action based on query content
  const action = determineAction(lowerQuery);

  console.log(`Agent routing query: "${query}" → Action: ${action}`);

  // Route to appropriate handler
  switch (action) {
    case "swap":
      return await handleSwap(query, signer);
    case "liquidity":
      return await handleLiquidity(query, signer);
    case "transfer":
      return await handleTransfer(query, signer);
    case "deploy":
      return await handleDeploy(query, signer);
    case "hooks":
      return await handleHooks(query, signer);
    case "agent":
      return await handleAgentAssist(query, signer);
    case "interact":
      return await handleInteract(query, signer);
    case "explore":
      return await handleExplore(query);
    case "understand":
      return await handleUnderstand(query);
    case "research":
      return await handleResearch(query);
    case "build":
      return await handleBuild(query);
    default:
      return await handleDefault(query);
  }
}











async function handleDefault(query: string): Promise<string> {
  return `I'm not sure how to handle that request: ${query}`;
}

function determineAction(query: string): AgentAction {
  if (query.includes("swap") || query.includes("trade") || query.includes("exchange")) {
    return "swap";
  }
  if (query.includes("liquidity") || query.includes("add liquidity") || query.includes("remove liquidity") || query.includes("pool")) {
    return "liquidity";
  }
  if (query.includes("send") || query.includes("transfer") || query.includes("pay")) {
    return "transfer";
  }
  if (query.includes("deploy") || query.includes("create") || query.includes("launch")) {
    return "deploy";
  }
  if (query.includes("hook") || query.includes("automation") || query.includes("dynamic fee") || query.includes("limit order") || query.includes("mev protection") || query.includes("liquidity rewards")) {
    return "hooks";
  }
  if (query.includes("write hook contract") || query.includes("manage hook") || query.includes("suggest hook") || query.includes("suggest strategy") || query.includes("monitor pool") || query.includes("agent assist")) {
    return "agent";
  }
  if (query.includes("balance") || query.includes("how much") || query.includes("wallet") || query.includes("tokens") || query.includes("eth")) {
    return "interact";
  }
  if (query.includes("what") || query.includes("how") || query.includes("explain")) {
    return "understand";
  }
  if (query.includes("block") || query.includes("gas") || query.includes("latest") || query.includes("network")) {
    return "explore";
  }
  if (query.includes("price") || query.includes("address") || query.includes("analyze") || query.includes("research")) {
    return "research";
  }
  if (query.includes("build") || query.includes("code") || query.includes("example") || query.includes("connect wallet") || query.includes("erc20 transfer") || query.includes("sdk")) {
    return "build";
  }
  return "default";
}