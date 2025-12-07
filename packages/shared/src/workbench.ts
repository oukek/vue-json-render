import { App } from 'vue';
import ButtonWorkbench from './components/Button/workbench.vue';
import { createButtonConfig, defaultBaseConfig, defaultButtonProps } from './components/Button/config';
import TextWorkbench from './components/Text/workbench.vue';
import { createTextConfig, defaultBaseConfig as defaultTextBase, defaultTextProps } from './components/Text/config';
import ImageWorkbench from './components/Image/workbench.vue';
import { createImageConfig, defaultBaseConfig as defaultImageBase, defaultImageProps } from './components/Image/config';
import ProgressWorkbench from './components/Progress/workbench.vue';
import { createProgressConfig, defaultBaseConfig as defaultProgressBase, defaultProgressProps } from './components/Progress/config';
import InputWorkbench from './components/Input/workbench.vue';
import { createInputConfig, defaultBaseConfig as defaultInputBase, defaultInputProps } from './components/Input/config';

export const workbenchComponents: Record<string, any> = {
  'Button': ButtonWorkbench,
  'Text': TextWorkbench,
  'Image': ImageWorkbench,
  'Progress': ProgressWorkbench,
  'Input': InputWorkbench,
};

export const componentConfigs = {
  'Button': {
    create: createButtonConfig,
    defaultBase: defaultBaseConfig,
    defaultProps: defaultButtonProps,
  },
  'Text': {
    create: createTextConfig,
    defaultBase: defaultTextBase,
    defaultProps: defaultTextProps,
  },
  'Image': {
    create: createImageConfig,
    defaultBase: defaultImageBase,
    defaultProps: defaultImageProps,
  },
  'Progress': {
    create: createProgressConfig,
    defaultBase: defaultProgressBase,
    defaultProps: defaultProgressProps,
  },
  'Input': {
    create: createInputConfig,
    defaultBase: defaultInputBase,
    defaultProps: defaultInputProps,
  },
};

export default {
  install(app: App) {
    Object.entries(workbenchComponents).forEach(([name, component]) => {
      app.component(`${name}Config`, component);
    });
  }
};
