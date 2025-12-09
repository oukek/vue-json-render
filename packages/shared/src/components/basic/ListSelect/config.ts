import { BaseConfig, ComponentConfig } from '../../../type';

export interface ListSelectOption {
  label: string;
  value: string | number;
  image?: string;
}

export interface ListSelectProps {
  // Data Source Config
  sourceType: 'fixed' | 'variable' | 'api';
  options: ListSelectOption[]; // for fixed
  variablePath?: string; // for variable (array)
  apiUrl?: string; // for api
  apiMethod?: 'GET' | 'POST';
  labelField: string;
  valueField: string;
  imageField?: string;

  // Selection Config
  selectionType: 'single' | 'multiple';
  selectedVariablePath?: string; // Where to bind the selected value
  defaultValue?: string | string[]; // Initial value if not bound or empty

  // Layout Config
  direction: 'horizontal' | 'vertical';
  gap: string;
  itemWidth: string;
  itemHeight: string;

  // Style Config
  backgroundColor: string;
  itemBackgroundColor: string;
  selectedItemBackgroundColor: string;
  textColor: string;
  selectedTextColor: string;
  fontSize: string;
  borderRadius: string;
  borderWidth: string;
  borderColor: string;
  selectedBorderColor: string;
  padding: string;
  
  // Image Config
  showImage: boolean;
  imageWidth?: string;
  imageHeight?: string;
  imagePosition?: 'top' | 'left' | 'right' | 'bottom';
}

export const defaultBaseConfig: BaseConfig = {
  width: '300px',
  height: 'auto',
  backgroundColor: 'transparent',
  position: 'relative',
  align: 'center',
  top: '0px',
  left: '0px',
};

export const defaultListSelectProps: ListSelectProps = {
  sourceType: 'fixed',
  options: [
    { label: 'Option 1', value: '1' },
    { label: 'Option 2', value: '2' },
  ],
  labelField: 'label',
  valueField: 'value',
  imageField: 'image',
  
  selectionType: 'single',
  defaultValue: '',
  
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
  imagePosition: 'left'
};

export const createListSelectConfig = (): ComponentConfig => ({
  id: `ListSelect_${Date.now()}`,
  name: 'ListSelect',
  alias: '列表选择',
  base: { ...defaultBaseConfig },
  props: { ...defaultListSelectProps },
  dataBinding: {}
});
