// Reusable React component for FHE encryption

import React, { useState } from "react";
import { useUniversalFhevm } from "./useUniversalFhevm";

interface EncryptionComponentProps {
  provider: string | object | undefined;
  chainId: number;
  onEncrypted?: (handle: unknown) => void;
}

const EncryptionComponent: React.FC<EncryptionComponentProps> = (props: EncryptionComponentProps) => {
  const { provider, chainId, onEncrypted } = props;
  const { instance, status, error } = useUniversalFhevm({
    provider,
    chainId,
    enabled: true
  });
  
  const [inputValue, setInputValue] = useState<string>("");
  const [encryptedHandle, setEncryptedHandle] = useState<any>(null);
  const [isEncrypting, setIsEncrypting] = useState<boolean>(false);
  
  const handleEncrypt = async () => {
    if (!instance || !inputValue) return;
    
    try {
      setIsEncrypting(true);
      // @ts-ignore
      const handle = await instance.encryptUInt32(Number(inputValue));
      setEncryptedHandle(handle);
      if (onEncrypted) {
        onEncrypted(handle);
      }
    } catch (err) {
      console.error("Encryption failed:", err);
    } finally {
      setIsEncrypting(false);
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
    <div className="encryption-component">
      <h3>FHE Encryption</h3>
      <div>
        <input
          type="number"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Enter a number to encrypt"
          disabled={isEncrypting || status !== "ready"}
        />
        <button
          onClick={handleEncrypt}
          disabled={isEncrypting || status !== "ready" || !inputValue}
        >
          {isEncrypting ? "Encrypting..." : "Encrypt"}
        </button>
      </div>
      {encryptedHandle && (
        <div>
          <p>Encrypted Handle: {JSON.stringify(encryptedHandle)}</p>
        </div>
      )}
    </div>
  );
};

export default EncryptionComponent;