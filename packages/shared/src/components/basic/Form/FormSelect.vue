<template>
  <FormItem :label="label">
    <select class="common-select" :value="modelValue" @change="handleChange">
      <option v-for="opt in options" :key="opt.value" :value="opt.value">
        {{ opt.label }}
      </option>
    </select>
  </FormItem>
</template>

<script setup lang="ts">
import FormItem from './FormItem.vue';

interface Option {
  label: string;
  value: string | number;
}

defineProps<{
  label?: string;
  modelValue: string | number;
  options: Option[];
}>();

const emit = defineEmits(['update:modelValue']);

const handleChange = (e: Event) => {
  const val = (e.target as HTMLSelectElement).value;
  emit('update:modelValue', val);
};
</script>

<style scoped>
.common-select {
  width: 100%;
  box-sizing: border-box;
  padding: 6px;
  border: 1px solid #e5e7eb;
  border-radius: 4px;
  font-size: 14px;
  outline: none;
  background-color: white;
}
.common-select:focus {
  border-color: #007aff;
}
</style>
