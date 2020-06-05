const isEnvDev = process.env.NODE_ENV === 'development';

// systemjs-importmap 的配置，通过webpack给html用
module.exports = [
  {
    name: 'root-config',
    url: './js/app.js',
  },
  {
    name: '@vue-mf/calendar',
    url: isEnvDev
      ? '//localhost:2333/js/app.js'
      : 'https://zero9527.github.io/vue-calendar/js/app.js', // 子应用的 hash
  },
];
