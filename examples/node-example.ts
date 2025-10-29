// Example of using the universal FHEVM SDK in a Node.js environment

import { core, storage, utils } from "@fhevm-sdk/universal";

// Example usage of core functionality
async function example() {
  console.log("Universal FHEVM SDK Node.js Example");
  
  // Example of using utils
  const formatted = utils.formatBigNumber(12345678901234567890n, 18);
  console.log("Formatted big number:", formatted);
  
  // Example of using storage
  const storageInstance = storage.getUniversalStorage();
  await storageInstance.set("example-key", "example-value");
  const value = await storageInstance.get("example-key");
  console.log("Storage value:", value);
  
  // Detect environment
  const env = core.detectEnvironment();
  console.log("Detected environment:", env);
}

// Run the example
example().catch(console.error);