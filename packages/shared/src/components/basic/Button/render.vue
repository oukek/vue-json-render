<template>
  <div class="shared-button" :style="style" @click="handleClick">
    {{ text }}
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { ButtonProps } from './config';
import { dataCenter } from '../../../dataCenter';

const props = withDefaults(defineProps<ButtonProps>(), {
  actionType: 'none',
});

const style = computed(() => ({
  color: props.textColor,
  fontSize: props.fontSize,
  width: '100%',
  height: '100%',
  border: 'none',
  background: 'transparent', // Let wrapper handle background color, or inherited
}));

const handleClick = () => {
  if (props.actionType === 'link' && props.actionUrl) {
    window.location.href = props.actionUrl;
  } else if (props.actionType === 'openModal' && props.modalId) {
    dataCenter.state.activeModalId = props.modalId;
  }
  // Other actions
};
</script>

<style scoped>
.shared-button {
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  padding: 0;
  /* inherit font styles if needed */
}
</style>
