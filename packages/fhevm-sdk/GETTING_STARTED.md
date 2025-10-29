# Getting Started with Universal FHEVM SDK

This guide will help you get started with the Universal FHEVM SDK in your project.

## Prerequisites

- Node.js >= 18.0.0
- npm or yarn package manager
- An Ethereum provider (MetaMask, WalletConnect, etc.)

## Installation

Install the Universal FHEVM SDK using npm:

```bash
npm install @fhevm-sdk
```

Or using yarn:

```bash
yarn add @fhevm-sdk
```

## Quick Setup

### 1. Basic Import

Import the modules you need:

```typescript
// For core functionality
import { core } from "@fhevm-sdk/universal";

// For React applications
import { react } from "@fhevm-sdk/universal";

// For Vue applications
import { vue } from "@fhevm-sdk/universal";

// For Node.js applications
import { node } from "@fhevm-sdk/universal";

// For storage utilities
import { storage } from "@fhevm-sdk/universal";

// For utility functions
import { utils } from "@fhevm-sdk/universal";
```

### 2. Create an FHEVM Instance

```typescript
import { core } from "@fhevm-sdk/universal";

const instance = await core.createUniversalFhevmInstance({
  provider: window.ethereum, // or your RPC endpoint
  chainId: 11155111, // Sepolia testnet
});
```

### 3. Encrypt Data

```typescript
import { core } from "@fhevm-sdk/universal";

// Encrypt a number
const encryptedNumber = await core.encryptNumber(instance, 42);

// Encrypt a boolean
const encryptedBoolean = await core.encryptBoolean(instance, true);
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
```

## Framework-Specific Setup

### React Setup

```typescript
import { react } from "@fhevm-sdk/universal";

function MyFHEComponent() {
  const { instance, status, error } = react.useUniversalFhevm({
    provider: window.ethereum,
    chainId: 11155111, // Sepolia
    enabled: true,
  });

  if (status === "loading") return <div>Loading FHEVM...</div>;
  if (status === "error") return <div>Error: {error?.message}</div>;
  if (!instance) return <div>FHEVM not available</div>;

  return <div>FHEVM is ready!</div>;
}
```

### Vue Setup

```typescript
import { vue } from "@fhevm-sdk/universal";

export default {
  setup() {
    const { instance, status, error } = vue.useUniversalFhevm({
      provider: window.ethereum,
      chainId: 11155111, // Sepolia
      enabled: true,
    });

    return { instance, status, error };
  }
}
```

### Node.js Setup

```typescript
import { node } from "@fhevm-sdk/universal";

async function setupFHEVM() {
  const instance = await node.createUniversalFhevmInstance({
    provider: "https://sepolia.example.com",
    chainId: 11155111,
  });
  
  return instance;
}
```

## Using Reusable Components

### React Components

```typescript
import { react } from "@fhevm-sdk/universal";

function MyComponent() {
  return (
    <div>
      <react.EncryptionComponent
        provider={window.ethereum}
        chainId={11155111}
        onEncrypted={(handle) => console.log("Encrypted:", handle)}
      />
      
      <react.DecryptionComponent
        provider={window.ethereum}
        chainId={11155111}
        handle={encryptedHandle}
        userAddress="0xUserAddress"
        onDecrypted={(value) => console.log("Decrypted:", value)}
      />
    </div>
  );
}
```

## Storage Utilities

The SDK provides universal storage that works in both browser and Node.js environments:

```typescript
import { storage } from "@fhevm-sdk/universal";

const storageInstance = storage.getUniversalStorage();
await storageInstance.set("my-key", "my-value");
const value = await storageInstance.get("my-key");
```

## Utility Functions

The SDK includes helpful utility functions:

```typescript
import { utils } from "@fhevm-sdk/universal";

// Format big numbers
const formatted = utils.formatBigNumber(12345678901234567890n, 18);

// Sleep function
await utils.sleep(1000); // Sleep for 1 second

// Retry with backoff
const result = await utils.retryWithBackoff(async () => {
  // Some operation that might fail
  return await someOperation();
});
```

## Next Steps

1. Check out the [full API reference](UNIVERSAL_SDK_README.md)
2. Explore the [examples](../examples) directory
3. Learn about [encryption and decryption flows](UNIVERSAL_SDK_README.md#api-reference)
4. Understand [storage utilities](UNIVERSAL_SDK_README.md#storage-module)

## Troubleshooting

### Common Issues

1. **"window is not defined"**: This error occurs when using browser-specific code in Node.js. Use environment detection:

```typescript
import { core } from "@fhevm-sdk/universal";

const env = core.detectEnvironment();
if (env === "browser") {
  // Browser-specific code
} else if (env === "node") {
  // Node.js-specific code
}
```

2. **TypeScript errors**: Make sure you have the required type definitions installed:

```bash
npm install --save-dev @types/node @types/react
```

### Getting Help

- Check the [API documentation](UNIVERSAL_SDK_README.md)
- Review the [examples](../examples)
- Open an issue on GitHub if you encounter problems