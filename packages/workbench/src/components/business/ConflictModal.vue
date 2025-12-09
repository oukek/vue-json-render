<template>
  <div v-if="visible" class="modal-overlay">
    <div class="modal-content">
      <div class="modal-header">
        <h3>冲突解决</h3>
      </div>
      
      <div class="modal-body">
        <p>检测到字段冲突：<strong>{{ conflict?.key }}</strong></p>
        
        <div class="conflict-comparison">
          <div class="conflict-item existing">
            <h4>现有字段</h4>
            <p>类型: {{ conflict?.existingType }}</p>
          </div>
          
          <div class="conflict-divider">VS</div>
          
          <div class="conflict-item imported">
            <h4>导入字段</h4>
            <p>类型: {{ conflict?.importedType }}</p>
          </div>
        </div>
        
        <p class="instruction">请选择要保留的版本：</p>
      </div>
      
      <div class="modal-footer">
        <button class="btn btn-secondary" @click="resolve('existing')">保留现有 ({{ conflict?.existingType }})</button>
        <button class="btn btn-primary" @click="resolve('imported')">使用导入 ({{ conflict?.importedType }})</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue';

export interface ConflictData {
  key: string;
  existingType: string;
  importedType: string;
}

const props = defineProps<{
  visible: boolean;
  conflict: ConflictData | null;
}>();

const emit = defineEmits(['resolve']);

const resolve = (choice: 'existing' | 'imported') => {
  emit('resolve', choice);
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
  z-index: 1200;
}

.modal-content {
  background-color: white;
  border-radius: 8px;
  width: 500px;
  max-width: 90%;
  display: flex;
  flex-direction: column;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.modal-header {
  padding: 16px 20px;
  border-bottom: 1px solid #e5e7eb;
}

.modal-header h3 {
  margin: 0;
  font-size: 18px;
  color: #111827;
}

.modal-body {
  padding: 20px;
}

.conflict-comparison {
  display: flex;
  align-items: center;
  margin: 20px 0;
  background: #f9fafb;
  padding: 16px;
  border-radius: 8px;
}

.conflict-item {
  flex: 1;
  text-align: center;
}

.conflict-item h4 {
  margin: 0 0 8px 0;
  color: #4b5563;
}

.conflict-item p {
  margin: 0;
  font-weight: bold;
}

.conflict-divider {
  padding: 0 20px;
  font-weight: bold;
  color: #9ca3af;
}

.instruction {
  margin-bottom: 0;
  color: #6b7280;
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
