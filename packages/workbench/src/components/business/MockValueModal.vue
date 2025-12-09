<template>
  <div v-if="visible" class="modal-overlay" @click.self="close">
    <div class="modal-content">
      <div class="modal-header">
        <h3>配置 Mock 数据 - {{ field.key }}</h3>
        <button class="close-btn" @click="close">×</button>
      </div>
      
      <div class="modal-tabs">
        <button 
          :class="{ active: mode === 'visual' }" 
          @click="switchMode('visual')"
        >
          可视化配置
        </button>
        <button 
          :class="{ active: mode === 'json' }" 
          @click="switchMode('json')"
        >
          JSON 配置 (高级)
        </button>
      </div>
      
      <div class="modal-body">
        <!-- Visual Mode -->
        <div v-if="mode === 'visual'" class="visual-editor">
          <!-- Array Editor -->
          <div v-if="field.type === 'array'" class="array-list">
            <div v-for="(item, index) in visualArray" :key="index" class="array-item">
              <div class="item-header">
                <span>Item {{ index + 1 }}</span>
                <button class="icon-btn danger" @click="removeArrayItem(index)" title="删除">🗑️</button>
              </div>
              <div class="item-content">
                <template v-if="field.children && field.children.length > 0">
                  <div v-for="child in field.children" :key="child.key" class="form-row">
                    <label>{{ child.label || child.key }}</label>
                    <input 
                      v-if="child.type === 'string'"
                      v-model="item[child.key]"
                      class="form-input"
                      placeholder="请输入文本"
                    />
                    <input 
                      v-else-if="child.type === 'number'"
                      v-model.number="item[child.key]"
                      type="number"
                      class="form-input"
                      placeholder="0"
                    />
                    <select 
                      v-else-if="child.type === 'boolean'"
                      v-model="item[child.key]"
                      class="form-select"
                    >
                      <option :value="true">true</option>
                      <option :value="false">false</option>
                    </select>
                    <div v-else class="unsupported-type">
                      {{ child.type }} 类型暂不支持可视化编辑
                    </div>
                  </div>
                </template>
                <div v-else class="empty-tip">
                  请先在数据源中添加子字段
                </div>
              </div>
            </div>
            <button class="btn-add-item" @click="addArrayItem">➕ 添加一项</button>
          </div>
          
          <!-- Object Editor -->
          <div v-else-if="field.type === 'object'" class="object-editor">
             <template v-if="field.children && field.children.length > 0">
                <div v-for="child in field.children" :key="child.key" class="form-row">
                  <label>{{ child.label || child.key }}</label>
                    <input 
                      v-if="child.type === 'string'"
                      v-model="visualObject[child.key]"
                      class="form-input"
                    />
                    <input 
                      v-else-if="child.type === 'number'"
                      v-model.number="visualObject[child.key]"
                      type="number"
                      class="form-input"
                    />
                    <select 
                      v-else-if="child.type === 'boolean'"
                      v-model="visualObject[child.key]"
                      class="form-select"
                    >
                      <option :value="true">true</option>
                      <option :value="false">false</option>
                    </select>
                    <div v-else class="unsupported-type">
                      {{ child.type }} 类型暂不支持可视化编辑
                    </div>
                </div>
             </template>
             <div v-else class="empty-tip">
                请先在数据源中添加子字段
             </div>
          </div>
          
          <!-- Primitive Editor -->
          <div v-else class="primitive-editor">
            <div class="form-row">
              <label>值</label>
              <input 
                v-if="field.type === 'string'"
                v-model="visualPrimitive"
                class="form-input"
                placeholder="请输入文本"
              />
              <input 
                v-else-if="field.type === 'number'"
                v-model.number="visualPrimitive"
                type="number"
                class="form-input"
                placeholder="0"
              />
              <select 
                v-else-if="field.type === 'boolean'"
                v-model="visualPrimitive"
                class="form-select"
              >
                <option :value="true">true</option>
                <option :value="false">false</option>
              </select>
              <div v-else>暂不支持此类型</div>
            </div>
          </div>
        </div>

        <!-- JSON Mode -->
        <div v-else class="json-editor">
          <div class="field-info">
            <span class="field-type">类型: {{ field.type }}</span>
          </div>
          <textarea 
            v-model="jsonContent" 
            class="json-input"
            :placeholder="placeholder"
            @input="validateJson"
          ></textarea>
           <div class="validation-status" :class="{ valid: isJsonValid, invalid: !isJsonValid }">
            <span class="status-icon">{{ isJsonValid ? '✅' : '❌' }}</span>
            {{ validationMessage }}
          </div>
        </div>
      </div>
      
      <div class="modal-footer">
        <button class="btn btn-secondary" @click="close">取消</button>
        <button class="btn btn-primary" @click="save">保存</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue';
import { DataField } from '@vue-json-render/shared';

const props = defineProps<{
  visible: boolean;
  field: DataField;
}>();

const emit = defineEmits(['update:visible', 'save']);

const mode = ref<'visual' | 'json'>('visual');
const jsonContent = ref('');
const visualArray = ref<any[]>([]);
const visualObject = ref<any>({});
const visualPrimitive = ref<any>(undefined);
const isJsonValid = ref(true);
const validationMessage = ref('');

const placeholder = computed(() => {
  if (props.field.type === 'array') return '[{"id": 1, "name": "test"}, ...]';
  if (props.field.type === 'object') return '{"key": "value"}';
  return '';
});

const getVisualData = () => {
  if (props.field.type === 'array') return visualArray.value.length ? visualArray.value : undefined;
  if (props.field.type === 'object') return Object.keys(visualObject.value).length ? visualObject.value : undefined;
  return visualPrimitive.value;
};

const validateJson = () => {
   if (!jsonContent.value.trim()) {
     isJsonValid.value = true;
     validationMessage.value = '空值';
     return;
   }
   try {
     JSON.parse(jsonContent.value);
     isJsonValid.value = true;
     validationMessage.value = '格式正确';
   } catch (e) {
     isJsonValid.value = false;
     validationMessage.value = '无效的 JSON';
   }
};

// Init Data
const initData = () => {
  const initialVal = props.field.mockValue;
  mode.value = 'visual'; // Default
  
  // Set JSON
  if (initialVal !== undefined) {
    jsonContent.value = JSON.stringify(initialVal, null, 2);
  } else {
    jsonContent.value = '';
  }
  
  // Set Visual
  if (props.field.type === 'array') {
    visualArray.value = Array.isArray(initialVal) ? JSON.parse(JSON.stringify(initialVal)) : [];
  } else if (props.field.type === 'object') {
    visualObject.value = (initialVal && typeof initialVal === 'object') ? JSON.parse(JSON.stringify(initialVal)) : {};
  } else {
    visualPrimitive.value = initialVal;
  }
  
  validateJson();
};

watch(() => props.visible, (val) => {
  if (val) {
    initData();
  }
}, { immediate: true });

const switchMode = (newMode: 'visual' | 'json') => {
  if (newMode === mode.value) return;
  
  if (newMode === 'json') {
    // Visual -> JSON
    const data = getVisualData();
    jsonContent.value = data !== undefined ? JSON.stringify(data, null, 2) : '';
    validateJson();
  } else {
    // JSON -> Visual
    try {
      if (jsonContent.value.trim()) {
        const data = JSON.parse(jsonContent.value);
        if (props.field.type === 'array') {
           if (Array.isArray(data)) visualArray.value = data;
        } else if (props.field.type === 'object') {
           if (typeof data === 'object' && data) visualObject.value = data;
        } else {
           visualPrimitive.value = data;
        }
      } else {
         visualArray.value = [];
         visualObject.value = {};
         visualPrimitive.value = undefined;
      }
    } catch (e) {
      alert('JSON 格式错误，无法切换到可视化模式');
      return; 
    }
  }
  mode.value = newMode;
};

const addArrayItem = () => {
  const newItem: any = {};
  if (props.field.children) {
    props.field.children.forEach(child => {
       if (child.type === 'string') newItem[child.key] = '';
       if (child.type === 'number') newItem[child.key] = 0;
       if (child.type === 'boolean') newItem[child.key] = false;
    });
  }
  visualArray.value.push(newItem);
};

const removeArrayItem = (index: number) => {
  visualArray.value.splice(index, 1);
};

const save = () => {
  let finalValue;
  if (mode.value === 'visual') {
     finalValue = getVisualData();
  } else {
     if (!isJsonValid.value) return;
     if (jsonContent.value.trim()) {
        try {
          finalValue = JSON.parse(jsonContent.value);
        } catch(e) { return; }
     }
  }
  emit('save', finalValue);
  close();
};

const close = () => {
  emit('update:visible', false);
};
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 8px;
  width: 600px;
  max-width: 90%;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
}

.modal-header {
  padding: 16px;
  border-bottom: 1px solid #eee;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-tabs {
  display: flex;
  border-bottom: 1px solid #eee;
  padding: 0 16px;
}

.modal-tabs button {
  padding: 10px 16px;
  border: none;
  background: none;
  cursor: pointer;
  border-bottom: 2px solid transparent;
}

.modal-tabs button.active {
  border-bottom-color: #1890ff;
  color: #1890ff;
  font-weight: bold;
}

.modal-body {
  padding: 16px;
  overflow-y: auto;
  flex: 1;
}

.modal-footer {
  padding: 16px;
  border-top: 1px solid #eee;
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}

.close-btn {
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
}

.btn {
  padding: 6px 16px;
  border-radius: 4px;
  border: none;
  cursor: pointer;
}

.btn-primary {
  background: #1890ff;
  color: white;
}

.btn-secondary {
  background: #f0f0f0;
  color: #333;
}

.json-input {
  width: 100%;
  height: 300px;
  font-family: monospace;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.array-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.array-item {
  border: 1px solid #eee;
  border-radius: 4px;
  padding: 12px;
}

.item-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
  font-weight: bold;
  color: #666;
}

.item-content {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-row {
  display: flex;
  align-items: center;
  gap: 8px;
}

.form-row label {
  width: 100px;
  color: #666;
}

.form-input, .form-select {
  flex: 1;
  padding: 6px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.btn-add-item {
  width: 100%;
  padding: 8px;
  border: 1px dashed #ddd;
  background: none;
  cursor: pointer;
  color: #666;
}

.btn-add-item:hover {
  border-color: #1890ff;
  color: #1890ff;
}

.validation-status {
  margin-top: 8px;
  font-size: 12px;
}

.valid {
  color: green;
}

.invalid {
  color: red;
}

.empty-tip {
  color: #999;
  text-align: center;
  padding: 20px;
}

.object-editor {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.primitive-editor {
  padding: 20px 0;
}
</style>
