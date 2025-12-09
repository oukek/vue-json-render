<template>
  <FormItem :label="label">
    <ColorPicker 
      :modelValue="modelValue" 
      @update:modelValue="$emit('update:modelValue', $event)" 
    />
  </FormItem>
</template>

<script setup lang="ts">
import FormItem from './FormItem.vue';
import ColorPicker from '../ColorPicker.vue';

defineProps<{
  label?: string;
  modelValue?: string;
}>();

defineEmits(['update:modelValue']);
</script>
