<!-- Reusable Vue component for FHE decryption -->

<template>
  <div class="decryption-component">
    <h3>FHE Decryption</h3>
    <div>
      <button
        @click="handleDecrypt"
        :disabled="isDecrypting || status !== 'ready' || !handle"
      >
        {{ isDecrypting ? "Decrypting..." : "Decrypt" }}
      </button>
    </div>
    <div v-if="decryptedValue !== null">
      <p>Decrypted Value: {{ String(decryptedValue) }}</p>
    </div>
    <div v-if="status === 'error'" class="error">
      <p>Error: {{ error?.message }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useUniversalFhevm } from './useUniversalFhevm';

// Props
const props = defineProps<{
  provider: string | object | undefined;
  chainId: number;
  handle: any;
  userAddress: string;
}>();

const emit = defineEmits<{
  (e: 'decrypted', value: any): void;
}>();

// FHEVM instance
const { instance, status, error } = useUniversalFhevm({
  provider: props.provider,
  chainId: props.chainId,
  enabled: true
});

// Reactive state
const decryptedValue = ref<any>(null);
const isDecrypting = ref<boolean>(false);

// Methods
const handleDecrypt = async () => {
  if (!instance.value || !props.handle) return;
  
  try {
    isDecrypting.value = true;
    // @ts-ignore
    const value = await instance.value.decrypt(props.handle, props.userAddress, props.provider);
    decryptedValue.value = value;
    emit('decrypted', value);
  } catch (err) {
    console.error("Decryption failed:", err);
  } finally {
    isDecrypting.value = false;
  }
};
</script>

<style scoped>
.decryption-component {
  padding: 1rem;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.error {
  color: red;
  margin-top: 1rem;
}

button {
  margin: 0.5rem;
  padding: 0.5rem;
}
</style>