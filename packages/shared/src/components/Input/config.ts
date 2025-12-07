import { BaseConfig, ComponentConfig } from '../../index';

export interface InputProps {
  placeholder: string;
  inputType: 'text' | 'textarea' | 'password';
  defaultValue: string;
  variablePath?: string; // Path in dynamicData to bind to (e.g. 'user.username')
  resize?: 'none' | 'both' | 'horizontal' | 'vertical'; // for textarea
  textColor: string;
  fontSize: string;
  backgroundColor: string;
  borderColor: string;
  borderWidth: string;
  borderRadius: string;
  padding: string;
  rows?: number; // for textarea
}

export const defaultBaseConfig: BaseConfig = {
  width: '240px',
  height: '40px', // will be auto/ignored for textarea maybe, or respected
  backgroundColor: 'transparent', // component handles its own bg usually, or uses wrapper
  position: 'relative',
  align: 'center',
  top: '0px',
  left: '0px',
};

export const defaultInputProps: InputProps = {
  placeholder: '请输入内容',
  inputType: 'text',
  defaultValue: '',
  resize: 'none',
  textColor: '#333333',
  fontSize: '14px',
  backgroundColor: '#ffffff',
  borderColor: '#cccccc',
  borderWidth: '1px',
  borderRadius: '4px',
  padding: '8px',
  rows: 3,
};

export const createInputConfig = (): ComponentConfig => ({
  id: `Input_${Date.now()}`,
  name: 'Input',
  base: { ...defaultBaseConfig },
  props: { ...defaultInputProps },
  dataBinding: {}
});
