# Universal FHEVM SDK

A framework-agnostic SDK for working with Fully Homomorphic Encryption (FHE) on the Ethereum Virtual Machine (EVM).

## Overview

The Universal FHEVM SDK provides a modular, framework-agnostic approach to working with FHE operations in decentralized applications. It can be used in:

- React applications
- Vue.js applications
- Node.js servers
- Vanilla JavaScript projects

## Installation

```bash
npm install @fhevm-sdk
```

## Usage

### Core Module

The core module provides framework-independent FHEVM functionality:

```typescript
import { core } from "@fhevm-sdk/universal";

// Create an FHEVM instance
const instance = await core.createUniversalFhevmInstance({
  provider: "https://sepolia.example.com",
  chainId: 11155111
});
```

### Storage Module

Universal storage that works in both browser and Node.js environments:

```typescript
import { storage } from "@fhevm-sdk/universal";

// Get storage instance
const storageInstance = storage.getUniversalStorage();

// Store and retrieve data
await storageInstance.set("key", "value");
const value = await storageInstance.get("key");
```

### React Adapter

React hooks for FHEVM operations:

```typescript
import { react } from "@fhevm-sdk/universal";

function MyComponent() {
  const { instance, status, error } = react.useUniversalFhevm({
    provider: window.ethereum,
    chainId: 1
  });
  
  // ... component logic
}
```

### Vue Adapter

Vue composables for FHEVM operations:

```typescript
import { vue } from "@fhevm-sdk/universal";

export default {
  setup() {
    const { instance, status, error } = vue.useUniversalFhevm({
      provider: window.ethereum,
      chainId: 1
    });
    
    return { instance, status, error };
  }
}
```

### Node.js Utilities

Utilities for server-side FHEVM operations:

```typescript
import { node } from "@fhevm-sdk/universal";

// Create FHEVM instance in Node.js
const instance = await node.createUniversalFhevmInstance({
  provider: "https://sepolia.example.com",
  chainId: 11155111
});
```

## API Reference

### Core API

- `createUniversalFhevmInstance(options)`: Create an FHEVM instance
- `detectEnvironment()`: Detect the current environment (browser/node)

### Storage API

- `getUniversalStorage()`: Get a storage instance for the current environment
- `universalPublicKeyStorageGet(aclAddress)`: Get public key data
- `universalPublicKeyStorageSet(aclAddress, publicKey, publicParams)`: Set public key data

### Utilities API

- `isEthereumAddress(value)`: Check if a value is a valid Ethereum address
- `sleep(ms)`: Sleep for a specified number of milliseconds
- `retryWithBackoff(fn, maxRetries, baseDelay)`: Retry a function with exponential backoff
- `formatBigNumber(value, decimals)`: Format a big number for display

## Examples

See the [examples](../../examples) directory for complete usage examples in different environments.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for information on how to contribute to the Universal FHEVM SDK.