// Universal FHEVM SDK Node.js Example

import { core, storage, utils } from "@fhevm-sdk/universal";

async function runExample() {
  console.log("Universal FHEVM SDK Node.js Example");
  
  // Example of using core functionality
  console.log("Environment:", core.detectEnvironment());
  
  // Example of using utils
  const formatted = utils.formatBigNumber(12345678901234567890n, 18);
  console.log("Formatted big number:", formatted);
  
  // Example of using storage
  const storageInstance = storage.getUniversalStorage();
  await storageInstance.set("example-key", "example-value");
  const value = await storageInstance.get("example-key");
  console.log("Storage value:", value);
  
  // Example of creating an FHEVM instance (this would require a provider in a real scenario)
  try {
    /*
    const instance = await core.createUniversalFhevmInstance({
      provider: "https://sepolia.example.com",
      chainId: 11155111
    });
    console.log("FHEVM instance created:", !!instance);
    */
    console.log("FHEVM instance creation example (commented out for this demo)");
  } catch (error) {
    console.error("Failed to create FHEVM instance:", error);
  }
}

// Run the example
runExample().catch(console.error);

export default runExample;