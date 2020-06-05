const systemJsImportmap = require('./systemJs-Importmap');

module.exports = {
  outputDir: 'docs',
  publicPath: './',
  filenameHashing: false,
  productionSourceMap: false,
  configureWebpack: config => {
    config.output.libraryTarget = 'system';

    config.devServer = {
      port: 666,
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
      disableHostCheck: true,
      historyApiFallback: true,
    };
  },
  chainWebpack: config => {
    config.plugin('html').tap(args => {
      const importMap = { imports: {} };
      systemJsImportmap.forEach(item => (importMap.imports[item.name] = item.entry));
      args[0].systemJsImportmap = JSON.stringify(importMap, null, 2);
      return args;
    });
  },
};
