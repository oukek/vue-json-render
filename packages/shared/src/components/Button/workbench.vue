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
import { ButtonProps } from './config';
import ConfigForm, { FormField } from '../Form/ConfigForm.vue';
import { editorStore } from '../../store';

const props = defineProps<{
  modelValue: ButtonProps;
  dataBinding?: Record<string, string>;
}>();

const emit = defineEmits(['update:modelValue', 'update:dataBinding']);

const formConfig = computed<FormField[]>(() => {
  const config: FormField[] = [
    {
      type: 'text',
      label: '按钮文字',
      key: 'text',
      props: {
        useVariable: true
      }
    },
    {
      type: 'color',
      label: '文字颜色',
      key: 'textColor'
    },
    {
      type: 'text',
      label: '文字大小',
      key: 'fontSize',
      props: {
        placeholder: 'e.g. 14px, 1rem'
      }
    },
    {
      type: 'select',
      label: '点击动作',
      key: 'actionType',
      options: [
        { label: '无', value: 'none' },
        { label: '跳转链接', value: 'link' },
        { label: '打开弹窗', value: 'openModal' },
        { label: '提交表单', value: 'submit' }
      ]
    }
  ];

  if (props.modelValue.actionType === 'link') {
    config.push({
      type: 'text',
      label: '跳转链接',
      key: 'actionUrl'
    });
  }

  if (props.modelValue.actionType === 'openModal') {
    config.push({
      type: 'select',
      label: '选择弹窗',
      key: 'modalId',
      options: editorStore.modals.map(m => ({
          label: m.name,
          value: m.id
      }))
    });
  }

  return config;
});

const onUpdateModel = (val: ButtonProps) => {
  emit('update:modelValue', val);
};

const onUpdateBinding = (val: Record<string, string>) => {
  emit('update:dataBinding', val);
};
</script>
