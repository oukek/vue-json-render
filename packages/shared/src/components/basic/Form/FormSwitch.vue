<template>
  <FormItem :label="label">
    <label class="form-switch">
      <input 
        type="checkbox" 
        :checked="modelValue" 
        @change="handleChange"
      />
      <span class="slider round"></span>
    </label>
  </FormItem>
</template>

<script setup lang="ts">
import FormItem from './FormItem.vue';

defineProps<{
  label?: string;
  modelValue: boolean;
}>();

const emit = defineEmits(['update:modelValue']);

const handleChange = (e: Event) => {
  const checked = (e.target as HTMLInputElement).checked;
  emit('update:modelValue', checked);
};
</script>

<style scoped>
.form-switch {
  position: relative;
  display: inline-block;
  width: 40px;
  height: 20px;
}

.form-switch input { 
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  transition: .4s;
}

.slider:before {
  position: absolute;
  content: "";
  height: 16px;
  width: 16px;
  left: 2px;
  bottom: 2px;
  background-color: white;
  transition: .4s;
}

input:checked + .slider {
  background-color: #2196F3;
}

input:focus + .slider {
  box-shadow: 0 0 1px #2196F3;
}

input:checked + .slider:before {
  transform: translateX(20px);
}

.slider.round {
  border-radius: 20px;
}

.slider.round:before {
  border-radius: 50%;
}
</style>
