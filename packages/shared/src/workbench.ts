import { App } from 'vue';
import ButtonWorkbench from './components/basic/Button/workbench.vue';
import { createButtonConfig, defaultBaseConfig, defaultButtonProps } from './components/basic/Button/config';
import TextWorkbench from './components/basic/Text/workbench.vue';
import { createTextConfig, defaultBaseConfig as defaultTextBase, defaultTextProps } from './components/basic/Text/config';
import ImageWorkbench from './components/basic/Image/workbench.vue';
import { createImageConfig, defaultBaseConfig as defaultImageBase, defaultImageProps } from './components/basic/Image/config';
import ProgressWorkbench from './components/basic/Progress/workbench.vue';
import { createProgressConfig, defaultBaseConfig as defaultProgressBase, defaultProgressProps } from './components/basic/Progress/config';
import InputWorkbench from './components/basic/Input/workbench.vue';
import { createInputConfig, defaultBaseConfig as defaultInputBase, defaultInputProps } from './components/basic/Input/config';
import ListSelectWorkbench from './components/basic/ListSelect/workbench.vue';
import { createListSelectConfig, defaultBaseConfig as defaultListSelectBase, defaultListSelectProps } from './components/basic/ListSelect/config';
import LoginWorkbench from './components/business/Login/workbench.vue';
import { createLoginConfig, defaultBaseConfig as defaultLoginBase, defaultLoginProps } from './components/business/Login/config';

export const workbenchComponents: Record<string, any> = {
  'Button': ButtonWorkbench,
  'Text': TextWorkbench,
  'Image': ImageWorkbench,
  'Progress': ProgressWorkbench,
  'Input': InputWorkbench,
  'ListSelect': ListSelectWorkbench,
  'Login': LoginWorkbench,
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
  'ListSelect': {
    create: createListSelectConfig,
    defaultBase: defaultListSelectBase,
    defaultProps: defaultListSelectProps,
  },
  'Login': {
    create: createLoginConfig,
    defaultBase: defaultLoginBase,
    defaultProps: defaultLoginProps,
  },
};

export default {
  install(app: App) {
    Object.entries(workbenchComponents).forEach(([name, component]) => {
      app.component(`${name}Config`, component);
    });
  }
};
