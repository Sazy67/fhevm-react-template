// Decryption utilities for the universal FHEVM SDK

import type { UniversalFhevmInstance } from "./types";

/**
 * Decrypt a handle using the FHEVM instance with EIP-712 signing
 * @param instance The FHEVM instance
 * @param handle The encrypted handle to decrypt
 * @param userAddress The user's Ethereum address
 * @param provider The Ethereum provider
 * @returns The decrypted value
 */
export const decryptWithEIP712 = async (
  instance: UniversalFhevmInstance,
  handle: any,
  userAddress: string,
  provider: any
): Promise<any> => {
  if (!instance) {
    throw new Error("FHEVM instance is not available");
  }
  
  if (!handle) {
    throw new Error("Handle is required for decryption");
  }
  
  // @ts-ignore
  return await instance.decrypt(handle, userAddress, provider);
};

/**
 * Public decrypt (no signing required)
 * @param instance The FHEVM instance
 * @param handle The encrypted handle to decrypt
 * @returns The decrypted value
 */
export const publicDecrypt = async (
  instance: UniversalFhevmInstance,
  handle: any
): Promise<any> => {
  if (!instance) {
    throw new Error("FHEVM instance is not available");
  }
  
  if (!handle) {
    throw new Error("Handle is required for decryption");
  }
  
  // @ts-ignore
  return await instance.publicDecrypt(handle);
};

/**
 * Create a decryption signature for EIP-712
 * @param instance The FHEVM instance
 * @param handle The encrypted handle
 * @param userAddress The user's Ethereum address
 * @param provider The Ethereum provider
 * @returns The decryption signature
 */
export const createDecryptionSignature = async (
  instance: UniversalFhevmInstance,
  handle: any,
  userAddress: string,
  provider: any
): Promise<string> => {
  if (!instance) {
    throw new Error("FHEVM instance is not available");
  }
  
  if (!handle) {
    throw new Error("Handle is required for decryption signature");
  }
  
  // @ts-ignore
  return await instance.createDecryptionSignature(handle, userAddress, provider);
};