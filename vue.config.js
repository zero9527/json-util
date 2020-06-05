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
      args[0].systemJsImportmap = systemJsImportmap;
      return args;
    });
  },
};
