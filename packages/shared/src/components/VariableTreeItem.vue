<template>
  <div class="variable-tree-item">
    <div 
      class="item-content" 
      :class="{ 'is-disabled': isDisabled, 'is-clickable': !isDisabled }"
      @click="handleSelect"
    >
      <!-- Toggle Icon -->
      <span 
        class="toggle-icon" 
        :class="{ 'invisible': !hasChildren }"
        @click.stop="toggleExpand"
      >
        {{ isExpanded ? '▼' : '▶' }}
      </span>
      
      <!-- Icon based on type (optional, simple text for now) -->
      <span class="type-icon" :class="data.type">{{ data.type[0].toUpperCase() }}</span>

      <!-- Label & Key -->
      <div class="item-info">
        <span class="item-label">{{ data.label }}</span>
        <span class="item-key">{{ data.key }}</span>
      </div>
    </div>

    <!-- Children -->
    <div v-if="hasChildren && isExpanded" class="item-children">
      <VariableTreeItem
        v-for="child in data.children"
        :key="child.key"
        :data="child"
        :prefix="fullKey"
        :allowed-types="allowedTypes"
        @select="$emit('select', $event)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { DataField } from '../index';

defineOptions({
  name: 'VariableTreeItem'
});

const props = defineProps<{
  data: DataField;
  prefix?: string;
  allowedTypes?: string[];
}>();

const emit = defineEmits(['select']);

const isExpanded = ref(false);

const fullKey = computed(() => props.prefix ? `${props.prefix}.${props.data.key}` : props.data.key);
const hasChildren = computed(() => props.data.children && props.data.children.length > 0);

const isDisabled = computed(() => {
  // If allowedTypes is provided, check if current type is included
  if (props.allowedTypes && props.allowedTypes.length > 0) {
    return !props.allowedTypes.includes(props.data.type);
  }
  return false;
});

const toggleExpand = () => {
  if (hasChildren.value) {
    isExpanded.value = !isExpanded.value;
  }
};

const handleSelect = () => {
  if (isDisabled.value) {
    // If disabled but has children, toggle expand instead
    if (hasChildren.value) {
        toggleExpand();
    }
    return;
  }
  
  emit('select', {
    key: fullKey.value,
    label: props.data.label,
    type: props.data.type
  });
};
</script>

<style scoped>
.variable-tree-item {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  font-size: 13px;
  user-select: none;
}

.item-content {
  display: flex;
  align-items: center;
  padding: 4px 8px;
  cursor: default;
  border-radius: 4px;
  transition: background-color 0.2s;
}

.item-content.is-clickable:hover {
  background-color: #f0f0f0;
  cursor: pointer;
}

.item-content.is-disabled {
  opacity: 0.6;
  color: #999;
}
.item-content.is-disabled:hover {
    background-color: transparent; 
    /* Or maybe a slight highlight to show it's interactive for expanding? */
}
/* If it has children and is disabled, it might still be expandable, so maybe show pointer on the icon */
.toggle-icon {
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 4px;
  cursor: pointer;
  color: #666;
  font-size: 10px;
}
.toggle-icon:hover {
    color: #333;
}
.toggle-icon.invisible {
  visibility: hidden;
}

.type-icon {
  width: 16px;
  height: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #eee;
  border-radius: 3px;
  margin-right: 8px;
  font-size: 9px;
  font-weight: bold;
  color: #666;
}
.type-icon.string { background: #e6f4ff; color: #096dd9; }
.type-icon.number { background: #f6ffed; color: #389e0d; }
.type-icon.boolean { background: #fff0f6; color: #c41d7f; }
.type-icon.object { background: #fff7e6; color: #d46b08; }
.type-icon.array { background: #f9f0ff; color: #531dab; }

.item-info {
  display: flex;
  flex-direction: column;
}

.item-label {
  font-weight: 500;
  line-height: 1.2;
}

.item-key {
  font-size: 11px;
  color: #999;
  line-height: 1.2;
}

.item-children {
  padding-left: 20px; /* Indent children */
  border-left: 1px solid #f0f0f0;
  margin-left: 9px; /* Align line with toggle icon center approximately */
}
</style>
