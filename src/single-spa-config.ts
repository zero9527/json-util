import { registerApplication, start } from 'single-spa';

export default function singleSpaSetup() {
  // 改为 Parcel 手动挂载子应用了，需要导出 mountParcel，已经用 singleVue 包裹了，所以要用 registerApplication 启动
  registerApplication({
    name: 'root-config',
    app: () => (window as any).System.import('root-config'),
    activeWhen: () => true,
  });

  start();
}
