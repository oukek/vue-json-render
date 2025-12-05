<template>
  <div class="collapse-item" :class="{ 'is-active': isActive }">
    <div class="collapse-header" @click="handleHeaderClick">
      <slot name="title">{{ title }}</slot>
      <span class="arrow" :class="{ 'is-active': isActive }">▶</span>
    </div>
    <div class="collapse-content" v-show="isActive">
      <slot></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { inject, computed } from 'vue';

const props = defineProps<{
  title?: string;
  name: string;
}>();

const collapse = inject('collapse') as any;

const isActive = computed(() => {
  if (Array.isArray(collapse.activeNames.value)) {
    return collapse.activeNames.value.includes(props.name);
  }
  return collapse.activeNames.value === props.name;
});

const handleHeaderClick = () => {
  collapse.toggleItem(props.name);
};
</script>

<style scoped>
.collapse-item {
  border-bottom: 1px solid #e5e7eb;
}
.collapse-item:last-child {
  border-bottom: none;
}

.collapse-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 40px;
  padding: 0 8px;
  background-color: #f9fafb;
  color: #374151;
  cursor: pointer;
  font-size: 13px;
  font-weight: 600;
  transition: background-color .3s;
  user-select: none;
}
.collapse-header:hover {
    background-color: #f3f4f6;
}

.arrow {
  margin-left: 8px;
  transition: transform .3s;
  font-size: 10px;
  color: #9ca3af;
}

.arrow.is-active {
  transform: rotate(90deg);
}

.collapse-content {
  padding: 12px 8px;
  font-size: 13px;
  color: #303133;
  background: white;
}
</style>