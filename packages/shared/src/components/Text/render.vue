<template>
  <div class="shared-text" :style="style">
    {{ text }}
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { TextProps } from './config';

const props = withDefaults(defineProps<TextProps>(), {
  text: '',
  textAlign: 'left',
});

const style = computed(() => ({
  color: props.color,
  fontSize: props.fontSize,
  fontWeight: props.fontWeight,
  lineHeight: props.lineHeight,
  textAlign: props.textAlign,
  width: '100%',
  height: '100%',
}));
</script>

<style scoped>
.shared-text {
  word-break: break-word;
  white-space: pre-wrap;
}
</style>
