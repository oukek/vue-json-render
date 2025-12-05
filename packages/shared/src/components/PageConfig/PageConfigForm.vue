<template>
  <div class="page-config-form">
     <div class="form-group">
        <label>页面名称</label>
        <input :value="modelValue.pagename" @input="update('pagename', ($event.target as HTMLInputElement).value)" />
     </div>
     
     <div class="section-title">背景配置</div>
     
     <div class="form-group">
        <label>背景颜色</label>
        <ColorPicker 
            :modelValue="modelValue.backgroundColor" 
            @update:modelValue="(val: string) => update('backgroundColor', val)" 
        />
     </div>

     <div class="form-group">
        <label>背景图片 (URL)</label>
        <input :value="modelValue.backgroundImage" @input="update('backgroundImage', ($event.target as HTMLInputElement).value)" placeholder="https://..." />
     </div>

     <div class="form-group">
        <label>背景模式</label>
        <select :value="modelValue.backgroundSize" @change="update('backgroundSize', ($event.target as HTMLSelectElement).value)" class="form-select">
           <option value="cover">拉伸铺满 (Cover)</option>
           <option value="contain">适应 (Contain)</option>
           <option value="100% 100%">强制拉伸 (100% 100%)</option>
           <option value="auto">原始大小 (Auto)</option>
        </select>
     </div>

     <div class="form-group">
        <label>重复模式</label>
        <select :value="modelValue.backgroundRepeat" @change="update('backgroundRepeat', ($event.target as HTMLSelectElement).value)" class="form-select">
           <option value="no-repeat">不重复</option>
           <option value="repeat">重复 (平铺)</option>
           <option value="repeat-x">水平重复</option>
           <option value="repeat-y">垂直重复</option>
        </select>
     </div>
  </div>
</template>

<script setup lang="ts">
import { PageConfig } from '../../index';
import ColorPicker from '../ColorPicker.vue';

const props = defineProps<{
  modelValue: PageConfig;
}>();

const emit = defineEmits(['update:modelValue', 'change']);

const update = (key: keyof PageConfig, value: any) => {
  const newPage = { ...props.modelValue, [key]: value };
  emit('update:modelValue', newPage);
  emit('change', key, value);
};
</script>

<style scoped>
.form-group {
  margin-bottom: 12px;
}

.form-group label {
  display: block;
  margin-bottom: 4px;
  font-size: 12px;
  color: #666;
}

.form-select {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  margin-top: 4px;
  outline: none;
  transition: border-color 0.2s;
  background-color: white;
}

.form-select:focus {
  border-color: var(--primary-color, #4f46e5);
  box-shadow: 0 0 0 2px rgba(79, 70, 229, 0.1);
}

.section-title {
  font-weight: 600;
  margin-top: 16px;
  margin-bottom: 12px;
  padding-bottom: 4px;
  border-bottom: 1px solid #eee;
  color: #333;
}

input {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  margin-top: 4px;
  outline: none;
  transition: border-color 0.2s;
}

input:focus {
  border-color: var(--primary-color, #4f46e5);
  box-shadow: 0 0 0 2px rgba(79, 70, 229, 0.1);
}
</style>
