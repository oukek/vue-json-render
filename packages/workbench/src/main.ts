import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import WorkbenchPlugin from '@vue-json-render/shared/workbench';
import RenderPlugin from '@vue-json-render/shared/render';

const app = createApp(App);
app.use(router);
app.use(WorkbenchPlugin);
app.use(RenderPlugin); // Needed to render component previews in canvas
app.mount('#app');
