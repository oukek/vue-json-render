<template>
  <div class="dynamic-page" v-if="pageConfig" :style="pageStyle">
    <DynamicComponentRenderer 
      v-for="component in pageConfig.components" 
      :key="component.id" 
      :config="component"
    />
    <div v-if="loading" class="loading-state">加载中...</div>
    <div v-if="error" class="error-state">{{ error }}</div>

    <!-- Modal Renderer -->
    <ModalRenderer 
      v-if="activeModalConfig"
      :config="activeModalConfig"
      @close="closeModal"
    />
  </div>
</template>

<script setup lang="ts">
import { onMounted, watch, computed } from 'vue';
import { useRoute } from 'vue-router';
import { dataCenter } from '@vue-json-render/shared';
import DynamicComponentRenderer from '../components/DynamicComponentRenderer.vue';
import ModalRenderer from '../components/ModalRenderer.vue';

const route = useRoute();
const loading = computed(() => dataCenter.state.loading);
const error = computed(() => dataCenter.state.error);
const pageConfig = computed(() => dataCenter.state.config);

// Modal logic
const activeModalId = computed(() => dataCenter.state.activeModalId);
const activeModalConfig = computed(() => {
  if (!activeModalId.value || !dataCenter.state.modals) return null;
  return dataCenter.state.modals.find(m => m.id === activeModalId.value);
});

const closeModal = () => {
  dataCenter.state.activeModalId = null;
};

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

const init = () => {
    dataCenter.initPage(route.query.pageId as string | undefined);
};

watch(() => route.query.pageId, () => {
    init();
});

onMounted(() => {
    init();
});
</script>

<style scoped>
.dynamic-page {
  width: 100%;
  min-height: 100vh;
  position: relative;
  overflow-x: hidden;
  /* Background color from page config could be applied here if we had one */
}
.loading-state, .error-state {
    text-align: center;
    padding: 20px;
    color: #666;
}
.error-state {
    color: red;
}
</style>
