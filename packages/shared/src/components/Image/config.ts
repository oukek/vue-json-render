import { BaseConfig, ComponentConfig } from '../../index';

export interface ImageProps {
  src: string;
  fit: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down';
}

export const defaultBaseConfig: BaseConfig = {
  width: '100px',
  height: '100px',
  backgroundColor: 'transparent',
  position: 'relative',
  align: 'center',
  top: '0px',
  left: '0px',
};

export const defaultImageProps: ImageProps = {
  src: 'https://via.placeholder.com/100',
  fit: 'cover',
};

export const createImageConfig = (): ComponentConfig => ({
  id: `Image_${Date.now()}`,
  name: 'Image',
  base: { ...defaultBaseConfig },
  props: { ...defaultImageProps },
  dataBinding: {}
});
