import { registerApplication, start } from 'single-spa';

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

registerApplication({
  name: '@vue-mf/clock',
  app: () => (window as any).System.import('@vue-mf/clock'),
  activeWhen: location => {
    return location.href.includes('/sub-app');
  },
  customProps: {
    root: 'json-util',
  },
});

start();
