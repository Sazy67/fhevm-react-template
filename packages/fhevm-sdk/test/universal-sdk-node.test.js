// Universal FHEVM SDK Node.js Test

// This is a simple test script to verify the SDK works in Node.js environment

console.log('Testing Universal FHEVM SDK in Node.js environment...');

// Import the SDK
import { core, storage, utils } from '../src/universal/index.js';

async function runTests() {
  try {
    console.log('\n1. Testing core module...');
    
    // Test environment detection
    const env = core.detectEnvironment();
    console.log('   Environment:', env);
    
    console.log('   Core functions available');
    
    console.log('\n2. Testing storage module...');
    
    // Test storage
    const storageInstance = storage.getUniversalStorage();
    console.log('   Storage instance:', !!storageInstance);
    
    // Test storing and retrieving values
    const testKey = 'test-key';
    const testValue = 'test-value';
    
    await storageInstance.set(testKey, testValue);
    const retrievedValue = await storageInstance.get(testKey);
    
    console.log('   Stored value:', testValue);
    console.log('   Retrieved value:', retrievedValue);
    
    if (retrievedValue === testValue) {
      console.log('   ✓ Storage test passed');
    } else {
      console.log('   ✗ Storage test failed');
    }
    
    await storageInstance.remove(testKey);
    
    console.log('\n3. Testing utils module...');
    
    // Test utility functions
    const formatted = utils.formatBigNumber(12345678901234567890n, 18);
    console.log('   Formatted big number:', formatted);
    
    const isValidAddress = utils.isEthereumAddress('0x1234567890123456789012345678901234567890');
    console.log('   Valid Ethereum address:', isValidAddress);
    
    console.log('\n✓ All tests completed');
    
  } catch (error) {
    console.error('Test failed:', error);
    process.exit(1);
  }
}

// Run the tests
runTests();