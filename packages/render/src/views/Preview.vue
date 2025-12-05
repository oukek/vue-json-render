<template>
  <div class="preview-page" @click="handleBackgroundClick">
    <div v-if="pageConfig" class="canvas-area" :style="pageStyle">
      <DynamicComponentRenderer 
        v-for="component in pageConfig.components" 
        :key="component.id" 
        :config="component"
        :class="{ selected: selectedId === component.id }"
        @click.stop="selectComponent(component.id)"
      />
    </div>
    <div v-else class="empty-state">
      等待配置...
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue';
import { dataCenter } from '../dataCenter';
import DynamicComponentRenderer from '../components/DynamicComponentRenderer.vue';

const pageConfig = computed(() => dataCenter.state.config);
const selectedId = ref('');

const pageStyle = computed(() => {
  if (!pageConfig.value) return {};
  return {
    backgroundColor: pageConfig.value.backgroundColor || '#fff',
    backgroundImage: pageConfig.value.backgroundImage ? `url(${pageConfig.value.backgroundImage})` : undefined,
    backgroundSize: pageConfig.value.backgroundSize || 'cover',
    backgroundRepeat: pageConfig.value.backgroundRepeat || 'no-repeat',
    backgroundPosition: 'center'
  };
});

const handleMessage = (event: MessageEvent) => {
  const { type, data } = event.data;
  if (type === 'SELECT_COMPONENT') {
    selectedId.value = data;
  }
  // UPDATE_CONFIG and diffs are handled by dataCenter
};

const selectComponent = (id: string) => {
  selectedId.value = id;
  window.parent.postMessage({ type: 'COMPONENT_SELECTED', data: id }, '*');
};

const handleBackgroundClick = () => {
  selectedId.value = '';
  window.parent.postMessage({ type: 'COMPONENT_SELECTED', data: '' }, '*');
};

onMounted(() => {
  window.addEventListener('message', handleMessage);
  // Notify parent we are ready
  window.parent.postMessage({ type: 'PREVIEW_READY' }, '*');
});

onUnmounted(() => {
  window.removeEventListener('message', handleMessage);
});
</script>

<style scoped>
.preview-page {
  min-height: 100vh;
  background-color: #fff; /* Or transparent if handled by parent */
  position: relative;
  overflow-x: hidden;
}

.canvas-area {
  min-height: 100vh;
  position: relative;
}

/* Highlight selected component */
:deep(.base-wrapper) {
  cursor: pointer;
  border: 2px solid transparent; 
  /* We might need a pseudo-element or outline to not affect layout, 
     but BaseWrapper uses box-sizing border-box usually. 
     Let's use outline or box-shadow for selection to avoid layout shift.
  */
  transition: box-shadow 0.2s;
}

:deep(.selected .base-wrapper) {
  border: 2px dashed #007aff;
  z-index: 100 !important; /* Bring to front when selected */
}

:deep(.base-wrapper:hover) {
  box-shadow: 0 0 0 1px #007aff80;
}

.empty-state {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  color: #999;
}
</style>
