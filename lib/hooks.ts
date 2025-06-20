// lib/hooks.ts
export const availableHooks = [
  { 
    name: "None", 
    address: "", 
    description: "Standard swap without hooks" 
  },
  { 
    name: "DynamicFeeHook", 
    address: "0x123abc456def789ghi012jkl345mno678pqr901st", 
    description: "Dynamic fee adjustment based on volatility" 
  },
  { 
    name: "AntiMEVHook", 
    address: "0x987fed654cba321zyx098wvu765tsr432qpo109nm", 
    description: "MEV protection for fair swap execution" 
  },
  { 
    name: "TimeDecayHook", 
    address: "0x456hij789klm012nop345qrs678tuv901wxy234za", 
    description: "Time-based liquidity rewards" 
  },
];

export const HOOK_MAP: Record<string, string> = {
  "dynamicfee": "DynamicFeeHook",
  "dynamic fee": "DynamicFeeHook", 
  "dynamic": "DynamicFeeHook",
  "antimev": "AntiMEVHook",
  "anti mev": "AntiMEVHook",
  "anti-mev": "AntiMEVHook",
  "mev": "AntiMEVHook",
  "timedecay": "TimeDecayHook",
  "time decay": "TimeDecayHook",
  "time-decay": "TimeDecayHook",
  "decay": "TimeDecayHook",
};

export function parseHookCommand(command: string): { hookName: string | null; cleanCommand: string } {
  const lowerCommand = command.toLowerCase();
  
  // Check for "with [hook]" pattern
  const withHookMatch = lowerCommand.match(/(.+?)\s+with\s+(.+?)(?:\s+hook)?$/);
  if (withHookMatch) {
    const [, baseCommand, hookPhrase] = withHookMatch;
    const normalizedHook = hookPhrase.replace(/hook$/, '').trim();
    const hookName = HOOK_MAP[normalizedHook];
    
    if (hookName) {
      return {
        hookName,
        cleanCommand: baseCommand.trim()
      };
    }
  }
  
  return {
    hookName: null,
    cleanCommand: command
  };
}