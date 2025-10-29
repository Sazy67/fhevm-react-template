<!-- Universal FHEVM SDK Vue Example -->

<template>
  <div class="universal-vue-example">
    <h1>Universal FHEVM SDK Vue Example</h1>
    
    <div>
      <h2>FHEVM Status</h2>
      <p>Status: {{ status }}</p>
      <p v-if="error">Error: {{ error.message }}</p>
    </div>
    
    <div>
      <h2>Encryption</h2>
      <input
        v-model="inputValue"
        type="number"
        placeholder="Enter a number to encrypt"
        :disabled="status !== 'ready'"
      />
      <button
        @click="handleEncrypt"
        :disabled="status !== 'ready' || !inputValue"
      >
        Encrypt
      </button>
      <div v-if="encryptedHandle">
        <p>Encrypted Handle: {{ JSON.stringify(encryptedHandle) }}</p>
      </div>
    </div>
    
    <div>
      <h2>Decryption</h2>
      <button
        @click="handleDecrypt"
        :disabled="status !== 'ready' || !encryptedHandle"
      >
        Decrypt
      </button>
      <div v-if="decryptedValue !== null">
        <p>Decrypted Value: {{ String(decryptedValue) }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { vue } from '@fhevm-sdk/universal';

// Reactive state
const inputValue = ref<string>('');
const encryptedHandle = ref<any>(null);
const decryptedValue = ref<any>(null);

// FHEVM instance
const { instance, status, error } = vue.useUniversalFhevm({
  provider: typeof window !== 'undefined' ? (window as any).ethereum : undefined,
  chainId: 11155111, // Sepolia testnet
  enabled: true,
});

// Encryption handler
const handleEncrypt = async () => {
  if (!instance.value || !inputValue.value) return;
  
  try {
    // @ts-ignore
    const handle = await instance.value.encryptUInt32(Number(inputValue.value));
    encryptedHandle.value = handle;
  } catch (err) {
    console.error("Encryption failed:", err);
  }
};

// Decryption handler
const handleDecrypt = async () => {
  if (!instance.value || !encryptedHandle.value) return;
  
  try {
    // @ts-ignore
    const value = await instance.value.decrypt(encryptedHandle.value, "0xUserAddress", (window as any).ethereum);
    decryptedValue.value = value;
  } catch (err) {
    console.error("Decryption failed:", err);
  }
};
</script>

<style scoped>
.universal-vue-example {
  padding: 1rem;
}

input, button {
  margin: 0.5rem;
  padding: 0.5rem;
}
</style>