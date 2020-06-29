import Vue from 'vue';
import Router from 'vue-router';
import AsyncComponent from '@/components/AsyncComponent';

Vue.use(Router);

const JSONUtil = AsyncComponent(() =>
  import(
    /* webpackPrefetch: true */
    /* webpackChunkName: 'json-util' */
    '@/views/JSON-Util/index.vue'
  ),
);

const SubApp = AsyncComponent(() => import('@/views/SubApp/index.vue'));

const routes = [
  { path: '/', name: 'json-util', component: JSONUtil },
  { path: '/sub-app', name: 'sub-app', component: SubApp },
];

export default new Router({
  routes,
});
