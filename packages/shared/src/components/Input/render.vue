<template>
  <div class="shared-input" :style="wrapperStyle">
    <textarea
      v-if="inputType === 'textarea'"
      :value="displayValue"
      :placeholder="placeholder"
      :rows="rows"
      :style="inputStyle"
      @input="handleInput"
    ></textarea>
    <input
      v-else
      :type="inputType"
      :value="displayValue"
      :placeholder="placeholder"
      :style="inputStyle"
      @input="handleInput"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { InputProps } from './config';
import { dataCenter } from '../../dataCenter';

const props = withDefaults(defineProps<InputProps>(), {
  inputType: 'text',
  rows: 3,
  resize: 'none'
});

const displayValue = computed(() => {
  if (props.variablePath) {
    const path = props.variablePath;
    const keys = path.split('.');
    let current: any = dataCenter.state.dynamicData;
    for (const key of keys) {
       if (current && typeof current === 'object' && key in current) {
          current = current[key];
       } else {
          return props.defaultValue;
       }
    }
    return current;
  }
  return props.defaultValue;
});

const handleInput = (e: Event) => {
  const target = e.target as HTMLInputElement | HTMLTextAreaElement;
  const val = target.value;
  
  if (props.variablePath) {
    dataCenter.setValue(props.variablePath, val);
  }
};

const wrapperStyle = computed(() => ({
  width: '100%',
  height: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const inputStyle = computed(() => ({
  width: '100%',
  height: props.inputType === 'textarea' ? 'auto' : '100%',
  color: props.textColor,
  fontSize: props.fontSize,
  backgroundColor: props.backgroundColor,
  border: `${props.borderWidth} solid ${props.borderColor}`,
  borderRadius: props.borderRadius,
  padding: props.padding,
  boxSizing: 'border-box' as const,
  outline: 'none',
  resize: (props.inputType === 'textarea' ? props.resize : 'none') as any,
  fontFamily: 'inherit'
}));

</script>

<style scoped>
input, textarea {
  appearance: none;
  -webkit-appearance: none;
}
</style>
