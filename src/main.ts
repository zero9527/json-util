import './single-spa-config';
import Vue from 'vue';
import VueCompositionApi from '@vue/composition-api';
import Iconfont from '@/components/Iconfont/index.vue';
import router from './router';
import App from './App.vue';

Vue.use(VueCompositionApi);
Vue.component('icon-font', Iconfont);

Vue.config.productionTip = false;

new Vue({
  router,
  render: (h: any) => h(App),
}).$mount('#json-util');
