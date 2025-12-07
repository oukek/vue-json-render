export interface User {
  id: number;
  username: string;
  role: 'user' | 'admin';
}

export interface BaseConfig {
  width?: string;
  height?: string;
  backgroundImage?: string;
  backgroundColor?: string;
  animation?: string;
  // Positioning for drag & drop or relative layout
  top?: string;
  left?: string;
  position?: 'absolute' | 'relative' | 'fixed';
  align?: 'flex-start' | 'center' | 'flex-end';
  borderWidth?: string;
  borderStyle?: 'none' | 'solid' | 'dashed' | 'dotted';
  borderColor?: string;
  borderRadius?: string;
}

export interface DataField {
  label: string;
  key: string;
  mockValue?: any;
  type: 'string' | 'number' | 'boolean' | 'object' | 'array';
  children?: DataField[];
}

export interface DataCenterConfig {
  fields: DataField[];
}

export interface ComponentConfig {
  id: string;
  name: string; // Component type name, e.g., 'Button'
  alias?: string; // User-defined display name
  base: BaseConfig;
  props: any; // Component specific props
  dataBinding?: Record<string, string>; // propName -> dataPath mapping
}

export interface PageConfig {
  pagename: string;
  routePath: string; // Random fixed string for internal routing
  components: ComponentConfig[];
  entryAnimation?: string;
  isEntry?: boolean;
  backgroundColor?: string;
  backgroundImage?: string;
  backgroundSize?: string; // 'cover', 'contain', '100% 100%'
  backgroundRepeat?: string; // 'no-repeat', 'repeat'
}

export interface ModalConfig {
  id: string;
  name: string;
  components: ComponentConfig[];
  animation?: string; // 'slide-up', 'fade', 'zoom', etc.
  mask?: boolean;
  maskColor?: string;
  maskClosable?: boolean;
  backgroundColor?: string;
  width?: string;
  height?: string;
  position?: 'center' | 'bottom' | 'top';
  borderRadius?: string;
  heightMode?: 'auto' | 'fixed';
  padding?: string;
}

export interface ActivityConfig {
  name: string;
  type: string;
  pages: PageConfig[];
  modals?: ModalConfig[];
  dataCenter?: DataCenterConfig;
}

export interface Activity {
  id: number;
  name: string;
  config: ActivityConfig; 
  createdAt?: string;
  updatedAt?: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}

export interface ApiError {
  message: string;
}

import ColorPicker from './components/ColorPicker.vue';
import VariableInput from './components/VariableInput.vue';
import BaseConfigForm from './components/BaseConfig/BaseConfigForm.vue';
import PageConfigForm from './components/PageConfig/PageConfigForm.vue';
import ModalConfigForm from './components/ModalConfig/ModalConfigForm.vue';
import FormItem from './components/Form/FormItem.vue';
import FormInput from './components/Form/FormInput.vue';
import BaseWrapper from './components/BaseWrapper.vue';

export * from './store';
export * from './dataCenter';
export { 
  ColorPicker, 
  VariableInput, 
  BaseConfigForm, 
  PageConfigForm,
  ModalConfigForm,
  FormItem,
  FormInput,
  BaseWrapper
};

