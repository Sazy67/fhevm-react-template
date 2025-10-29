// Reusable React component for FHE decryption

import React, { useState } from "react";
import { useUniversalFhevm } from "./useUniversalFhevm";

interface DecryptionComponentProps {
  provider: string | object | undefined;
  chainId: number;
  handle: any;
  userAddress: string;
  onDecrypted?: (value: any) => void;
}

const DecryptionComponent: React.FC<DecryptionComponentProps> = (props: DecryptionComponentProps) => {
  const { provider, chainId, handle, userAddress, onDecrypted } = props;
  
  const { instance, status, error } = useUniversalFhevm({
    provider,
    chainId,
    enabled: true
  });
  
  const [decryptedValue, setDecryptedValue] = useState<any>(null);
  const [isDecrypting, setIsDecrypting] = useState<boolean>(false);
  
  const handleDecrypt = async () => {
    if (!instance || !handle) return;
    
    try {
      setIsDecrypting(true);
      // @ts-ignore
      const value = await instance.decrypt(handle, userAddress, provider);
      setDecryptedValue(value);
      if (onDecrypted) {
        onDecrypted(value);
      }
    } catch (err) {
      console.error("Decryption failed:", err);
    } finally {
      setIsDecrypting(false);
    }
  };
  
  if (status === "error") {
    return (
      <div className="error">
        <p>Error: {error?.message}</p>
      </div>
    );
  }
  
  return (
    <div className="decryption-component">
      <h3>FHE Decryption</h3>
      <div>
        <button
          onClick={handleDecrypt}
          disabled={isDecrypting || status !== "ready" || !handle}
        >
          {isDecrypting ? "Decrypting..." : "Decrypt"}
        </button>
      </div>
      {decryptedValue !== null && (
        <div>
          <p>Decrypted Value: {String(decryptedValue)}</p>
        </div>
      )}
    </div>
  );
};

export default DecryptionComponent;