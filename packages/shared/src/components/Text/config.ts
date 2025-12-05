import { BaseConfig, ComponentConfig } from '../../index';

export interface TextProps {
  text: string;
  color: string;
  fontSize: string;
  fontWeight: string;
  lineHeight: string;
  textAlign: 'left' | 'center' | 'right';
}

export const defaultBaseConfig: BaseConfig = {
  width: '200px',
  height: 'auto',
  backgroundColor: 'transparent',
  position: 'relative',
  align: 'center',
  top: '0px',
  left: '0px',
};

export const defaultTextProps: TextProps = {
  text: '这是一段文本',
  color: '#000000',
  fontSize: '14px',
  fontWeight: 'normal',
  lineHeight: '1.5',
  textAlign: 'left',
};

export const createTextConfig = (): ComponentConfig => ({
  id: `Text_${Date.now()}`,
  name: 'Text',
  base: { ...defaultBaseConfig },
  props: { ...defaultTextProps },
  dataBinding: {}
});
