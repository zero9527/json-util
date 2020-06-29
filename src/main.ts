import Vue from 'vue';
import singleSpaVue from 'single-spa-vue';
import VueCompositionApi from '@vue/composition-api';
import singleSpaSetup from '@/single-spa-config';
import Iconfont from '@/components/Iconfont/index.vue';
import router from './router';
import App from './App.vue';

singleSpaSetup();
Vue.use(VueCompositionApi);
Vue.component('icon-font', Iconfont);

Vue.config.productionTip = false;

// **************** 主应用一般写法 ****************
// // 子应用 registerAppliaction 注册
// new Vue({
//   router,
//   render: (h: any) => h(App),
// }).$mount('#json-util');

// **************** 主应用使用 Parcel 写法 ****************
// 主应用使用 Parcel 挂载子应用（某组件下）的时候的写法
// 需要把当前应用当做子应用，然后 registerAppliaction 调用
const singleSpa = singleSpaVue({
  Vue,
  appOptions: {
    el: '#json-util',
    render: (h: any) => h(App),
    router,
  },
});

// eslint-disable-next-line
export let mountParcel: any;

export const bootstrap = (props: any) => {
  mountParcel = props.mountParcel;
  return singleSpa.bootstrap(props);
};

export const { mount, unmount } = singleSpa;
