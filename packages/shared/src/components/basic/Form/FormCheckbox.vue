<template>
  <FormItem :label="label">
    <div class="checkbox-group">
      <label v-for="opt in options" :key="opt.value" class="checkbox-item">
        <input 
          type="checkbox" 
          :value="opt.value" 
          :checked="modelValue.includes(opt.value)"
          @change="(e) => handleChange(e, opt.value)"
        />
        <span class="checkbox-label">{{ opt.label }}</span>
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
  modelValue: (string | number)[];
  options: Option[];
}>();

const emit = defineEmits(['update:modelValue']);

const handleChange = (e: Event, value: string | number) => {
  const checked = (e.target as HTMLInputElement).checked;
  const newValue = [...props.modelValue];
  
  if (checked) {
    if (!newValue.includes(value)) {
      newValue.push(value);
    }
  } else {
    const index = newValue.indexOf(value);
    if (index > -1) {
      newValue.splice(index, 1);
    }
  }
  
  emit('update:modelValue', newValue);
};
</script>

<style scoped>
.checkbox-group {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}
.checkbox-item {
  display: flex;
  align-items: center;
  gap: 4px;
  cursor: pointer;
  font-size: 14px;
}
.checkbox-label {
    color: #333;
}
</style>
