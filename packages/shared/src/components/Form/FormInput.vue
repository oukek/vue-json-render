<template>
  <FormItem :label="label">
    <VariableInput
      v-if="useVariable"
      :modelValue="modelValue"
      :binding="binding"
      :allowedTypes="allowedTypes"
      @update:modelValue="updateValue"
      @update:binding="updateBinding"
      :placeholder="placeholder"
    />
    <input
      v-else
      class="common-input"
      :type="type"
      :value="modelValue"
      :placeholder="placeholder"
      @input="handleNativeInput"
    />
  </FormItem>
</template>

<script setup lang="ts">
import FormItem from './FormItem.vue';
import VariableInput from '../VariableInput.vue';

const props = withDefaults(defineProps<{
  label?: string;
  modelValue: string | number;
  binding?: string;
  useVariable?: boolean;
  type?: string;
  placeholder?: string;
  allowedTypes?: string[];
}>(), {
  type: 'text',
  useVariable: false,
});

const emit = defineEmits(['update:modelValue', 'update:binding']);

const updateValue = (val: string) => {
  emit('update:modelValue', val);
};

const updateBinding = (val: string) => {
  emit('update:binding', val);
};

const handleNativeInput = (e: Event) => {
  const val = (e.target as HTMLInputElement).value;
  emit('update:modelValue', val);
};
</script>

<style scoped>
.common-input {
  width: 100%;
  box-sizing: border-box;
  padding: 6px;
  border: 1px solid #e5e7eb;
  border-radius: 4px;
  font-size: 14px;
  outline: none;
}
.common-input:focus {
  border-color: #007aff;
}
</style>
