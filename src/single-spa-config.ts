import { registerApplication, start } from 'single-spa';

registerApplication({
  name: '@vue-mf/calendar',
  app: () => (window as any).System.import('@vue-mf/calendar'),
  activeWhen: '/#/calendar',
  customProps: {
    root: 'json-util',
  },
});

start();
