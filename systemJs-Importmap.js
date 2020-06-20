const isEnvDev = process.env.NODE_ENV === 'development';

// systemjs-importmap 的配置，通过webpack给html用
module.exports = [
  {
    name: 'root-config',
    entry: './js/app.js',
  },
  {
    name: '@vue-mf/calendar',
    entry: isEnvDev
      ? '//zero9527.site/vue-calendar/js/app.js' // '//localhost:2333/js/app.js'
      : '//zero9527.site/vue-calendar/js/app.js',
  },
  {
    name: '@vue-mf/clock',
    entry: isEnvDev
      ? '//zero9527.site/vue-clock/js/app.js' // '//localhost:2334/js/app.js'
      : '//zero9527.site/vue-clock/js/app.js',
  },
];
