// Contract configuration and ABI
export const FINANCE_ORACLE_ADDRESS = (process.env['NEXT_PUBLIC_FINANCE_ORACLE_ADDRESS'] || "0xYourDeployedContractAddressHere") as `0x${string}`;

export const FINANCE_ORACLE_ABI = [
  // Add your contract ABI here
  // This should be generated from your compiled contract
] as const;

// FHE encryption utilities (simplified for demo)
export const encryptString = (str: string): string => {
  // In a real implementation, this would use FHE encryption
  // For demo purposes, we'll use a simple hash
  return '0x' + Buffer.from(str).toString('hex').padEnd(64, '0');
};

export const encryptNumber = (num: number): number => {
  // In a real implementation, this would use FHE encryption
  // For demo purposes, we'll return the number as-is
  return num;
};

export const decryptString = (encrypted: string): string => {
  // In a real implementation, this would use FHE decryption
  // For demo purposes, we'll decode the hex
  try {
    return Buffer.from(encrypted.slice(2), 'hex').toString().replace(/\0/g, '');
  } catch {
    return encrypted;
  }
};

export const decryptNumber = (encrypted: number): number => {
  // In a real implementation, this would use FHE decryption
  // For demo purposes, we'll return the number as-is
  return encrypted;
};

// Contract interaction utilities
export const formatAssetHash = (asset: string): string => {
  return encryptString(asset);
};

export const formatTimestamp = (timestamp: number): string => {
  return encryptString(timestamp.toString());
};

export const formatDataHash = (data: any): string => {
  const dataString = JSON.stringify(data);
  return encryptString(dataString);
};

// Data validation utilities
export const validateAssetSymbol = (symbol: string): boolean => {
  return /^[A-Z]{2,10}$/.test(symbol);
};

export const validatePrice = (price: number): boolean => {
  return price > 0 && price < 1000000; // Max $1M for demo
};

export const validateVolume = (volume: number): boolean => {
  return volume >= 0 && volume < 1000000000000; // Max 1T for demo
};

export const validateMarketCap = (marketCap: number): boolean => {
  return marketCap >= 0 && marketCap < 10000000000000; // Max 10T for demo
};

// Error handling
export class ContractError extends Error {
  constructor(message: string, public code?: string) {
    super(message);
    this.name = 'ContractError';
  }
}

export const handleContractError = (error: any): string => {
  if (error.message?.includes('Only oracle can')) {
    return 'Only authorized oracles can perform this action';
  }
  if (error.message?.includes('not found')) {
    return 'Data not found on the blockchain';
  }
  if (error.message?.includes('not active')) {
    return 'This data is no longer active';
  }
  if (error.message?.includes('Already subscribed')) {
    return 'You are already subscribed to this asset';
  }
  return error.message || 'An error occurred while interacting with the contract';
};
