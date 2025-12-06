import { createRouter, createWebHistory } from 'vue-router';
import DynamicPage from './views/DynamicPage.vue';
import Preview from './views/Preview.vue';

const routes = [
  { path: '/', component: DynamicPage },
  { path: '/page/:pageId?', component: DynamicPage },
  { path: '/preview', component: Preview },
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
