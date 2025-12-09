<template>
  <div class="variable-picker-container">
    <div class="picker-trigger" @click="openModal">
      <span v-if="modelValue" class="selected-value">{{ modelValue }}</span>
      <span v-else class="placeholder">{{ placeholder || '点击选择变量' }}</span>
      <span class="icon">🔍</span>
    </div>
      
    <!-- Modal for Variable Selection -->
    <div v-if="showModal" class="modal-mask" @mousedown.self="closeModal">
      <div class="modal-content">
        <div class="modal-header">
          <span class="modal-title">选择绑定变量</span>
          <span class="close-btn" @click="closeModal">×</span>
        </div>
        <div class="modal-body">
          <div v-if="displayFields && displayFields.length > 0" class="variable-tree">
              <VariableTreeItem 
                v-for="field in displayFields" 
                :key="field.key"
                :data="field" 
                :allowed-types="allowedTypes"
                @select="selectField"
              />
          </div>
          <div v-else class="no-data">
              暂无数据源
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { editorStore } from '../../store';
import VariableTreeItem from './VariableTreeItem.vue';

const props = defineProps<{
  modelValue?: string;
  placeholder?: string;
  allowedTypes?: string[];
  dataFields?: any[];
}>();

const emit = defineEmits(['update:modelValue']);

const showModal = ref(false);

const displayFields = computed(() => {
  if (props.dataFields !== undefined) {
    return props.dataFields;
  }
  return editorStore.dataFields;
});

const openModal = () => {
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
};

const selectField = (field: any) => {
  if (!field || !field.key) return;
  closeModal();
  // Directly emit the key path
  emit('update:modelValue', field.key);
};
</script>

<style scoped>
.variable-picker-container {
  width: 100%;
}

.picker-trigger {
  width: 100%;
  box-sizing: border-box;
  padding: 6px 10px;
  border: 1px solid #e5e7eb;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #fff;
  min-height: 32px;
}

.picker-trigger:hover {
  border-color: #007aff;
}

.selected-value {
  color: #333;
  font-size: 13px;
}

.placeholder {
  color: #9ca3af;
  font-size: 13px;
}

.icon {
  font-size: 12px;
  opacity: 0.5;
}

/* Modal Styles - reused from VariableInput but scoped */
.modal-mask {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.3);
  z-index: 2000; /* Higher than others */
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content {
  background: white;
  border-radius: 8px;
  width: 400px;
  max-height: 80vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  animation: modal-fade-in 0.2s ease-out;
}

@keyframes modal-fade-in {
    from { opacity: 0; transform: translateY(-10px); }
    to { opacity: 1; transform: translateY(0); }
}

.modal-header {
  padding: 12px 16px;
  border-bottom: 1px solid #eee;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-title {
  font-weight: 600;
  font-size: 14px;
}

.close-btn {
  cursor: pointer;
  font-size: 18px;
  color: #999;
}

.close-btn:hover {
  color: #333;
}

.modal-body {
  padding: 10px;
  overflow-y: auto;
  flex: 1;
}

.variable-tree {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.no-data {
  text-align: center;
  color: #999;
  padding: 20px;
  font-size: 13px;
}
</style>
