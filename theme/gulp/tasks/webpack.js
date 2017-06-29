import gulp from 'gulp';
import filePath from '../filePath';
import env from '../env';
import webpack from 'webpack';
import webpackStream from 'webpack-stream';
import plumber from 'gulp-plumber';


let webpackConfig;

if (env === 'development') {
  webpackConfig = require('../../webpack/webpack.config.dev.babel');
}
else if (env === 'production') {
  webpackConfig = require('../../webpack/webpack.config.prod.babel');
}


gulp.task('webpack', () => {
  return gulp
    .src(filePath.dev.scripts + 'app.js')
    .pipe(plumber({
      errorHandler(err) {
        console.log(err.message);
        this.emit('end');
      }
    }))
    .pipe(webpackStream(webpackConfig, webpack))
    .pipe(gulp.dest(filePath.public.scripts));
});
