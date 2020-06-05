import { registerApplication, start } from 'single-spa';

registerApplication({
  name: '@vue-mf/calendar',
  app: () => (window as any).System.import('@vue-mf/calendar'),
  activeWhen: location => {
    return location.href.includes('/calendar');
  },
  customProps: {
    root: 'json-util',
  },
});

start();
