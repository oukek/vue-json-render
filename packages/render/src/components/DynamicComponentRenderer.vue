<template>
  <BaseWrapper :config="config">
    <component 
      :is="config.name" 
      v-bind="resolvedProps" 
    />
  </BaseWrapper>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { ComponentConfig } from '@vue-json-render/shared';
import { dataCenter } from '../dataCenter';

const props = defineProps<{
  config: ComponentConfig;
}>();

// This computed property ensures granular reactivity:
// It will only re-evaluate (and trigger re-render) if the specific data points 
// accessed by this component's bindings change.
const resolvedProps = computed(() => {
  return dataCenter.resolveComponentProps(props.config);
});
</script>
