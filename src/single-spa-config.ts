import { registerApplication, start } from 'single-spa';

// 改为 Parcel 手动挂载子应用了，需要导出 mountParcel，已经用 singleVue 包裹了，所以要用 registerApplication 启动
registerApplication({
  name: 'root-config',
  app: () => (window as any).System.import('root-config'),
  activeWhen: () => true,
});

registerApplication({
  name: '@vue-mf/calendar',
  app: () => (window as any).System.import('@vue-mf/calendar'),
  activeWhen: location => {
    return location.href.includes('/sub-app');
  },
  customProps: {
    root: 'json-util',
  },
});

// 改为 Parcel 手动挂载了，所有这个要去掉
// registerApplication({
//   name: '@vue-mf/clock',
//   app: () => (window as any).System.import('@vue-mf/clock'),
//   activeWhen: location => {
//     return location.href.includes('/sub-app');
//   },
//   customProps: {
//     root: 'json-util',
//   },
// });

start();
