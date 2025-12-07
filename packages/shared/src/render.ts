import { App } from 'vue';
import BaseWrapper from './components/BaseWrapper.vue';
import ButtonRender from './components/Button/render.vue';
import TextRender from './components/Text/render.vue';
import ImageRender from './components/Image/render.vue';
import ProgressRender from './components/Progress/render.vue';
import InputRender from './components/Input/render.vue';

// Component Map
export const renderComponents: Record<string, any> = {
  'Button': ButtonRender,
  'Text': TextRender,
  'Image': ImageRender,
  'Progress': ProgressRender,
  'Input': InputRender,
};

export { BaseWrapper };

// Vue Plugin for global registration
export default {
  install(app: App) {
    app.component('BaseWrapper', BaseWrapper);
    // Register all render components
    Object.entries(renderComponents).forEach(([name, component]) => {
      app.component(name, component);
    });
  }
};
