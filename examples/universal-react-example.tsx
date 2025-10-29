// Universal FHEVM SDK React Example

import React, { useState } from "react";
import { react } from "@fhevm-sdk/universal";

const UniversalReactExample: React.FC = () => {
  const [inputValue, setInputValue] = useState<string>("");
  const [encryptedHandle, setEncryptedHandle] = useState<any>(null);
  const [decryptedValue, setDecryptedValue] = useState<any>(null);
  
  // FHEVM instance
  const { instance, status, error } = react.useUniversalFhevm({
    provider: typeof window !== 'undefined' ? (window as any).ethereum : undefined,
    chainId: 11155111, // Sepolia testnet
    enabled: true,
  });

  // Encryption handler
  const handleEncrypt = async () => {
    if (!instance || !inputValue) return;
    
    try {
      // @ts-ignore
      const handle = await instance.encryptUInt32(Number(inputValue));
      setEncryptedHandle(handle);
    } catch (err) {
      console.error("Encryption failed:", err);
    }
  };

  // Decryption handler
  const handleDecrypt = async () => {
    if (!instance || !encryptedHandle) return;
    
    try {
      // @ts-ignore
      const value = await instance.decrypt(encryptedHandle, "0xUserAddress", (window as any).ethereum);
      setDecryptedValue(value);
    } catch (err) {
      console.error("Decryption failed:", err);
    }
  };

  return (
    <div className="universal-react-example">
      <h1>Universal FHEVM SDK React Example</h1>
      
      <div>
        <h2>FHEVM Status</h2>
        <p>Status: {status}</p>
        {error && <p>Error: {error.message}</p>}
      </div>
      
      <div>
        <h2>Encryption</h2>
        <input
          type="number"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Enter a number to encrypt"
          disabled={status !== "ready"}
        />
        <button
          onClick={handleEncrypt}
          disabled={status !== "ready" || !inputValue}
        >
          Encrypt
        </button>
        {encryptedHandle && (
          <div>
            <p>Encrypted Handle: {JSON.stringify(encryptedHandle)}</p>
          </div>
        )}
      </div>
      
      <div>
        <h2>Decryption</h2>
        <button
          onClick={handleDecrypt}
          disabled={status !== "ready" || !encryptedHandle}
        >
          Decrypt
        </button>
        {decryptedValue !== null && (
          <div>
            <p>Decrypted Value: {String(decryptedValue)}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UniversalReactExample;