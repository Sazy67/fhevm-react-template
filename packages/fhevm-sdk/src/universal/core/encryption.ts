// Encryption utilities for the universal FHEVM SDK

import type { UniversalFhevmInstance } from "./types";

/**
 * Encrypt a number using the FHEVM instance
 * @param instance The FHEVM instance
 * @param value The number to encrypt
 * @returns The encrypted handle
 */
export const encryptNumber = async (
  instance: UniversalFhevmInstance,
  value: number
): Promise<any> => {
  if (!instance) {
    throw new Error("FHEVM instance is not available");
  }
  
  // @ts-ignore
  return await instance.encryptUInt32(value);
};

/**
 * Encrypt a boolean using the FHEVM instance
 * @param instance The FHEVM instance
 * @param value The boolean to encrypt
 * @returns The encrypted handle
 */
export const encryptBoolean = async (
  instance: UniversalFhevmInstance,
  value: boolean
): Promise<any> => {
  if (!instance) {
    throw new Error("FHEVM instance is not available");
  }
  
  // @ts-ignore
  return await instance.encryptBool(value);
};

/**
 * Encrypt an address using the FHEVM instance
 * @param instance The FHEVM instance
 * @param value The address to encrypt
 * @returns The encrypted handle
 */
export const encryptAddress = async (
  instance: UniversalFhevmInstance,
  value: string
): Promise<any> => {
  if (!instance) {
    throw new Error("FHEVM instance is not available");
  }
  
  // @ts-ignore
  return await instance.encryptAddress(value);
};

/**
 * Encrypt bytes using the FHEVM instance
 * @param instance The FHEVM instance
 * @param value The bytes to encrypt
 * @returns The encrypted handle
 */
export const encryptBytes = async (
  instance: UniversalFhevmInstance,
  value: Uint8Array
): Promise<any> => {
  if (!instance) {
    throw new Error("FHEVM instance is not available");
  }
  
  // @ts-ignore
  return await instance.encryptBytes(value);
};