import gulp from 'gulp';
import filePath from '../filePath';
import env from '../env';
import webpack from 'webpack';
import webpackStream from 'webpack-stream';


let webpackConfig;

if (env === 'development') {
  webpackConfig = require('../../webpack/webpack.config.development');
}
else if (env === 'production') {
  webpackConfig = require('../../webpack/webpack.config.production');
}


gulp.task('webpack', () => {
  return gulp
    .src(filePath.dev.scripts + 'app.js')
    .pipe(webpackStream(webpackConfig, webpack))
    .pipe(gulp.dest(filePath.public.scripts));
});
