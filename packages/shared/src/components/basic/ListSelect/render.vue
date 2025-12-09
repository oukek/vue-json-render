<template>
  <div class="list-select-container" :style="containerStyle">
    <div
      v-for="(item, index) in listData"
      :key="item[props.valueField] || index"
      class="list-item"
      :class="{ selected: isSelected(item) }"
      :style="getItemStyle(isSelected(item))"
      @click="handleSelect(item)"
    >
      <img
        v-if="props.showImage && item[props.imageField]"
        :src="item[props.imageField]"
        class="item-image"
        :style="imageStyle"
      />
      <span class="item-label">{{ item[props.labelField] }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { ListSelectProps } from './config';
import { dataCenter } from '../../../dataCenter';

const props = withDefaults(defineProps<ListSelectProps>(), {
  sourceType: 'fixed',
  selectionType: 'single',
  direction: 'vertical',
  gap: '10px',
  itemWidth: '100%',
  itemHeight: '40px',
  backgroundColor: 'transparent',
  itemBackgroundColor: '#ffffff',
  selectedItemBackgroundColor: '#e6f7ff',
  textColor: '#333333',
  selectedTextColor: '#1890ff',
  fontSize: '14px',
  borderRadius: '4px',
  borderWidth: '1px',
  borderColor: '#d9d9d9',
  selectedBorderColor: '#1890ff',
  padding: '8px',
  showImage: false,
  imageWidth: '24px',
  imageHeight: '24px',
  imagePosition: 'left',
  labelField: 'label',
  valueField: 'value',
  imageField: 'image'
});

const listData = ref<any[]>([]);

const fetchApiData = async () => {
  if (props.apiUrl) {
    try {
      const response = await fetch(props.apiUrl, {
        method: props.apiMethod || 'GET'
      });
      const data = await response.json();
      if (Array.isArray(data)) {
        listData.value = data;
      } else if (data.data && Array.isArray(data.data)) {
        listData.value = data.data; // Common wrapper
      } else {
        console.warn('API response is not an array', data);
      }
    } catch (error) {
      console.error('Failed to fetch list data', error);
    }
  }
};

// Helper to get variable value
const getVariableValue = (path: string) => {
  if (!path) return undefined;
  const keys = path.split('.');
  let current: any = dataCenter.state.dynamicData;
  for (const key of keys) {
      if (current && typeof current === 'object' && key in current) {
        current = current[key];
      } else {
        return undefined;
      }
  }
  return current;
};

const updateData = () => {
  if (props.sourceType === 'fixed') {
    listData.value = props.options || [];
  } else if (props.sourceType === 'variable' && props.variablePath) {
    const val = getVariableValue(props.variablePath);
    if (Array.isArray(val)) {
      listData.value = val;
    } else {
        listData.value = [];
    }
  } else if (props.sourceType === 'api') {
    fetchApiData();
  }
};

watch(() => [props.sourceType, props.options, props.variablePath, props.apiUrl, dataCenter.state.dynamicData], updateData, { immediate: true, deep: true });

// Selection Logic
const internalValue = ref<any>(props.defaultValue);

const currentSelectedValue = computed({
    get: () => {
        if (props.selectedVariablePath) {
            const val = getVariableValue(props.selectedVariablePath);
            return val !== undefined ? val : internalValue.value;
        }
        return internalValue.value;
    },
    set: (val) => {
        internalValue.value = val;
        if (props.selectedVariablePath) {
            dataCenter.setValue(props.selectedVariablePath, val);
        }
    }
});

const isSelected = (item: any) => {
    const val = item[props.valueField];
    if (props.selectionType === 'single') {
        return currentSelectedValue.value == val; // Loose equality for number/string mismatch
    } else {
        return Array.isArray(currentSelectedValue.value) && currentSelectedValue.value.includes(val);
    }
};

const handleSelect = (item: any) => {
    const val = item[props.valueField];
    if (props.selectionType === 'single') {
        currentSelectedValue.value = val;
    } else {
        const current = Array.isArray(currentSelectedValue.value) ? [...currentSelectedValue.value] : [];
        const idx = current.indexOf(val);
        if (idx > -1) {
            current.splice(idx, 1);
        } else {
            current.push(val);
        }
        currentSelectedValue.value = current;
    }
};

// Styles
const containerStyle = computed(() => ({
    display: 'flex',
    flexDirection: (props.direction === 'vertical' ? 'column' : 'row') as any,
    flexWrap: (props.direction === 'horizontal' ? 'wrap' : 'nowrap') as any,
    gap: props.gap,
    backgroundColor: props.backgroundColor,
    width: '100%',
    height: '100%',
    overflow: 'auto'
}));

const getItemStyle = (selected: boolean) => ({
    width: props.itemWidth,
    height: props.itemHeight,
    backgroundColor: selected ? props.selectedItemBackgroundColor : props.itemBackgroundColor,
    color: selected ? props.selectedTextColor : props.textColor,
    fontSize: props.fontSize,
    border: `${props.borderWidth} solid ${selected ? props.selectedBorderColor : props.borderColor}`,
    borderRadius: props.borderRadius,
    padding: props.padding,
    display: 'flex',
    alignItems: 'center',
    justifyContent: (props.imagePosition === 'right' || props.imagePosition === 'bottom') ? 'space-between' : 'flex-start',
    flexDirection: ((props.imagePosition === 'top' || props.imagePosition === 'bottom') ? 'column' : 'row') as any,
    cursor: 'pointer',
    boxSizing: 'border-box' as const
});

const imageStyle = computed(() => ({
    width: props.imageWidth,
    height: props.imageHeight,
    objectFit: 'cover' as const,
    marginRight: props.imagePosition === 'left' ? '8px' : '0',
    marginLeft: props.imagePosition === 'right' ? '8px' : '0',
    marginBottom: props.imagePosition === 'top' ? '8px' : '0',
    marginTop: props.imagePosition === 'bottom' ? '8px' : '0',
}));

</script>

<style scoped>
.list-item {
    transition: all 0.2s;
}
.list-select-container {
    scrollbar-width: thin;
}
.list-select-container::-webkit-scrollbar {
    width: 6px;
    height: 6px;
}
.list-select-container::-webkit-scrollbar-thumb {
    background: #ccc;
    border-radius: 3px;
}
</style>
