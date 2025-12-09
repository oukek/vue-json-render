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
import { InputProps } from './config';
import ConfigForm, { FormField } from '../Form/ConfigForm.vue';

const props = defineProps<{
  modelValue: InputProps;
  dataBinding?: Record<string, string>;
}>();

const emit = defineEmits(['update:modelValue', 'update:dataBinding']);

const formConfig = computed<FormField[]>(() => {
  const config: FormField[] = [
    {
      type: 'select',
      label: '输入类型',
      key: 'inputType',
      options: [
        { label: '单行文本', value: 'text' },
        { label: '多行文本', value: 'textarea' },
        { label: '密码', value: 'password' }
      ]
    },
    {
      type: 'variable-picker',
      label: '绑定变量路径',
      key: 'variablePath',
      props: {
        placeholder: '点击选择变量'
      }
    },
    {
      type: 'text',
      label: '默认值',
      key: 'defaultValue',
      props: {
        useVariable: true
      }
    },
    {
      type: 'text',
      label: '占位提示',
      key: 'placeholder'
    },
    {
      type: 'color',
      label: '文字颜色',
      key: 'textColor'
    },
    {
      type: 'text',
      label: '文字大小',
      key: 'fontSize'
    },
    {
      type: 'color',
      label: '背景颜色',
      key: 'backgroundColor'
    },
    {
      type: 'color',
      label: '边框颜色',
      key: 'borderColor'
    },
    {
      type: 'text',
      label: '边框宽度',
      key: 'borderWidth'
    },
    {
      type: 'text',
      label: '圆角',
      key: 'borderRadius'
    },
    {
      type: 'text',
      label: '内边距',
      key: 'padding'
    }
  ];

  if (props.modelValue.inputType === 'textarea') {
    config.push({
      type: 'number',
      label: '行数',
      key: 'rows'
    });
    config.push({
      type: 'select',
      label: '拖拽缩放',
      key: 'resize',
      options: [
        { label: '禁止', value: 'none' },
        { label: '双向', value: 'both' },
        { label: '水平', value: 'horizontal' },
        { label: '垂直', value: 'vertical' }
      ]
    });
  }

  return config;
});

const onUpdateModel = (val: InputProps) => {
  emit('update:modelValue', val);
};

const onUpdateBinding = (val: Record<string, string>) => {
  emit('update:dataBinding', val);
};
</script>
