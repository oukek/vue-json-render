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
import { TextProps } from './config';
import ConfigForm, { FormField } from '../Form/ConfigForm.vue';

defineProps<{
  modelValue: TextProps;
  dataBinding?: Record<string, string>;
}>();

const emit = defineEmits(['update:modelValue', 'update:dataBinding']);

const formConfig: FormField[] = [
  {
    type: 'text',
    label: '文本内容',
    key: 'text',
    props: { 
        useVariable: true,
        allowedTypes: ['string', 'number']
    }
  },
  {
    type: 'color',
    label: '字体颜色',
    key: 'color'
  },
  {
    type: 'text',
    label: '字体大小',
    key: 'fontSize'
  },
  {
    type: 'select',
    label: '对齐方式',
    key: 'textAlign',
    options: [
      { label: '左对齐', value: 'left' },
      { label: '居中', value: 'center' },
      { label: '右对齐', value: 'right' }
    ]
  }
];

const onUpdateModel = (val: any) => {
  emit('update:modelValue', val);
};

const onUpdateBinding = (val: any) => {
  emit('update:dataBinding', val);
};
</script>
