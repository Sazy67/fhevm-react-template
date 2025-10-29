<!-- Reusable Vue component for FHE encryption -->

<template>
  <div class="encryption-component">
    <h3>FHE Encryption</h3>
    <div>
      <input
        v-model="inputValue"
        type="number"
        placeholder="Enter a number to encrypt"
        :disabled="isEncrypting || status !== 'ready'"
      />
      <button
        @click="handleEncrypt"
        :disabled="isEncrypting || status !== 'ready' || !inputValue"
      >
        {{ isEncrypting ? "Encrypting..." : "Encrypt" }}
      </button>
    </div>
    <div v-if="encryptedHandle">
      <p>Encrypted Handle: {{ JSON.stringify(encryptedHandle) }}</p>
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
}>();

const emit = defineEmits<{
  (e: 'encrypted', handle: any): void;
}>();

// FHEVM instance
const { instance, status, error } = useUniversalFhevm({
  provider: props.provider,
  chainId: props.chainId,
  enabled: true
});

// Reactive state
const inputValue = ref<string>('');
const encryptedHandle = ref<any>(null);
const isEncrypting = ref<boolean>(false);

// Methods
const handleEncrypt = async () => {
  if (!instance.value || !inputValue.value) return;
  
  try {
    isEncrypting.value = true;
    // @ts-ignore
    const handle = await instance.value.encryptUInt32(Number(inputValue.value));
    encryptedHandle.value = handle;
    emit('encrypted', handle);
  } catch (err) {
    console.error("Encryption failed:", err);
  } finally {
    isEncrypting.value = false;
  }
};
</script>

<style scoped>
.encryption-component {
  padding: 1rem;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.error {
  color: red;
  margin-top: 1rem;
}

input, button {
  margin: 0.5rem;
  padding: 0.5rem;
}
</style>