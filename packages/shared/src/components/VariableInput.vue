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
      
      <ul v-if="showSuggestions" class="suggestions-list">
        <li 
          v-for="field in filteredFields" 
          :key="field.key"
          @mousedown.prevent="selectField(field)"
          class="suggestion-item"
        >
          <span class="field-label">{{ field.label }}</span>
          <span class="field-key">{{ field.key }}</span>
        </li>
        <li v-if="filteredFields.length === 0" class="suggestion-item no-result">
            无匹配字段
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { BUILT_IN_DATA_MAP } from '../dataSource';

const props = defineProps<{
  modelValue: string | number;
  binding?: string;
  placeholder?: string;
  allowedTypes?: string[];
}>();

const emit = defineEmits(['update:modelValue', 'update:binding']);

const showSuggestions = ref(false);
const inputRef = ref<HTMLInputElement | null>(null);

const filteredFields = computed(() => {
  if (!props.allowedTypes || props.allowedTypes.length === 0) {
    return BUILT_IN_DATA_MAP;
  }
  return BUILT_IN_DATA_MAP.filter(field => props.allowedTypes?.includes(field.type));
});

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
    showSuggestions.value = false;
  }
};

const handleKeydown = (e: KeyboardEvent) => {
    if (showSuggestions.value) {
        if (e.key === 'Escape') {
            showSuggestions.value = false;
        }
    }
};

const handleBlur = () => {
  // Delay hide to allow click on list
  setTimeout(() => {
    showSuggestions.value = false;
  }, 200);
};

const selectField = (field: any) => {
  if (!inputRef.value) return;
  
  const cursor = inputRef.value.selectionStart || 0;
  const val = String(props.modelValue ?? '');
  
  // We triggered on '@', so we expect '@' to be just before cursor.
  // Let's find the last '@' before cursor to replace.
  const lastAt = val.lastIndexOf('@', cursor - 1);
  
  let newValue = val;
  if (lastAt !== -1) {
      // Replace '@' with {{key}}
      newValue = val.slice(0, lastAt) + `{{${field.key}}}` + val.slice(cursor);
  } else {
      // Fallback: just insert at cursor
      newValue = val.slice(0, cursor) + `{{${field.key}}}` + val.slice(cursor);
  }
  
  emit('update:modelValue', newValue);
  // With splicing, we generally don't set a single 'binding' prop anymore.
  // We clear it to indicate the value is now a template string managed by the component itself.
  emit('update:binding', ''); 
  
  showSuggestions.value = false;
  
  // Restore focus and cursor (approximate)
  setTimeout(() => {
      if (inputRef.value) {
          inputRef.value.focus();
          // Calculate new cursor position? It's complicated, let's just focus for now.
      }
  }, 0);
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
.suggestions-list {
  position: absolute;
  top: 100%;
  left: 0;
  width: 100%;
  max-height: 200px;
  overflow-y: auto;
  background: white;
  border: 1px solid #ddd;
  border-radius: 4px;
  z-index: 100;
  list-style: none;
  padding: 0;
  margin: 4px 0 0 0;
  box-shadow: 0 2px 8px rgba(0,0,0,0.15);
}
.suggestion-item {
  padding: 8px 12px;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 12px;
  color: #333;
}
.suggestion-item:hover {
  background-color: #f3f4f6;
}
.no-result {
    color: #999;
    justify-content: center;
}
.field-label {
  font-weight: 500;
}
.field-key {
  color: #999;
  font-size: 10px;
}
.full-width {
  width: 100%;
  box-sizing: border-box;
  padding: 6px;
  border: 1px solid #e5e7eb;
  border-radius: 4px;
}
</style>
