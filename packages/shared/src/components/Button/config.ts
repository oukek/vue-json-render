import { BaseConfig, ComponentConfig } from '../../index';

export interface ButtonProps {
  text: string;
  textColor: string;
  fontSize: string;
  borderRadius?: string;
  actionType: 'link' | 'submit' | 'none';
  actionUrl?: string;
}

export const defaultBaseConfig: BaseConfig = {
  width: '120px',
  height: '40px',
  backgroundColor: '#007aff',
  position: 'relative',
  align: 'center',
  top: '0px',
  left: '0px',
};

export const defaultButtonProps: ButtonProps = {
  text: '按钮',
  textColor: '#ffffff',
  fontSize: '14px',
  actionType: 'none',
};

export const createButtonConfig = (): ComponentConfig => ({
  id: `Button_${Date.now()}`,
  name: 'Button',
  base: { ...defaultBaseConfig },
  props: { ...defaultButtonProps },
  dataBinding: {}
});
