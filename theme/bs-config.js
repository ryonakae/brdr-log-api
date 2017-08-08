const webpack = require('webpack')
const webpackDevMiddleware = require('webpack-dev-middleware')
const webpackHotMiddleware = require('webpack-hot-middleware')

const webpackConfig = require('./webpack.config')
const bundler = webpack(webpackConfig)


module.exports = {
  open: false,
  notify: false,
  port: 3000,
  // reloadDelay: 300,
  ghostMode: false,
  proxy: {
    target: 'log.brdr.dev',
    middleware: [
      webpackDevMiddleware(bundler, {
        publicPath: webpackConfig.output.publicPath,
        noInfo: true,
        quiet: true,
        stats: {
          colors: true
        }
      }),
      webpackHotMiddleware(bundler)
    ]
  }
}
