<template>
  <FormItem :label="label">
    <div class="slider-container">
      <input 
        type="range" 
        class="slider-input"
        :min="min" 
        :max="max" 
        :step="step" 
        :value="modelValue" 
        @input="handleInput"
      />
      <span class="slider-value">{{ modelValue }}</span>
    </div>
  </FormItem>
</template>

<script setup lang="ts">
import FormItem from './FormItem.vue';

withDefaults(defineProps<{
  label?: string;
  modelValue: number;
  min?: number;
  max?: number;
  step?: number;
}>(), {
  min: 0,
  max: 100,
  step: 1
});

const emit = defineEmits(['update:modelValue']);

const handleInput = (e: Event) => {
  const val = Number((e.target as HTMLInputElement).value);
  emit('update:modelValue', val);
};
</script>

<style scoped>
.slider-container {
  display: flex;
  align-items: center;
  gap: 8px;
}
.slider-input {
  flex: 1;
}
.slider-value {
  font-size: 12px;
  color: #666;
  min-width: 24px;
  text-align: right;
}
</style>
