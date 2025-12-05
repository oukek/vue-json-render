import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import RenderPlugin from '@vue-json-render/shared/render';

const app = createApp(App);
app.use(router);
app.use(RenderPlugin);
app.mount('#app');
