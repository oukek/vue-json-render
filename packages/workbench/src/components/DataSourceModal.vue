<template>
  <div v-if="visible" class="modal-overlay" @click.self="close">
    <div class="modal-content">
      <div class="modal-header">
        <h3>配置数据源</h3>
        <button class="close-btn" @click="close">×</button>
      </div>
      
      <div class="modal-body">
        <div class="editor-pane">
          <div class="toolbar">
            <button class="add-root-btn" @click="addRootNode">
              ➕ 添加根节点
            </button>
            <button class="add-root-btn" @click="importJsonToRoot" style="margin-left: 8px;">
              📥 导入 JSON
            </button>
          </div>
          <div class="tree-container">
            <DataSourceNode
              v-for="(node, index) in localDataSource"
              :key="index"
              :node="node"
              :level="0"
              @update="updateRootNode(index, $event)"
              @remove="removeRootNode(index)"
            />
          </div>
        </div>
        
        <div class="preview-pane">
          <div class="preview-header">
            <h4>JSON 预览</h4>
            <span class="valid-status" :class="{ invalid: !isValid }">
              {{ isValid ? 'JSON 有效' : '结构错误' }}
            </span>
          </div>
          <pre class="json-preview">{{ previewJson }}</pre>
        </div>
      </div>
      
      <div class="modal-footer">
        <button class="btn btn-secondary" @click="close">取消</button>
        <button class="btn btn-primary" @click="save">保存</button>
      </div>
    </div>

    <JsonImportModal 
      v-model:visible="importModalVisible"
      @import="handleJsonImport"
    />

    <ConflictModal
      :visible="conflictModalVisible"
      :conflict="currentConflict"
      @resolve="resolveConflict"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, provide } from 'vue';
import { DataField } from '@vue-json-render/shared';
import DataSourceNode from './DataSourceNode.vue';
import JsonImportModal from './JsonImportModal.vue';
import ConflictModal, { ConflictData } from './ConflictModal.vue';
import { inferSchema } from '../utils/schemaHelper';

const props = defineProps<{
  visible: boolean;
  initialData: DataField[];
}>();

const emit = defineEmits(['update:visible', 'save']);

const localDataSource = ref<DataField[]>([]);
const isValid = ref(true);

// Import & Merge State
const importModalVisible = ref(false);
const conflictModalVisible = ref(false);
const currentConflict = ref<ConflictData | null>(null);

let currentImportContext: {
  existingFields: DataField[];
  onSave: (fields: DataField[]) => void;
} | null = null;

let resolveConflictPromise: ((choice: 'existing' | 'imported') => void) | null = null;

// Provide openImport to children
const openImport = (context: { existingFields: DataField[], onSave: (fields: DataField[]) => void }) => {
  currentImportContext = context;
  importModalVisible.value = true;
};

provide('openImport', openImport);

const importJsonToRoot = () => {
  openImport({
    existingFields: localDataSource.value,
    onSave: (fields) => {
      localDataSource.value = fields;
    }
  });
};

const handleJsonImport = async (json: any) => {
  if (!currentImportContext) return;

  const rootSchema = inferSchema(json, 'temp');
  let newFields: DataField[] = [];

  if (rootSchema.type === 'object' && rootSchema.children) {
    newFields = rootSchema.children;
  } else if (rootSchema.type === 'array' && rootSchema.children) {
      // For array, if we are importing into a list of fields, 
      // maybe we iterate the array items?
      // But schemaHelper returns the schema of the array itself.
      // If user provided [ {a:1}, {b:2} ], inferSchema might return array with children describing {a,b}.
      // But we want to add 'a' and 'b' to the current node?
      // It's ambiguous. Let's strictly require Object for field addition.
      alert('请导入 JSON 对象以添加字段');
      return;
  } else {
      alert('请导入 JSON 对象以添加字段');
      return;
  }

  // Clone existing to avoid mutating in place during merge
  const merged = [...currentImportContext.existingFields];

  for (const field of newFields) {
    const existingIndex = merged.findIndex(f => f.key === field.key);
    if (existingIndex === -1) {
      merged.push(field);
    } else {
      const existing = merged[existingIndex];
      if (existing.type === field.type) {
        // Same type, keep existing (do nothing)
      } else {
        // Different type, ask user
        const choice = await promptConflict({
          key: field.key,
          existingType: existing.type,
          importedType: field.type
        });

        if (choice === 'imported') {
          merged[existingIndex] = field;
        }
      }
    }
  }

  currentImportContext.onSave(merged);
};

const promptConflict = (conflict: ConflictData): Promise<'existing' | 'imported'> => {
  currentConflict.value = conflict;
  conflictModalVisible.value = true;
  return new Promise((resolve) => {
    resolveConflictPromise = resolve;
  });
};

const resolveConflict = (choice: 'existing' | 'imported') => {
  conflictModalVisible.value = false;
  if (resolveConflictPromise) {
    resolveConflictPromise(choice);
    resolveConflictPromise = null;
  }
};

watch(() => props.visible, (val) => {
  if (val) {
    // Deep copy initial data
    localDataSource.value = JSON.parse(JSON.stringify(props.initialData || []));
  }
});

const generatePreview = (fields: DataField[]): any => {
  const result: any = {};
  fields.forEach(field => {
    if (field.type === 'object' && field.children) {
      result[field.key] = generatePreview(field.children);
    } else if (field.type === 'array' && field.children) {
      // For array, we assume it's an array of objects defined by children, 
      // or array of primitives if one child type is primitive? 
      // Usually arrays in this context might be list of objects.
      // Let's simplified it: if children exist, it's array of one item structure.
      // Or maybe array of mixed? Let's assume array of object defined by children properties.
      // If children is a list of properties for the object inside the array.
      result[field.key] = [generatePreview(field.children)];
    } else {
       // Mock values based on type
       switch (field.type) {
         case 'string': result[field.key] = field.mockValue || 'text'; break;
         case 'number': result[field.key] = field.mockValue || 0; break;
         case 'boolean': result[field.key] = field.mockValue || false; break;
         default: result[field.key] = null;
       }
    }
  });
  return result;
};

const previewJson = computed(() => {
  try {
    const obj = generatePreview(localDataSource.value);
    isValid.value = true;
    return JSON.stringify(obj, null, 2);
  } catch (e) {
    isValid.value = false;
    return 'Error generating preview';
  }
});

const addRootNode = () => {
  localDataSource.value.push({
    key: 'newRoot',
    label: '新数据',
    type: 'string'
  });
};

const updateRootNode = (index: number, node: DataField) => {
  localDataSource.value[index] = node;
};

const removeRootNode = (index: number) => {
  localDataSource.value.splice(index, 1);
};

const close = () => {
  emit('update:visible', false);
};

const save = () => {
  // Validate structure: ensure keys are unique at each level? 
  // For now, just emit.
  emit('save', localDataSource.value);
  close();
};
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background-color: white;
  border-radius: 8px;
  width: 900px;
  max-width: 95%;
  height: 80vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.modal-header {
  padding: 16px 20px;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-header h3 {
  margin: 0;
  font-size: 18px;
  color: #111827;
}

.close-btn {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #6b7280;
}

.modal-body {
  flex: 1;
  display: flex;
  overflow: hidden;
}

.editor-pane {
  flex: 1;
  border-right: 1px solid #e5e7eb;
  display: flex;
  flex-direction: column;
  padding: 16px;
  overflow-y: auto;
}

.preview-pane {
  width: 350px;
  background-color: #f9fafb;
  padding: 16px;
  display: flex;
  flex-direction: column;
}

.toolbar {
  margin-bottom: 12px;
}

.add-root-btn {
  background-color: #ecf5ff;
  color: #409eff;
  border: 1px solid #b3d8ff;
  padding: 6px 12px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 13px;
}

.add-root-btn:hover {
  background-color: #409eff;
  color: white;
  border-color: #409eff;
}

.tree-container {
  flex: 1;
  overflow-y: auto;
}

.preview-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.preview-header h4 {
  margin: 0;
  font-size: 14px;
  color: #374151;
}

.valid-status {
  font-size: 12px;
  color: #10b981;
}

.valid-status.invalid {
  color: #ef4444;
}

.json-preview {
  background-color: #1f2937;
  color: #e5e7eb;
  padding: 12px;
  border-radius: 6px;
  font-family: monospace;
  font-size: 12px;
  overflow: auto;
  flex: 1;
  margin: 0;
}

.modal-footer {
  padding: 16px 20px;
  border-top: 1px solid #e5e7eb;
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

.btn {
  padding: 8px 16px;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
  border: none;
}

.btn-secondary {
  background-color: white;
  border: 1px solid #d1d5db;
  color: #374151;
}

.btn-secondary:hover {
  background-color: #f3f4f6;
}

.btn-primary {
  background-color: #4f46e5;
  color: white;
}

.btn-primary:hover {
  background-color: #4338ca;
}
</style>
