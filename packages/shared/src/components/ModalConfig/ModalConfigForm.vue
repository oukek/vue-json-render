<template>
  <div class="modal-config-form">
     <div class="form-group">
        <label>弹窗名称</label>
        <input :value="modelValue.name" @input="update('name', ($event.target as HTMLInputElement).value)" />
     </div>
     
     <div class="section-title">基础样式</div>

     <div class="form-group">
        <label>宽度 (Width)</label>
        <input :value="modelValue.width" @input="update('width', ($event.target as HTMLInputElement).value)" placeholder="e.g. 80% or 300px" />
     </div>

     <div class="form-group">
        <label>高度模式</label>
        <select :value="modelValue.heightMode || 'fixed'" @change="update('heightMode', ($event.target as HTMLSelectElement).value)" class="form-select">
           <option value="fixed">固定高度 (Fixed)</option>
           <option value="auto">自动高度 (Auto)</option>
        </select>
     </div>

     <div class="form-group" v-if="modelValue.heightMode !== 'auto'">
        <label>高度 (Height)</label>
        <input :value="modelValue.height" @input="update('height', ($event.target as HTMLInputElement).value)" placeholder="e.g. 50% or 400px" />
     </div>

     <div class="form-group">
        <label>圆角 (Border Radius)</label>
        <input :value="modelValue.borderRadius" @input="update('borderRadius', ($event.target as HTMLInputElement).value)" placeholder="e.g. 12px or 20px" />
     </div>

     <div class="form-group">
        <label>内边距 (Padding)</label>
        <input :value="modelValue.padding" @input="update('padding', ($event.target as HTMLInputElement).value)" placeholder="e.g. 16px or 20px" />
     </div>

     <div class="form-group">
        <label>位置</label>
        <select :value="modelValue.position || 'center'" @change="update('position', ($event.target as HTMLSelectElement).value)" class="form-select">
           <option value="center">居中 (Center)</option>
           <option value="top">顶部 (Top)</option>
           <option value="bottom">底部 (Bottom)</option>
        </select>
     </div>
     
     <div class="form-group">
        <label>背景颜色</label>
        <ColorPicker 
            :modelValue="modelValue.backgroundColor" 
            @update:modelValue="(val: string) => update('backgroundColor', val)" 
        />
     </div>

     <div class="section-title">动画配置</div>
     <div class="form-group">
        <label>弹窗动画</label>
        <select :value="modelValue.animation || 'slide-up'" @change="update('animation', ($event.target as HTMLSelectElement).value)" class="form-select">
           <option value="slide-up">从下往上 (Slide Up)</option>
           <option value="fade">渐显 (Fade)</option>
           <option value="zoom">缩放 (Zoom)</option>
           <option value="none">无 (None)</option>
        </select>
     </div>

     <div class="section-title">遮罩层配置</div>
     
     <div class="form-group checkbox-group">
        <label>
           <input type="checkbox" :checked="modelValue.mask !== false" @change="update('mask', ($event.target as HTMLInputElement).checked)" />
           显示遮罩层
        </label>
     </div>

     <div class="form-group" v-if="modelValue.mask !== false">
        <label>遮罩颜色</label>
        <ColorPicker 
            :modelValue="modelValue.maskColor || 'rgba(0,0,0,0.5)'" 
            @update:modelValue="(val: string) => update('maskColor', val)" 
        />
     </div>

     <div class="form-group checkbox-group" v-if="modelValue.mask !== false">
        <label>
           <input type="checkbox" :checked="modelValue.maskClosable !== false" @change="update('maskClosable', ($event.target as HTMLInputElement).checked)" />
           点击遮罩关闭
        </label>
     </div>
  </div>
</template>

<script setup lang="ts">
import { ModalConfig } from '../../index';
import ColorPicker from '../ColorPicker.vue';

const props = defineProps<{
  modelValue: ModalConfig;
}>();

const emit = defineEmits(['update:modelValue', 'change']);

const update = (key: keyof ModalConfig, value: any) => {
  const newConfig = { ...props.modelValue, [key]: value };
  emit('update:modelValue', newConfig);
  emit('change', key, value);
};
</script>

<style scoped>
.form-group {
  margin-bottom: 12px;
  padding: 0 12px;
}

.form-group label {
  display: block;
  margin-bottom: 4px;
  font-size: 12px;
  color: #666;
}

.checkbox-group label {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
}

.checkbox-group input[type="checkbox"] {
    width: auto;
    margin: 0;
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
  padding: 0 12px;
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
