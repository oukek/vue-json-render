<template>
  <ConfigForm
    :modelValue="modelValue"
    :dataBinding="dataBinding"
    :config="formConfig"
    @update:modelValue="onUpdateModel"
    @update:dataBinding="onUpdateBinding"
  />
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { ListSelectProps } from './config';
import ConfigForm, { FormField } from '../Form/ConfigForm.vue';
import { dataCenter } from '../../../dataCenter';
import { editorStore } from '../../../store';

const props = defineProps<{
  modelValue: ListSelectProps;
  dataBinding?: Record<string, string>;
}>();

const emit = defineEmits(['update:modelValue', 'update:dataBinding']);

const onUpdateModel = (val: ListSelectProps) => {
  emit('update:modelValue', val);
};

const onUpdateBinding = (val: Record<string, string>) => {
  emit('update:dataBinding', val);
};

// Helper to get children fields from a variable path
const getVariableChildren = (path: string): any[] => {
    if (!path) return [];
    
    const pathsToCheck = [path];
    if (path.startsWith('dynamicData.')) {
        pathsToCheck.push(path.replace('dynamicData.', ''));
    }

    // Helper to traverse fields
    const findChildrenInFields = (fields: any[], keys: string[]) => {
        let currentFields = fields;
        let foundField: any = null;

        for (let i = 0; i < keys.length; i++) {
            const key = keys[i];
            const field = currentFields.find(f => f.key === key);
            
            if (!field) return null;

            if (i === keys.length - 1) {
                foundField = field;
            } else {
                if (field.children) {
                    currentFields = field.children;
                } else {
                    return null;
                }
            }
        }

        if (foundField && foundField.children && foundField.children.length > 0) {
            return foundField.children;
        }
        return null;
    }

    // Helper to traverse data
    const findChildrenInData = (data: any, keys: string[]) => {
        let current = data;
        for (const key of keys) {
            if (current && typeof current === 'object' && key in current) {
                current = current[key];
            } else {
                return null;
            }
        }
        
        if (Array.isArray(current) && current.length > 0) {
            const firstItem = current[0];
            if (typeof firstItem === 'object' && firstItem !== null) {
                return Object.keys(firstItem).map(k => ({
                    label: k,
                    key: k,
                    type: typeof firstItem[k]
                }));
            }
        }
        return null;
    }

    for (const p of pathsToCheck) {
        const keys = p.split('.');

        // 1. Schema (editorStore)
        if (editorStore.dataFields && editorStore.dataFields.length > 0) {
            const res = findChildrenInFields(editorStore.dataFields, keys);
            if (res) return res;
        }

        // 2. Metadata (dataCenterConfig)
        if (dataCenter.state.dataCenterConfig?.fields) {
             const res = findChildrenInFields(dataCenter.state.dataCenterConfig.fields, keys);
             if (res) return res;
        }

        // 3. Real Data (dynamicData)
        const res = findChildrenInData(dataCenter.state.dynamicData, keys);
        if (res) return res;
    }
    
    return [];
};

const formConfig = computed<FormField[]>(() => {
  const config: FormField[] = [
    // Data Source
    {
        type: 'select',
        label: '数据来源',
        key: 'sourceType',
        options: [
            { label: '固定配置', value: 'fixed' },
            { label: '变量绑定', value: 'variable' },
            { label: '接口请求', value: 'api' }
        ]
    }
  ];

  if (props.modelValue.sourceType === 'fixed') {
      config.push({
          type: 'table',
          label: '选项列表',
          key: 'options',
          columns: [
              { label: '标签', key: 'label' },
              { label: '值', key: 'value' },
              { label: '图片', key: 'image' }
          ]
      });
  }

  if (props.modelValue.sourceType === 'variable') {
      config.push({
          type: 'variable-picker',
          label: '列表数据变量',
          key: 'variablePath',
          props: { allowedTypes: ['array'] }
      });
  }

  if (props.modelValue.sourceType === 'api') {
      config.push({
          type: 'text',
          label: '接口地址',
          key: 'apiUrl'
      });
      config.push({
          type: 'select',
          label: '请求方法',
          key: 'apiMethod',
          options: [
              { label: 'GET', value: 'GET' },
              { label: 'POST', value: 'POST' }
          ]
      });
  }

  if (props.modelValue.sourceType === 'variable') {
      const children = getVariableChildren(props.modelValue.variablePath || '');
      
      config.push(
          { 
              type: 'variable-picker', 
              label: '标签字段名', 
              key: 'labelField',
              props: { 
                  dataFields: children,
                  placeholder: '点击选择标签字段'
              }
          },
          { 
              type: 'variable-picker', 
              label: '值字段名', 
              key: 'valueField',
              props: { 
                  dataFields: children,
                  placeholder: '点击选择值字段'
              }
          },
          { 
              type: 'variable-picker', 
              label: '图片字段名', 
              key: 'imageField',
              props: { 
                  dataFields: children,
                  placeholder: '点击选择图片字段'
              }
          }
      );
  } else if (props.modelValue.sourceType === 'api') {
    config.push(
        { 
            type: 'text', 
            label: '标签字段名', 
            key: 'labelField',
            props: { placeholder: '例如: name (显示的文字)' }
        },
        { 
            type: 'text', 
            label: '值字段名', 
            key: 'valueField',
            props: { placeholder: '例如: id (选中的值)' }
        },
        { 
            type: 'text', 
            label: '图片字段名', 
            key: 'imageField',
            props: { placeholder: '例如: icon (图片URL)' }
        }
    );
  }
      
  config.push(
      { 
          type: 'select', 
          label: '选择模式', 
          key: 'selectionType',
          options: [
              { label: '单选', value: 'single' },
              { label: '多选', value: 'multiple' }
          ]
      },
      { type: 'variable-picker', label: '选中值绑定', key: 'selectedVariablePath' },
      
      {
          type: 'select',
          label: '排列方向',
          key: 'direction',
          options: [
              { label: '垂直', value: 'vertical' },
              { label: '水平', value: 'horizontal' }
          ]
      },
      { type: 'text', label: '间距', key: 'gap' },
      { type: 'text', label: '项宽度', key: 'itemWidth' },
      { type: 'text', label: '项高度', key: 'itemHeight' },
      
      { type: 'color', label: '背景颜色', key: 'backgroundColor' },
      { type: 'color', label: '项背景色', key: 'itemBackgroundColor' },
      { type: 'color', label: '选中项背景', key: 'selectedItemBackgroundColor' },
      { type: 'color', label: '文字颜色', key: 'textColor' },
      { type: 'color', label: '选中文字颜色', key: 'selectedTextColor' },
      { type: 'text', label: '字体大小', key: 'fontSize' },
      { type: 'text', label: '圆角', key: 'borderRadius' },
      { type: 'text', label: '边框宽度', key: 'borderWidth' },
      { type: 'color', label: '边框颜色', key: 'borderColor' },
      { type: 'color', label: '选中边框颜色', key: 'selectedBorderColor' },
      { type: 'text', label: '内边距', key: 'padding' },
      
      { type: 'switch', label: '显示图片', key: 'showImage' }
  );
  
  if (props.modelValue.showImage) {
      config.push(
          { type: 'text', label: '图片宽度', key: 'imageWidth' },
          { type: 'text', label: '图片高度', key: 'imageHeight' },
          {
              type: 'select',
              label: '图片位置',
              key: 'imagePosition',
              options: [
                  { label: '左侧', value: 'left' },
                  { label: '右侧', value: 'right' },
                  { label: '顶部', value: 'top' },
                  { label: '底部', value: 'bottom' }
              ]
          }
      );
  }

  return config;
});
</script>
