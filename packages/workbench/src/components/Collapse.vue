<template>
  <div class="collapse">
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
import { provide, ref, watch } from 'vue';

const props = defineProps<{
  modelValue?: string | string[];
  accordion?: boolean;
}>();

const emit = defineEmits(['update:modelValue']);

const activeNames = ref(props.modelValue || (props.accordion ? '' : []));

watch(() => props.modelValue, (val) => {
    activeNames.value = val || (props.accordion ? '' : []);
});

const toggleItem = (name: string) => {
  if (props.accordion) {
    activeNames.value = activeNames.value === name ? '' : name;
  } else {
    const names = Array.isArray(activeNames.value) ? [...activeNames.value] : [];
    const index = names.indexOf(name);
    if (index > -1) {
      names.splice(index, 1);
    } else {
      names.push(name);
    }
    activeNames.value = names;
  }
  emit('update:modelValue', activeNames.value);
};

provide('collapse', {
  activeNames,
  toggleItem
});
</script>

<style scoped>
.collapse {
  border-top: 1px solid #e5e7eb;
  border-bottom: 1px solid #e5e7eb;
}
</style>
