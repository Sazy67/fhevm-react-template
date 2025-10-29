# Universal FHEVM SDK

A framework-agnostic SDK for working with Fully Homomorphic Encryption (FHE) on the Ethereum Virtual Machine (EVM).

## Overview

The Universal FHEVM SDK provides a modular, framework-agnostic approach to working with FHE operations in decentralized applications. It can be used in:

- React applications
- Vue.js applications
- Node.js servers
- Vanilla JavaScript projects

## Features

- ✅ Framework-agnostic core functionality
- ✅ React hooks and components
- ✅ Vue composables and components
- ✅ Node.js utilities
- ✅ Universal storage (works in browser and Node.js)
- ✅ Environment detection
- ✅ Encryption and decryption utilities
- ✅ Reusable UI components
- ✅ TypeScript support
- ✅ Modular API structure (wagmi-like)

## Installation

```bash
npm install @fhevm-sdk
```

## Quick Start

### 1. Import the SDK

```typescript
import { core, react, vue, node, storage, utils } from "@fhevm-sdk/universal";
```

### 2. Create an FHEVM Instance

```typescript
import { core } from "@fhevm-sdk/universal";

const instance = await core.createUniversalFhevmInstance({
  provider: "https://sepolia.example.com",
  chainId: 11155111
});
```

### 3. Encrypt Data

```typescript
import { core } from "@fhevm-sdk/universal";

// Encrypt a number
const encryptedNumber = await core.encryptNumber(instance, 42);

// Encrypt a boolean
const encryptedBoolean = await core.encryptBoolean(instance, true);

// Encrypt an address
const encryptedAddress = await core.encryptAddress(instance, "0x123...");
```

### 4. Decrypt Data

```typescript
import { core } from "@fhevm-sdk/universal";

// Decrypt with EIP-712 signing
const decryptedValue = await core.decryptWithEIP712(
  instance, 
  encryptedHandle, 
  userAddress, 
  provider
);

// Public decrypt (no signing required)
const publicDecryptedValue = await core.publicDecrypt(instance, encryptedHandle);
```

## Framework-Specific Usage

### React

```typescript
import { react } from "@fhevm-sdk/universal";

function MyComponent() {
  const { instance, status, error } = react.useUniversalFhevm({
    provider: window.ethereum,
    chainId: 1
  });
  
  // Use reusable components
  return (
    <div>
      <react.EncryptionComponent 
        provider={window.ethereum}
        chainId={1}
        onEncrypted={(handle) => console.log("Encrypted:", handle)}
      />
      <react.DecryptionComponent
        provider={window.ethereum}
        chainId={1}
        handle={encryptedHandle}
        userAddress="0xUserAddress"
        onDecrypted={(value) => console.log("Decrypted:", value)}
      />
    </div>
  );
}
```

### Vue

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

```vue
<template>
  <div>
    <vue.EncryptionComponent 
      :provider="window.ethereum"
      :chain-id="1"
      @encrypted="handleEncrypted"
    />
    <vue.DecryptionComponent
      :provider="window.ethereum"
      :chain-id="1"
      :handle="encryptedHandle"
      :user-address="userAddress"
      @decrypted="handleDecrypted"
    />
  </div>
</template>
```

### Node.js

```typescript
import { node } from "@fhevm-sdk/universal";

// Create FHEVM instance in Node.js
const instance = await node.createUniversalFhevmInstance({
  provider: "https://sepolia.example.com",
  chainId: 11155111
});

// Use storage utilities
const storageInstance = node.getUniversalStorage();
await storageInstance.set("key", "value");
const value = await storageInstance.get("key");
```

## API Reference

### Core Module

- `createUniversalFhevmInstance(options)`: Create an FHEVM instance
- `detectEnvironment()`: Detect the current environment (browser/node)
- `encryptNumber(instance, value)`: Encrypt a number
- `encryptBoolean(instance, value)`: Encrypt a boolean
- `encryptAddress(instance, value)`: Encrypt an address
- `encryptBytes(instance, value)`: Encrypt bytes
- `decryptWithEIP712(instance, handle, userAddress, provider)`: Decrypt with EIP-712 signing
- `publicDecrypt(instance, handle)`: Public decrypt (no signing required)
- `createDecryptionSignature(instance, handle, userAddress, provider)`: Create decryption signature

### Storage Module

- `getUniversalStorage()`: Get a storage instance for the current environment
- `universalPublicKeyStorageGet(aclAddress)`: Get public key data
- `universalPublicKeyStorageSet(aclAddress, publicKey, publicParams)`: Set public key data

### Utilities Module

- `isEthereumAddress(value)`: Check if a value is a valid Ethereum address
- `sleep(ms)`: Sleep for a specified number of milliseconds
- `retryWithBackoff(fn, maxRetries, baseDelay)`: Retry a function with exponential backoff
- `formatBigNumber(value, decimals)`: Format a big number for display

## Examples

See the [examples](../../examples) directory for complete usage examples in different environments:

- [React Example](../../examples/universal-react-example.tsx)
- [Vue Example](../../examples/universal-vue-example.vue)
- [Node.js Example](../../examples/universal-node-example.ts)
- [Vanilla JavaScript Example](../../examples/universal-vanilla-example.html)

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for information on how to contribute to the Universal FHEVM SDK.

## License

This project is licensed under the BSD-3-Clause-Clear License.