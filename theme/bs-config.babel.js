import webpack from 'webpack';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';

import webpackConfig from './webpack.config.babel';
const bundler = webpack(webpackConfig);


export default {
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
        noInfo: false,
        stats: {
          colors: true
        }
      }),
      webpackHotMiddleware(bundler)
    ]
  }
};
