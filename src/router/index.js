import { createRouter, createWebHistory } from 'vue-router/auto';
import { routes as autoRoutes } from 'vue-router/auto-routes';
import User from '@/components/User.vue';
import Face from '@/components/face.vue';
import Registration from '@/components/registration.vue';
import Result from '@/components/result.vue';
import Helloworld from '@/components/HelloWorld.vue';
import Call from '@/components/call.vue';

// 手動でのルートを追加
const manualRoutes = [
  {
    path: '/User',
    name: 'User',
    component: User,
  },
  {
    path: '/face',
    name: 'face',
    component: Face,
    props: true,
  },
  {
    path: '/registration/:userId',
    name: 'registration',
    component: Registration,
    props: true,
  },
  {
    path: '/result',
    name: 'result',
    component: Result,
    props: true,
  },
  {
    path: '/',
    name: 'Helloworld',
    component: Helloworld,
    props: true,
  },
  {
    path: '/call',
    name: 'call',
    component: Call,
    props: true,
  },
];

// 自動生成されたルートと手動で追加したルートを結合
const routes = [...autoRoutes, ...manualRoutes];
const router = createRouter({
  history: createWebHistory(),
  routes,
});
// Workaround for dynamic import error
router.onError((err, to) => {
  if (err?.message?.includes?.('Failed to fetch dynamically imported module')) {
    if (!localStorage.getItem('vuetify:dynamic-reload')) {
      console.log('Reloading page to fix dynamic import error');
      localStorage.setItem('vuetify:dynamic-reload', 'true');
      location.assign(to.fullPath);
    } else {
      console.error('Dynamic import error, reloading page did not fix it', err);
    }
  } else {
    console.error(err);
  }
});
router.isReady().then(() => {
  localStorage.removeItem('vuetify:dynamic-reload');
});
export default router;