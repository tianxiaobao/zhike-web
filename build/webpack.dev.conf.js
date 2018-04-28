var utils = require('./utils')
var webpack = require('webpack')
var config = require('../config')
var merge = require('webpack-merge')
var baseWebpackConfig = require('./webpack.base.conf')
var HtmlWebpackPlugin = require('html-webpack-plugin')
var FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')

// add hot-reload related code to entry chunks
Object.keys(baseWebpackConfig.entry).forEach(function (name) {
  baseWebpackConfig.entry[name] = ['./build/dev-client'].concat(baseWebpackConfig.entry[name])
})

var extendWebpackConfig = {
  module: {
    rules: utils.styleLoaders({ sourceMap: config.dev.cssSourceMap })
  },
  // cheap-module-eval-source-map is faster for development
  devtool: '#cheap-module-eval-source-map',
  plugins: [
    new webpack.DefinePlugin({
      'process.env': config.dev.env
    }),
    // https://github.com/glenjamin/webpack-hot-middleware#installation--usage
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    new FriendlyErrorsPlugin()
  ]
}
Object.keys(baseWebpackConfig.entry).forEach(function (name) {
  var templateName = 'index2';
  var data = {};
  if (name === 'fm-consumer' || name === 'fm-shopping') {
    data = {
      var: '${chartsData}'
    }
    templateName = 'index4';
  }
  if (name === 'error') {
    templateName = 'error';
    data = {
      var: '${errorMsg}'
    }
  } 
  if (name === 'product') {
    templateName = 'product'
  }
  extendWebpackConfig.plugins.push(
    new HtmlWebpackPlugin({
      exdata: data,
      filename: name + '.html',
      template: templateName + '.html',
      inject: true,
      chunks: [name]
    })
  );
})

module.exports = merge(baseWebpackConfig, extendWebpackConfig);
