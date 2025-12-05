<template>
  <div class="color-picker-container" ref="containerRef">
    <div class="color-trigger" @click="togglePicker">
      <div class="color-preview" :style="{ backgroundColor: modelValue }"></div>
      <input 
        type="text" 
        :value="modelValue" 
        @input="handleInput" 
        class="color-input"
        placeholder="rgba(0,0,0,0) or #000"
      />
    </div>
    <div v-if="showPicker" class="picker-popover">
      <Chrome :model-value="modelValue || '#000000'" @update:model-value="onColorChange" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { Chrome } from '@ckpack/vue-color';

const props = defineProps<{
  modelValue?: string;
}>();

const emit = defineEmits(['update:modelValue']);

const showPicker = ref(false);
const containerRef = ref<HTMLElement | null>(null);

const togglePicker = () => {
  showPicker.value = !showPicker.value;
};

const closePicker = (e: MouseEvent) => {
  if (containerRef.value && !containerRef.value.contains(e.target as Node)) {
    showPicker.value = false;
  }
};

const onColorChange = (val: any) => {
  // val contains { hex, rgba, a, ... }
  // Prefer rgba if alpha < 1, else hex? 
  // Or just always use rgba string for consistency with transparency support?
  // CSS supports rgba. 
  // Let's use rgba string format: rgba(r, g, b, a)
  
  const { r, g, b, a } = val.rgba;
  const colorStr = `rgba(${r}, ${g}, ${b}, ${a})`;
  emit('update:modelValue', colorStr);
};

const handleInput = (e: Event) => {
  const val = (e.target as HTMLInputElement).value;
  emit('update:modelValue', val);
};

onMounted(() => {
  document.addEventListener('click', closePicker);
});

onUnmounted(() => {
  document.removeEventListener('click', closePicker);
});
</script>

<style scoped>
.color-picker-container {
  position: relative;
  width: 100%;
}

.color-trigger {
  display: flex;
  gap: 8px;
  align-items: center;
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 4px;
  background: white;
}

.color-preview {
  width: 32px;
  height: 32px;
  border-radius: 2px;
  border: 1px solid #eee;
  flex-shrink: 0;
  cursor: pointer;
  background-image: linear-gradient(45deg, #ccc 25%, transparent 25%), 
                    linear-gradient(-45deg, #ccc 25%, transparent 25%), 
                    linear-gradient(45deg, transparent 75%, #ccc 75%), 
                    linear-gradient(-45deg, transparent 75%, #ccc 75%);
  background-size: 8px 8px;
  background-position: 0 0, 0 4px, 4px -4px, -4px 0px;
}

/* Inner shadow or overlay to show the actual color on top of the checkerboard */
.color-preview::after {
  content: '';
  display: block;
  width: 100%;
  height: 100%;
  background-color: inherit; /* Inherits from parent's inline style */
  border-radius: inherit;
}

/* Wait, if I set backgroundColor on .color-preview, it covers the background-image.
   So I should use a wrapper or a pseudo element.
   Actually, if I set backgroundColor with rgba, it blends with the checkerboard. 
   That is exactly what we want to show transparency.
*/

.color-input {
  flex: 1;
  border: none;
  outline: none;
  font-size: 14px;
  color: #333;
  min-width: 0;
}

.picker-popover {
  position: absolute;
  top: 100%;
  left: 0;
  z-index: 1000;
  margin-top: 8px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}
</style>
