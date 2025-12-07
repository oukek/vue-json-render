<template>
  <div class="config-form">
    <template v-for="field in config" :key="field.key">
      
      <!-- Text / Number Input -->
      <FormInput
        v-if="field.type === 'text' || field.type === 'number'"
        :label="field.label"
        :modelValue="modelValue[field.key]"
        :binding="dataBinding?.[field.key]"
        :type="field.type === 'number' ? 'number' : 'text'"
        v-bind="field.props"
        @update:modelValue="(val) => updateField(field.key, val)"
        @update:binding="(val) => updateBinding(field.key, val)"
      />

      <!-- Color -->
      <FormColor
        v-else-if="field.type === 'color'"
        :label="field.label"
        :modelValue="modelValue[field.key]"
        v-bind="field.props"
        @update:modelValue="(val) => updateField(field.key, val)"
      />

      <!-- Select -->
      <FormSelect
        v-else-if="field.type === 'select'"
        :label="field.label"
        :modelValue="modelValue[field.key]"
        :options="field.options || []"
        v-bind="field.props"
        @update:modelValue="(val) => updateField(field.key, val)"
      />

      <!-- Radio -->
      <FormRadio
        v-else-if="field.type === 'radio'"
        :label="field.label"
        :modelValue="modelValue[field.key]"
        :options="field.options || []"
        v-bind="field.props"
        @update:modelValue="(val) => updateField(field.key, val)"
      />

      <!-- Checkbox / Multiselect -->
      <FormCheckbox
        v-else-if="field.type === 'checkbox'"
        :label="field.label"
        :modelValue="modelValue[field.key] || []"
        :options="field.options || []"
        v-bind="field.props"
        @update:modelValue="(val) => updateField(field.key, val)"
      />

      <!-- Switch (Boolean) -->
      <FormSwitch
        v-else-if="field.type === 'switch'"
        :label="field.label"
        :modelValue="modelValue[field.key]"
        v-bind="field.props"
        @update:modelValue="(val) => updateField(field.key, val)"
      />

      <!-- Slider -->
      <FormSlider
        v-else-if="field.type === 'slider'"
        :label="field.label"
        :modelValue="modelValue[field.key]"
        v-bind="field.props"
        @update:modelValue="(val) => updateField(field.key, val)"
      />

      <!-- Variable Picker -->
      <div v-else-if="field.type === 'variable-picker'" class="form-item">
         <div class="form-label">{{ field.label }}</div>
         <VariablePicker
            :modelValue="modelValue[field.key]"
            v-bind="field.props"
            @update:modelValue="(val) => updateField(field.key, val)"
         />
      </div>

    </template>
  </div>
</template>

<script setup lang="ts">
import FormInput from './FormInput.vue';
import FormColor from './FormColor.vue';
import FormSelect from './FormSelect.vue';
import FormRadio from './FormRadio.vue';
import FormCheckbox from './FormCheckbox.vue';
import FormSlider from './FormSlider.vue';
import FormSwitch from './FormSwitch.vue';
import VariablePicker from '../VariablePicker.vue';

export interface FormField {
  type: 'text' | 'color' | 'select' | 'number' | 'radio' | 'checkbox' | 'slider' | 'switch' | 'variable-picker';
  label: string;
  key: string;
  options?: { label: string; value: string | number }[];
  props?: Record<string, any>;
}

const props = defineProps<{
  modelValue: Record<string, any>;
  dataBinding?: Record<string, string>;
  config: FormField[];
}>();

const emit = defineEmits(['update:modelValue', 'update:dataBinding']);

const updateField = (key: string, val: any) => {
  const newValue = { ...props.modelValue, [key]: val };
  emit('update:modelValue', newValue);
};

const updateBinding = (key: string, val: string) => {
  const newBinding = { ...(props.dataBinding || {}) };
  if (val) {
    newBinding[key] = val;
  } else {
    delete newBinding[key];
  }
  emit('update:dataBinding', newBinding);
};
</script>
