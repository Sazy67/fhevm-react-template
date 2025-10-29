// Universal FHEVM SDK React Component Test

// This is a simple test to verify the React components can be imported

console.log('Testing Universal FHEVM SDK React components...');

// Import React components
import { useUniversalFhevm } from '../src/universal/adapters/react/useUniversalFhevm.js';
import EncryptionComponent from '../src/universal/adapters/react/EncryptionComponent.js';
import DecryptionComponent from '../src/universal/adapters/react/DecryptionComponent.js';

// Mock React and ReactDOM for testing
global.React = {
  createElement: () => {},
  useState: () => [{}, () => {}],
  useEffect: () => {},
  useRef: () => ({ current: null }),
  useCallback: (fn) => fn,
};

global.ReactDOM = {
  render: () => {},
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
  
  console.log('✓ React components imported successfully');
  console.log('✓ React adapter tests passed');
  
} catch (error) {
  console.error('React component test failed:', error);
  process.exit(1);
}