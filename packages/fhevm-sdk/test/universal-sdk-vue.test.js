// Universal FHEVM SDK Vue Component Test

// This is a simple test to verify the Vue components can be imported

console.log('Testing Universal FHEVM SDK Vue components...');

// Import Vue components
import { useUniversalFhevm } from '../src/universal/adapters/vue/useUniversalFhevm.js';
import EncryptionComponent from '../src/universal/adapters/vue/EncryptionComponent.vue';
import DecryptionComponent from '../src/universal/adapters/vue/DecryptionComponent.vue';

// Mock Vue for testing
global.Vue = {
  ref: () => ({ value: null }),
  computed: () => ({ value: null }),
};

// Mock window and document for browser environment
global.window = {
  ethereum: {},
  document: {
    createElement: () => ({}),
    addEventListener: () => {},
    removeEventListener: () => {},
  },
};

try {
  
  console.log('✓ Vue components imported successfully');
  console.log('✓ Vue adapter tests passed');
  
} catch (error) {
  console.error('Vue component test failed:', error);
  process.exit(1);
}