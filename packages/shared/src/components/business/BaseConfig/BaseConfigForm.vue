<template>
  <div class="base-config-form">
    <div class="section-title">基础配置</div>
    <div class="form-group">
        <label>宽度</label>
        <input :value="modelValue.width" @input="update('width', ($event.target as HTMLInputElement).value)" />
    </div>
    <div class="form-group">
        <label>高度</label>
        <input :value="modelValue.height" @input="update('height', ($event.target as HTMLInputElement).value)" />
    </div>
    <div class="form-group">
        <label>上边距 (Top)</label>
        <input :value="modelValue.top" @input="update('top', ($event.target as HTMLInputElement).value)" />
    </div>
    <div class="form-group">
        <label>左边距 (Left)</label>
        <input :value="modelValue.left" @input="update('left', ($event.target as HTMLInputElement).value)" />
    </div>
    <div class="form-group">
        <label>背景色</label>
        <ColorPicker 
            :modelValue="modelValue.backgroundColor" 
            @update:modelValue="(val: string) => update('backgroundColor', val)" 
        />
    </div>

    <div class="form-group">
        <label>定位模式</label>
        <select :value="modelValue.position" @change="update('position', ($event.target as HTMLSelectElement).value)" class="form-select">
           <option value="relative">相对定位 (Relative)</option>
           <option value="absolute">绝对定位 (Absolute)</option>
           <option value="fixed">固定定位 (Fixed)</option>
        </select>
    </div>
    <div class="form-group">
        <label>对齐方式</label>
        <select :value="modelValue.align" @change="update('align', ($event.target as HTMLSelectElement).value)" class="form-select">
           <option value="flex-start">靠左 (Left)</option>
           <option value="center">居中 (Center)</option>
           <option value="flex-end">靠右 (Right)</option>
        </select>
    </div>
    <div class="form-group">
        <label>边框样式 (Border Style)</label>
        <select :value="modelValue.borderStyle" @change="update('borderStyle', ($event.target as HTMLSelectElement).value)" class="form-select">
           <option value="none">无 (None)</option>
           <option value="solid">实线 (Solid)</option>
           <option value="dashed">虚线 (Dashed)</option>
           <option value="dotted">点线 (Dotted)</option>
        </select>
    </div>
    <div class="form-group">
        <label>边框宽度 (Border Width)</label>
        <input :value="modelValue.borderWidth" @input="update('borderWidth', ($event.target as HTMLInputElement).value)" placeholder="e.g. 1px" />
    </div>
    <div class="form-group">
        <label>边框颜色 (Border Color)</label>
        <ColorPicker 
            :modelValue="modelValue.borderColor" 
            @update:modelValue="(val: string) => update('borderColor', val)" 
        />
    </div>
    <div class="form-group">
        <label>圆角 (Border Radius)</label>
        <input :value="modelValue.borderRadius" @input="update('borderRadius', ($event.target as HTMLInputElement).value)" placeholder="4px" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { BaseConfig } from '../../../type';
import ColorPicker from '../../basic/ColorPicker.vue';

const props = defineProps<{
  modelValue: BaseConfig;
}>();

const emit = defineEmits(['update:modelValue', 'change']);

const update = (key: keyof BaseConfig, value: any) => {
  const newBase = { ...props.modelValue, [key]: value };
  emit('update:modelValue', newBase);
  emit('change', `base.${key}`, value);
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
