import { createRouter, createWebHistory } from 'vue-router';
import Login from './views/Login.vue';
import ActivityList from './views/ActivityList.vue';
import ActivityEditor from './views/ActivityEditor.vue';
import ActivityManage from './views/ActivityManage.vue';

const routes = [
  { path: '/login', component: Login },
  { path: '/activities', component: ActivityList },
  { path: '/editor/:id', component: ActivityEditor },
  { path: '/activity/:id/manage', component: ActivityManage },
  { path: '/', redirect: '/login' }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
