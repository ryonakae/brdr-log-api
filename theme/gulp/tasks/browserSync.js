import gulp from 'gulp';
import filePath from '../filePath';
import browserSync from 'browser-sync';
const bs = browserSync.create();
export default bs;
import webpack from 'webpack';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';


const webpackConfig = require('../../webpack/webpack.config.dev.babel');
const bundler = webpack(webpackConfig);


gulp.task('bs:init', () => {
  return bs.init({
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
  });
});


gulp.task('bs:reload', () => {
  return bs.reload();
});
