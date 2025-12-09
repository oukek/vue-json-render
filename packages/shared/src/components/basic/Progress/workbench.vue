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
import { ProgressProps } from './config';
import ConfigForm, { FormField } from '../Form/ConfigForm.vue';

defineProps<{
  modelValue: ProgressProps;
  dataBinding?: Record<string, string>;
}>();

const emit = defineEmits(['update:modelValue', 'update:dataBinding']);

const formConfig: FormField[] = [
  {
    type: 'number',
    label: '进度百分比',
    key: 'percentage',
    props: {
      min: 0,
      max: 100,
      useVariable: true,
    }
  },
  {
    type: 'number',
    label: '进度条高度(px)',
    key: 'strokeWidth',
    props: {
      min: 1,
    }
  },
  {
    type: 'color',
    label: '进度条颜色',
    key: 'color'
  },
  {
    type: 'color',
    label: '轨道颜色',
    key: 'trackColor'
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
    type: 'number',
    label: '圆角大小',
    key: 'borderRadius'
  },
  {
    type: 'switch',
    label: '显示文字',
    key: 'showText'
  },
  {
    type: 'switch',
    label: '文字内显',
    key: 'textInside'
  },
  {
    type: 'switch',
    label: '条纹效果',
    key: 'striped'
  },
  {
    type: 'switch',
    label: '条纹动画',
    key: 'animated'
  }
];

const onUpdateModel = (val: any) => {
  emit('update:modelValue', val);
};

const onUpdateBinding = (val: any) => {
  emit('update:dataBinding', val);
};
</script>
