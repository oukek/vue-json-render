<template>
  <FormItem :label="label">
    <div class="radio-group">
      <label v-for="opt in options" :key="opt.value" class="radio-item">
        <input 
          type="radio" 
          :name="name" 
          :value="opt.value" 
          :checked="modelValue === opt.value"
          @change="$emit('update:modelValue', opt.value)"
        />
        <span class="radio-label">{{ opt.label }}</span>
      </label>
    </div>
  </FormItem>
</template>

<script setup lang="ts">
import FormItem from './FormItem.vue';

interface Option {
  label: string;
  value: string | number;
}

const props = defineProps<{
  label?: string;
  modelValue: string | number;
  options: Option[];
}>();

defineEmits(['update:modelValue']);

const name = `radio-group-${Math.random().toString(36).substr(2, 9)}`;
</script>

<style scoped>
.radio-group {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}
.radio-item {
  display: flex;
  align-items: center;
  gap: 4px;
  cursor: pointer;
  font-size: 14px;
}
.radio-label {
    color: #333;
}
</style>
