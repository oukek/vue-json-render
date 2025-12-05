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
import { ImageProps } from './config';
import ConfigForm, { FormField } from '../Form/ConfigForm.vue';

defineProps<{
  modelValue: ImageProps;
  dataBinding?: Record<string, string>;
}>();

const emit = defineEmits(['update:modelValue', 'update:dataBinding']);

const formConfig: FormField[] = [
  {
    type: 'text',
    label: '图片地址',
    key: 'src',
    props: {
      useVariable: true,
    }
  },
  {
    type: 'select',
    label: '填充方式',
    key: 'fit',
    options: [
      { label: '包含 (contain)', value: 'contain' },
      { label: '覆盖 (cover)', value: 'cover' },
      { label: '拉伸 (fill)', value: 'fill' },
      { label: '无 (none)', value: 'none' },
      { label: '缩小 (scale-down)', value: 'scale-down' }
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
