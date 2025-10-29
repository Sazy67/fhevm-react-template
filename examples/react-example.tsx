// Example of using the universal FHEVM SDK in a React component

import React from "react";
import { useUniversalFhevm } from "@fhevm-sdk/universal/react";

const UniversalFhevmExample: React.FC = () => {
  // Example usage of the React hook
  const { instance, status, error } = useUniversalFhevm({
    provider: typeof window !== 'undefined' ? (window as any).ethereum : undefined,
    chainId: 1, // Ethereum mainnet
    enabled: true,
  });

  return (
    <div>
      <h1>Universal FHEVM SDK React Example</h1>
      <p>Status: {status}</p>
      <p>Instance: {instance ? "Available" : "Not available"}</p>
      {error && <p>Error: {error.message}</p>}
    </div>
  );
};

export default UniversalFhevmExample;