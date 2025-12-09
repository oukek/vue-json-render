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
import { LoginProps } from './config';
import ConfigForm, { FormField } from '../../basic/Form/ConfigForm.vue';

const props = defineProps<{
  modelValue: LoginProps;
  dataBinding?: Record<string, string>;
}>();

const emit = defineEmits(['update:modelValue', 'update:dataBinding']);

const formConfig = computed<FormField[]>(() => [
    // Text
    { type: 'text', label: '标题', key: 'title' },
    { type: 'text', label: '副标题', key: 'subtitle' },
    { type: 'text', label: '用户名占位符', key: 'usernamePlaceholder' },
    { type: 'text', label: '密码占位符', key: 'passwordPlaceholder' },
    { type: 'text', label: '服务器占位符', key: 'serverPlaceholder' },
    { type: 'text', label: '按钮文案', key: 'loginBtnText' },

    // Card
    { type: 'color', label: '卡片背景色', key: 'cardBackgroundColor' },
    { type: 'text', label: '卡片圆角', key: 'cardBorderRadius' },
    { type: 'text', label: '卡片内边距', key: 'cardPadding' },
    { type: 'text', label: '卡片阴影', key: 'cardShadow' },

    // Title Style
    { type: 'color', label: '标题颜色', key: 'titleColor' },
    { type: 'text', label: '标题大小', key: 'titleFontSize' },
    { type: 'text', label: '标题字重', key: 'titleFontWeight' },

    // Subtitle Style
    { type: 'color', label: '副标题颜色', key: 'subtitleColor' },
    { type: 'text', label: '副标题大小', key: 'subtitleFontSize' },

    // Input Style
    { type: 'text', label: '输入框高度', key: 'inputHeight' },
    { type: 'color', label: '输入框边框颜色', key: 'inputBorderColor' },
    { type: 'text', label: '输入框圆角', key: 'inputBorderRadius' },
    { type: 'text', label: '输入框字号', key: 'inputFontSize' },

    // Button Style
    { type: 'color', label: '按钮背景色', key: 'btnBackgroundColor' },
    { type: 'color', label: '按钮文字颜色', key: 'btnTextColor' },
    { type: 'text', label: '按钮高度', key: 'btnHeight' },
    { type: 'text', label: '按钮字号', key: 'btnFontSize' },
    { type: 'text', label: '按钮圆角', key: 'btnBorderRadius' },
]);

const onUpdateModel = (val: LoginProps) => {
  emit('update:modelValue', val);
};

const onUpdateBinding = (val: Record<string, string>) => {
  emit('update:dataBinding', val);
};
</script>
