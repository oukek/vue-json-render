<template>
  <img :src="src" :style="style" class="shared-image" />
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { ImageProps } from './config';

const props = withDefaults(defineProps<ImageProps>(), {
  src: '',
  fit: 'cover',
});

const style = computed(() => ({
  width: '100%',
  height: '100%',
  objectFit: props.fit,
  display: 'block',
}));
</script>
