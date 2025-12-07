<template>
  <div class="data-source-node">
    <div 
      class="node-content" 
      :class="{ 'has-children': hasChildren }"
      @contextmenu.prevent="showContextMenu"
    >
      <div class="node-indent" :style="{ width: indent + 'px' }"></div>
      
      <div class="node-expand" @click="toggleExpand" v-if="hasChildren">
        <span>{{ expanded ? '▼' : '▶' }}</span>
      </div>
      <div class="node-spacer" v-else></div>

      <div class="node-icon">
        <span>{{ typeIcon }}</span>
      </div>

      <div class="node-form">
        <input 
          v-model="localNode.key" 
          class="node-input key-input" 
          placeholder="field_name"
          @change="emitUpdate"
        />
        
        <select v-model="localNode.type" class="node-select" @change="handleTypeChange">
          <option value="string">String</option>
          <option value="number">Number</option>
          <option value="boolean">Boolean</option>
          <option value="object">Object</option>
          <option value="array">Array</option>
        </select>

        <input 
          v-model="localNode.label" 
          class="node-input label-input" 
          placeholder="中文描述"
          @change="emitUpdate"
        />
      </div>
      
      <div class="node-actions">
        <button class="icon-btn" @click="$emit('remove')" title="删除">
          🗑️
        </button>
        <button 
          v-if="isContainer" 
          class="icon-btn" 
          @click="importJson" 
          title="导入 JSON"
        >
          📥
        </button>
        <button 
          v-if="isContainer" 
          class="icon-btn" 
          @click="addChild" 
          title="添加子节点"
        >
          ➕
        </button>
      </div>
    </div>

    <div v-if="expanded && hasChildren" class="node-children">
      <DataSourceNode
        v-for="(child, index) in localNode.children"
        :key="index"
        :node="child"
        :level="level + 1"
        @update="updateChild(index, $event)"
        @remove="removeChild(index)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, inject } from 'vue';
import { DataField } from '@vue-json-render/shared';

const props = defineProps<{
  node: DataField;
  level: number;
}>();

const emit = defineEmits(['update', 'remove']);

const openImport = inject<(context: { existingFields: DataField[], onSave: (fields: DataField[]) => void }) => void>('openImport');

const localNode = ref<DataField>({ ...props.node });
const expanded = ref(true);

const isContainer = computed(() => ['object', 'array'].includes(localNode.value.type));
const hasChildren = computed(() => isContainer.value && localNode.value.children && localNode.value.children.length > 0);
const indent = computed(() => props.level * 20);

const typeIcon = computed(() => {
  switch (localNode.value.type) {
    case 'object': return '📂';
    case 'array': return '☰';
    case 'string': return 'Aa';
    case 'number': return '123';
    case 'boolean': return '☑️';
    default: return '📄';
  }
});

watch(() => props.node, (newVal) => {
  localNode.value = { ...newVal };
}, { deep: true });

const toggleExpand = () => {
  expanded.value = !expanded.value;
};

const emitUpdate = () => {
  emit('update', localNode.value);
};

const handleTypeChange = () => {
  if (isContainer.value) {
    if (!localNode.value.children) {
      localNode.value.children = [];
    }
  } else {
    delete localNode.value.children;
  }
  emitUpdate();
};

const addChild = () => {
  if (!localNode.value.children) {
    localNode.value.children = [];
  }
  localNode.value.children.push({
    key: 'newField',
    label: '新字段',
    type: 'string'
  });
  expanded.value = true;
  emitUpdate();
};

const importJson = () => {
  if (openImport) {
    if (!localNode.value.children) {
      localNode.value.children = [];
    }
    openImport({
      existingFields: localNode.value.children,
      onSave: (fields) => {
        localNode.value.children = fields;
        expanded.value = true;
        emitUpdate();
      }
    });
  }
};

const updateChild = (index: number, child: DataField) => {
  if (localNode.value.children) {
    localNode.value.children[index] = child;
    emitUpdate();
  }
};

const removeChild = (index: number) => {
  if (localNode.value.children) {
    localNode.value.children.splice(index, 1);
    emitUpdate();
  }
};

const showContextMenu = (e: MouseEvent) => {
  // Implementation for context menu can be added if needed, 
  // but buttons are already provided for add/remove
};
</script>

<style scoped>
.data-source-node {
  font-size: 13px;
  color: #333;
}

.node-content {
  display: flex;
  align-items: center;
  padding: 4px 0;
  border-radius: 4px;
}

.node-content:hover {
  background-color: #f5f7fa;
}

.node-indent {
  flex-shrink: 0;
}

.node-expand, .node-spacer {
  width: 20px;
  text-align: center;
  cursor: pointer;
  flex-shrink: 0;
  color: #909399;
  user-select: none;
}

.node-icon {
  width: 24px;
  text-align: center;
  flex-shrink: 0;
  margin-right: 4px;
}

.node-form {
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1;
  margin-right: 8px;
}

.node-input {
  border: 1px solid #dcdfe6;
  border-radius: 3px;
  padding: 2px 6px;
  height: 24px;
  outline: none;
  font-size: 12px;
}

.node-input:focus {
  border-color: #409eff;
}

.key-input {
  width: 120px;
  font-family: monospace;
}

.label-input {
  width: 120px;
}

.node-select {
  border: 1px solid #dcdfe6;
  border-radius: 3px;
  height: 24px;
  padding: 0 4px;
  outline: none;
  font-size: 12px;
  background: white;
  width: 80px;
}

.node-actions {
  display: flex;
  gap: 4px;
  opacity: 0;
  transition: opacity 0.2s;
}

.node-content:hover .node-actions {
  opacity: 1;
}

.icon-btn {
  border: none;
  background: none;
  cursor: pointer;
  padding: 2px 4px;
  color: #606266;
  border-radius: 3px;
  font-size: 14px;
}

.icon-btn:hover {
  background-color: #e6e8eb;
}
</style>
