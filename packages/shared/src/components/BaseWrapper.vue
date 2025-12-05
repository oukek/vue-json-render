<template>
  <div class="outer-wrapper" :style="outerStyle">
    <div class="base-wrapper" :style="style" :class="[config.base.animation, { 'is-edit': isEdit }]">
      <div class="component-content">
        <slot></slot>
      </div>
      <div v-if="isEdit" class="event-blocker"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, inject } from 'vue';
import { ComponentConfig } from '../index';

const props = defineProps<{
  config: ComponentConfig;
}>();

const globalState = inject<any>('GlobalState', { mode: 'production' });
const isEdit = computed(() => globalState.mode === 'preview');

const outerStyle = computed(() => {
  const base = props.config.base;
  // If absolute or fixed, the outer wrapper shouldn't constrain it, 
  // but for 'relative' flow, we want the 100vw strip.
  // Actually, if it is absolute/fixed, the inner div will break out anyway if we don't put position:relative on outer.
  // But we probably want the outer div to be just a flow container.
  
  return {
    width: '100vw',
    display: 'flex',
    justifyContent: base.align || 'center',
    // If inner is absolute/fixed, this outer div will have 0 height unless content dictates otherwise,
    // or we can let it collapse.
    pointerEvents: 'none' // Let clicks pass through the empty space of the strip? 
                          // But we need clicks on the component. 
                          // We'll handle pointer-events: auto on the inner component.
  };
});

const style = computed(() => {
  const base = props.config.base;
  return {
    width: base.width,
    height: base.height,
    backgroundImage: base.backgroundImage ? `url(${base.backgroundImage})` : undefined,
    backgroundColor: base.backgroundColor,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    position: base.position || 'relative',
    top: base.top,
    left: base.left,
    borderWidth: base.borderWidth,
    borderStyle: base.borderStyle,
    borderColor: base.borderColor,
    borderRadius: base.borderRadius,
    zIndex: 1, // Default z-index
    pointerEvents: 'auto' // Re-enable pointer events for the component itself
  };
});
</script>

<style scoped>
.outer-wrapper {
  box-sizing: border-box;
  /* border: 1px dashed #eee; Debugging help if needed */
}
.base-wrapper {
  box-sizing: border-box;
  overflow: hidden; /* Ensure content doesn't spill out if specific dimensions set */
}

.component-content {
  width: 100%;
  height: 100%;
}

.is-edit .component-content {
  pointer-events: none;
}

.event-blocker {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 999;
  cursor: inherit;
}

/* Example Animation Classes */
.fade-in {
  animation: fadeIn 0.5s ease-in;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
</style>
