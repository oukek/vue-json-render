<template>
  <div class="modal-wrapper" :style="wrapperStyle">
    <Transition name="fade">
      <div 
          v-if="config.mask !== false" 
          class="modal-mask" 
          :style="maskStyle" 
          @click="handleMaskClick"
      ></div>
    </Transition>
    <div 
        class="modal-container"
        :style="containerStyle"
    >
        <Transition :name="config.animation || 'slide-up'" appear>
          <div class="modal-content" :style="contentStyle">
              <DynamicComponentRenderer 
                  v-for="component in config.components" 
                  :key="component.id" 
                  :config="component"
                  :class="{ selected: selectedId === component.id }"
                  @click.stop="selectComponent(component.id)"
              />
          </div>
        </Transition>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { ModalConfig, dataCenter } from '@vue-json-render/shared';
import DynamicComponentRenderer from './DynamicComponentRenderer.vue';

const props = defineProps<{
  config: ModalConfig;
  selectedId?: string;
}>();

const emit = defineEmits(['close', 'select']);

const handleMaskClick = () => {
    // In preview mode (inside editor), clicking mask should not close modal
    if (dataCenter.state.mode === 'preview') return;

    if (props.config.maskClosable !== false) {
        emit('close');
    }
};

const selectComponent = (id: string) => {
    emit('select', id);
};

const wrapperStyle = computed(() => {
    return {
        zIndex: 1000,
        position: 'fixed' as const,
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'auto' as const
    };
});

const maskStyle = computed(() => {
    return {
        position: 'absolute' as const,
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: props.config.maskColor || 'rgba(0,0,0,0.5)'
    };
});

const containerStyle = computed(() => {
    const position = props.config.position || 'center';
    let style: any = {
        position: 'absolute',
        width: '100%',
        height: '100%',
        pointerEvents: 'none', // Pass through to mask
        display: 'flex',
    };

    if (position === 'center') {
        style.alignItems = 'center';
        style.justifyContent = 'center';
    } else if (position === 'top') {
        style.alignItems = 'flex-start';
        style.justifyContent = 'center';
        style.paddingTop = '20px';
    } else if (position === 'bottom') {
        style.alignItems = 'flex-end';
        style.justifyContent = 'center';
    }
    
    return style;
});

const contentStyle = computed(() => {
    const style: any = {
        width: props.config.width || '80%',
        backgroundColor: props.config.backgroundColor || '#fff',
        position: 'relative' as const,
        pointerEvents: 'auto' as const,
        borderRadius: props.config.borderRadius,
        padding: props.config.padding,
        boxSizing: 'border-box'
    };

    if (props.config.heightMode === 'auto') {
        style.height = 'auto';
        style.maxHeight = '90%';
        style.overflowY = 'auto';
    } else {
        style.height = props.config.height || '50%';
        style.overflowY = 'auto';
    }

    return style;
});
</script>

<style scoped>
/* Basic animation classes could be added here */

/* Fade Animation for Mask */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Slide Up Animation for Content */
.slide-up-enter-active,
.slide-up-leave-active {
  transition: transform 0.3s ease, opacity 0.3s ease;
}

.slide-up-enter-from,
.slide-up-leave-to {
  transform: translateY(100%);
  opacity: 0;
}

/* Zoom/Scale Animation */
.zoom-enter-active,
.zoom-leave-active {
  transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275), opacity 0.3s ease;
}

.zoom-enter-from,
.zoom-leave-to {
  transform: scale(0.8);
  opacity: 0;
}

/* Fade Animation for Content (distinct from mask) */
.content-fade-enter-active,
.content-fade-leave-active {
  transition: opacity 0.3s ease;
}

.content-fade-enter-from,
.content-fade-leave-to {
  opacity: 0;
}
</style>
