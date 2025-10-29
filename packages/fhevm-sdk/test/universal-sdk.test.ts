// Universal FHEVM SDK Tests

import { describe, it, expect } from 'vitest';
import { core, storage, utils } from '../src/universal/index';

describe('Universal FHEVM SDK', () => {
  describe('Core Module', () => {
    it('should detect environment', () => {
      // @ts-ignore
      const env = core.detectEnvironment();
      expect(['browser', 'node', 'unknown']).toContain(env);
    });

    it('should have core functions', () => {
      // @ts-ignore
      expect(typeof core.createUniversalFhevmInstance).toBe('function');
      // @ts-ignore
      expect(typeof core.encryptNumber).toBe('function');
      // @ts-ignore
      expect(typeof core.encryptBoolean).toBe('function');
    });
  });

  describe('Storage Module', () => {
    it('should provide universal storage', () => {
      // @ts-ignore
      const storageInstance = storage.getUniversalStorage();
      expect(storageInstance).toBeDefined();
      expect(typeof storageInstance.get).toBe('function');
      expect(typeof storageInstance.set).toBe('function');
      expect(typeof storageInstance.remove).toBe('function');
    });

    it('should store and retrieve values', async () => {
      // @ts-ignore
      const storageInstance = storage.getUniversalStorage();
      const testKey = 'test-key';
      const testValue = 'test-value';
      
      await storageInstance.set(testKey, testValue);
      const retrievedValue = await storageInstance.get(testKey);
      
      expect(retrievedValue).toBe(testValue);
      
      await storageInstance.remove(testKey);
      const removedValue = await storageInstance.get(testKey);
      expect(removedValue).toBeNull();
    });
  });

  describe('Utils Module', () => {
    it('should validate Ethereum addresses', () => {
      // @ts-ignore
      expect(utils.isEthereumAddress('0x1234567890123456789012345678901234567890')).toBe(true);
      // @ts-ignore
      expect(utils.isEthereumAddress('invalid-address')).toBe(false);
    });

    it('should format big numbers', () => {
      // @ts-ignore
      const formatted = utils.formatBigNumber(12345678901234567890n, 18);
      expect(typeof formatted).toBe('string');
    });
  });
});