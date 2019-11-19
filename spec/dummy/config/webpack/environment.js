const { environment } = require('@rails/webpacker')
const webpack = require('webpack')

// https://github.com/rails/webpacker/issues/1595
// Otherwise it is looking for node_modules in top-level folder
const { resolve } = require('path')
const basePath = resolve(".");
environment.resolvedModules.prepend('root', basePath + '/node_modules')

environment.plugins.prepend(
  'Provide',
  new webpack.ProvidePlugin({
    $: 'jquery',
    'window.jQuery': 'jquery',
    jQuery: 'jquery'
  })
)

// resolve-url-loader must be used before sass-loader
environment.loaders.get('sass').use.splice(-1, 0, {
  loader: 'resolve-url-loader'
});

module.exports = environment
