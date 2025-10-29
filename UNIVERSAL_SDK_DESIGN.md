# Universal FHEVM SDK Architecture Design

## Overview
This document outlines the architecture for a universal FHEVM SDK that can be used across different frontend frameworks and environments.

## Core Principles
1. **Framework Agnostic**: Core functionality works in any JavaScript environment
2. **Modular Design**: Developers can import only what they need
3. **Wagmi-like API**: Familiar patterns for web3 developers
4. **Extensible**: Easy to add support for new frameworks

## Architecture Structure

### 1. Core Module (`@fhevm/sdk/core`)
- Framework-independent FHEVM functionality
- Environment detection and abstraction
- Core encryption/decryption operations
- Network and provider management

### 2. Storage Module (`@fhevm/sdk/storage`)
- Universal storage solutions (IndexedDB, localStorage, in-memory)
- Works in browser and Node.js environments
- Pluggable storage backends

### 3. Adapter Modules
#### React Adapter (`@fhevm/sdk/react`)
- React hooks for FHEVM operations
- Context providers for state management
- Component wrappers

#### Vue Adapter (`@fhevm/sdk/vue`)
- Vue composables for FHEVM operations
- Plugin for Vue applications
- Component helpers

#### Node.js Utilities (`@fhevm/sdk/node`)
- Utilities for server-side FHEVM operations
- CLI tools for development workflows

### 4. Utilities Module (`@fhevm/sdk/utils`)
- Helper functions for common operations
- Type definitions and interfaces
- Error handling utilities

## API Design

### Core API
```typescript
import { createFhevmInstance } from '@fhevm/sdk/core';

const instance = await createFhevmInstance({
  provider: 'https://sepolia.example.com',
  chainId: 11155111
});
```

### React Adapter
```typescript
import { useFhevm } from '@fhevm/sdk/react';

function MyComponent() {
  const { instance, status, error } = useFhevm({
    provider: window.ethereum,
    chainId: 1
  });
  
  // ... component logic
}
```

### Vue Adapter
```typescript
import { useFhevm } from '@fhevm/sdk/vue';

export default {
  setup() {
    const { instance, status, error } = useFhevm({
      provider: window.ethereum,
      chainId: 1
    });
    
    return { instance, status, error };
  }
}
```

## Implementation Plan

1. Refactor existing core functionality to be framework-agnostic
2. Create environment abstraction layer
3. Implement adapter modules for each framework
4. Develop comprehensive documentation and examples
5. Create CLI tools for easy project setup