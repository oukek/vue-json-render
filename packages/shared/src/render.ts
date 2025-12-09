import { App } from 'vue';
import BaseWrapper from './components/basic/BaseWrapper.vue';
import ButtonRender from './components/basic/Button/render.vue';
import TextRender from './components/basic/Text/render.vue';
import ImageRender from './components/basic/Image/render.vue';
import ProgressRender from './components/basic/Progress/render.vue';
import InputRender from './components/basic/Input/render.vue';
import ListSelectRender from './components/basic/ListSelect/render.vue';
import LoginRender from './components/business/Login/render.vue';

// Component Map
export const renderComponents: Record<string, any> = {
  'Button': ButtonRender,
  'Text': TextRender,
  'Image': ImageRender,
  'Progress': ProgressRender,
  'Input': InputRender,
  'ListSelect': ListSelectRender,
  'Login': LoginRender,
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
