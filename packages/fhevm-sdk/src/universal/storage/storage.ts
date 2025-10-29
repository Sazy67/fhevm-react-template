// Universal storage implementation that works in both browser and Node.js environments
import { detectEnvironment } from "../core/fhevm";

// Types
export interface PublicKeyData {
  publicKey: string;
  publicParams: string;
}

// Storage interface
export interface UniversalStorage {
  get: (key: string) => Promise<string | null>;
  set: (key: string, value: string) => Promise<void>;
  remove: (key: string) => Promise<void>;
}

// Browser storage implementation using localStorage
class BrowserStorage implements UniversalStorage {
  async get(key: string): Promise<string | null> {
    if (typeof localStorage === 'undefined') {
      return null;
    }
    return localStorage.getItem(key);
  }

  async set(key: string, value: string): Promise<void> {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(key, value);
    }
  }

  async remove(key: string): Promise<void> {
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem(key);
    }
  }
}

// In-memory storage for Node.js or when localStorage is not available
class InMemoryStorage implements UniversalStorage {
  private storage: Map<string, string> = new Map();

  async get(key: string): Promise<string | null> {
    return this.storage.get(key) || null;
  }

  async set(key: string, value: string): Promise<void> {
    this.storage.set(key, value);
  }

  async remove(key: string): Promise<void> {
    this.storage.delete(key);
  }
}

// Get the appropriate storage implementation based on environment
export const getUniversalStorage = (): UniversalStorage => {
  const env = detectEnvironment();
  
  if (env === 'browser') {
    // In browser environment, try to use localStorage
    if (typeof localStorage !== 'undefined') {
      return new BrowserStorage();
    }
  }
  
  // Fall back to in-memory storage
  return new InMemoryStorage();
};

// Specific functions for FHEVM public key storage
export const universalPublicKeyStorageGet = async (aclAddress: string): Promise<PublicKeyData> => {
  const storage = getUniversalStorage();
  const publicKey = await storage.get(`fhevm:publicKey:${aclAddress}`) || '';
  const publicParams = await storage.get(`fhevm:publicParams:${aclAddress}`) || '';
  
  return { publicKey, publicParams };
};

export const universalPublicKeyStorageSet = async (
  aclAddress: string,
  publicKey: string,
  publicParams: string
): Promise<void> => {
  const storage = getUniversalStorage();
  await storage.set(`fhevm:publicKey:${aclAddress}`, publicKey);
  await storage.set(`fhevm:publicParams:${aclAddress}`, publicParams);
};