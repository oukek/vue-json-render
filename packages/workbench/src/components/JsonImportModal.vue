<template>
  <div v-if="visible" class="modal-overlay" @click.self="close">
    <div class="modal-content">
      <div class="modal-header">
        <h3>导入 JSON</h3>
        <button class="close-btn" @click="close">×</button>
      </div>
      
      <div class="modal-body">
        <textarea 
          v-model="jsonContent" 
          class="json-input" 
          placeholder="在此粘贴 JSON 数据..."
        ></textarea>
        <div v-if="error" class="error-msg">{{ error }}</div>
      </div>
      
      <div class="modal-footer">
        <button class="btn btn-secondary" @click="close">取消</button>
        <button class="btn btn-primary" @click="confirm" :disabled="!jsonContent">导入</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';

const props = defineProps<{
  visible: boolean;
}>();

const emit = defineEmits(['update:visible', 'import']);

const jsonContent = ref('');
const error = ref('');

watch(() => props.visible, (val) => {
  if (val) {
    jsonContent.value = '';
    error.value = '';
  }
});

const close = () => {
  emit('update:visible', false);
};

const confirm = () => {
  try {
    if (!jsonContent.value.trim()) return;
    const parsed = JSON.parse(jsonContent.value);
    emit('import', parsed);
    close();
  } catch (e) {
    error.value = 'JSON 格式错误，请检查输入';
  }
};
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1100;
}

.modal-content {
  background-color: white;
  border-radius: 8px;
  width: 600px;
  max-width: 90%;
  display: flex;
  flex-direction: column;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.modal-header {
  padding: 16px 20px;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-header h3 {
  margin: 0;
  font-size: 18px;
  color: #111827;
}

.close-btn {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #6b7280;
}

.modal-body {
  padding: 20px;
}

.json-input {
  width: 100%;
  height: 300px;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  padding: 12px;
  font-family: monospace;
  resize: vertical;
}

.error-msg {
  color: #ef4444;
  margin-top: 8px;
  font-size: 14px;
}

.modal-footer {
  padding: 16px 20px;
  border-top: 1px solid #e5e7eb;
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

.btn {
  padding: 8px 16px;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
  border: none;
}

.btn-secondary {
  background-color: white;
  border: 1px solid #d1d5db;
  color: #374151;
}

.btn-secondary:hover {
  background-color: #f3f4f6;
}

.btn-primary {
  background-color: #4f46e5;
  color: white;
}

.btn-primary:hover {
  background-color: #4338ca;
}

.btn-primary:disabled {
  background-color: #a5b4fc;
  cursor: not-allowed;
}
</style>
