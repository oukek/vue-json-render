<template>
  <div class="variable-input-container">
    <div class="input-wrapper">
      <input 
        ref="inputRef"
        :value="modelValue"
        @input="handleInput"
        @blur="handleBlur"
        @keydown="handleKeydown"
        class="full-width"
        :placeholder="placeholder || '输入文本或 @ 选择变量'"
      />
      
      <!-- Modal for Variable Selection -->
      <div v-if="showSuggestions" class="modal-mask" @mousedown.self="closeModal">
        <div class="modal-content">
          <div class="modal-header">
            <span class="modal-title">选择变量</span>
            <span class="close-btn" @click="closeModal">×</span>
          </div>
          <div class="modal-body">
            <div v-if="editorStore.dataFields && editorStore.dataFields.length > 0" class="variable-tree">
               <VariableTreeItem 
                 v-for="field in editorStore.dataFields" 
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
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { DataField, editorStore } from '../index';
import VariableTreeItem from './VariableTreeItem.vue';

const props = defineProps<{
  modelValue: string | number;
  binding?: string;
  placeholder?: string;
  allowedTypes?: string[];
}>();

const emit = defineEmits(['update:modelValue', 'update:binding']);

const showSuggestions = ref(false);
const inputRef = ref<HTMLInputElement | null>(null);

// Watch for external binding changes to update text if needed (sync text with binding format)
watch(() => props.binding, (newBinding) => {
  if (newBinding) {
     // If binding is present, we might want to show it.
     // But with splicing support, binding might be partial.
     // If we are in "mixed" mode, strict binding prop might be deprecated or less used.
     // However, for backward compatibility or direct binding scenarios:
     const bindingText = `{{${newBinding}}}`;
     const modelValueStr = String(props.modelValue ?? '');
     if (modelValueStr !== bindingText && !modelValueStr.includes('{{')) {
         // Only overwrite if modelValue doesn't look like it already has templates
         // emit('update:modelValue', bindingText);
     }
  }
}, { immediate: true });

const handleInput = (e: Event) => {
  const val = (e.target as HTMLInputElement).value;
  emit('update:modelValue', val);
  
  // Simple trigger: if ends with @, show list
  // Or if we want to be smarter: check if cursor is after @
  const cursor = (e.target as HTMLInputElement).selectionStart || 0;
  const textBeforeCursor = val.slice(0, cursor);
  
  if (textBeforeCursor.endsWith('@')) {
    showSuggestions.value = true;
  } else if (!val.includes('@')) {
    // If user clears @, just hide
    // But wait, maybe we shouldn't hide automatically if modal is complex interaction?
    // Actually, if user deletes '@', they probably cancelled the intent.
    // But since it's a modal now, let's keep it simple: only open on '@', close on explicit action or clear.
    // showSuggestions.value = false; 
  }
};

const handleKeydown = (e: KeyboardEvent) => {
    if (showSuggestions.value) {
        if (e.key === 'Escape') {
            closeModal();
        }
    }
};

const handleBlur = () => {
  // If modal is open, do NOT close it on blur, because user interacts with modal
};

const closeModal = () => {
    showSuggestions.value = false;
    // Focus back to input? Maybe
    if (inputRef.value) {
        inputRef.value.focus();
    }
};

const selectField = (field: any) => {
  if (!inputRef.value) return;
  
  // Try to get cursor position. If input lost focus, this might still work or be 0.
  // In most browsers, selectionStart is preserved on blur.
  let cursor = inputRef.value.selectionStart || 0;
  const val = String(props.modelValue ?? '');
  
  // If cursor is 0 (which might happen if focus is completely lost and reset), 
  // we might want to guess the position or just use the last '@'.
  // But let's try to rely on the cursor being reasonably correct or user interaction flow.
  
  // Find the last '@' before the cursor
  const lastAt = val.lastIndexOf('@', cursor - 1);
  
  let newValue = val;
  if (lastAt !== -1) {
      // Replace from '@' to cursor with {{key}}
      newValue = val.slice(0, lastAt) + `{{${field.key}}}` + val.slice(cursor);
  } else {
      // Fallback: if we can't find '@' before cursor (maybe cursor moved),
      // search for last '@' in the whole string as a best guess
      const fallbackAt = val.lastIndexOf('@');
      if (fallbackAt !== -1) {
          newValue = val.slice(0, fallbackAt) + `{{${field.key}}}` + val.slice(fallbackAt + 1);
      } else {
          // Just append if no '@' found at all
          newValue = val + `{{${field.key}}}`;
      }
  }
  
  emit('update:modelValue', newValue);
  emit('update:binding', ''); 
  
  closeModal();
};
</script>

<style scoped>
.variable-input-container {
  position: relative;
  width: 100%;
}
.input-wrapper {
  position: relative;
}
.full-width {
  width: 100%;
  box-sizing: border-box;
  padding: 6px;
  border: 1px solid #e5e7eb;
  border-radius: 4px;
}

/* Modal Styles */
.modal-mask {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.3);
  z-index: 1000;
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
  color: #333;
}

.close-btn {
  cursor: pointer;
  font-size: 18px;
  color: #999;
  line-height: 1;
}
.close-btn:hover {
    color: #666;
}

.modal-body {
  padding: 10px;
  overflow-y: auto;
  flex: 1;
}

.no-data {
    padding: 20px;
    text-align: center;
    color: #999;
    font-size: 13px;
}

.variable-tree {
    display: flex;
    flex-direction: column;
    gap: 2px;
}
</style>
