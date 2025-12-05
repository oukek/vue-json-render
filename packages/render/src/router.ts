import { createRouter, createWebHistory } from 'vue-router';
import Login from './views/Login.vue';
import UserInfo from './views/UserInfo.vue';
import ActivityQuery from './views/ActivityQuery.vue';
import DynamicPage from './views/DynamicPage.vue';
import Preview from './views/Preview.vue';

const routes = [
  { path: '/login', component: Login },
  { path: '/info', component: UserInfo },
  { path: '/activity', component: ActivityQuery },
  { path: '/page/:pageId?', component: DynamicPage },
  { path: '/preview', component: Preview },
  { path: '/', redirect: '/login' }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
