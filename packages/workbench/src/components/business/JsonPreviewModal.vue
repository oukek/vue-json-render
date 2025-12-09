<template>
  <div v-if="visible" class="modal-overlay" @click.self="close">
    <div class="modal-content">
      <div class="modal-header">
        <h3>查看配置 JSON</h3>
        <button class="close-btn" @click="close">×</button>
      </div>
      
      <div class="modal-body">
        <textarea 
          readonly
          :value="formattedJson" 
          class="json-input" 
        ></textarea>
      </div>
      
      <div class="modal-footer">
        <button class="btn btn-secondary" @click="close">关闭</button>
        <button class="btn btn-primary" @click="copy">复制</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { toast } from '../../utils/toast';

const props = defineProps<{
  visible: boolean;
  json: any;
}>();

const emit = defineEmits(['update:visible']);

const formattedJson = computed(() => {
  try {
    return JSON.stringify(props.json, null, 2);
  } catch (e) {
    return '';
  }
});

const close = () => {
  emit('update:visible', false);
};

const copy = async () => {
  try {
    await navigator.clipboard.writeText(formattedJson.value);
    toast('复制成功', 'success');
  } catch (e) {
    toast('复制失败', 'error');
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
  width: 800px;
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
  height: 500px;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  padding: 12px;
  font-family: monospace;
  resize: vertical;
  background-color: #f9fafb;
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
</style>
