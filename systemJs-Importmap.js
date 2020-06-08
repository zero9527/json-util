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
      ? '//localhost:2333/js/app.js'
      : 'https://zero9527.github.io/vue-calendar/js/app.js', // 子应用的 hash
  },
  {
    name: '@vue-mf/clock',
    entry: isEnvDev
      ? '//localhost:2334/js/app.js'
      : 'https://zero9527.github.io/vue-calendar/js/app.js', // 子应用的 hash
  },
];
