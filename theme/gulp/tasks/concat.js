import gulp from 'gulp';
import filePath from '../filePath';
import env from '../env';
import plumber from 'gulp-plumber';
import concat from 'gulp-concat';
import bs from './browserSync';
import jsLib from '../jsLib';


gulp.task('concat:js', () => {
  let libraries = [];

  for (let i = 0; i < jsLib.libraries.length; i++) {
    const lib = jsLib.path + jsLib.libraries[i];
    libraries.push(lib);
  }

  return gulp
    .src(libraries)
    .pipe(plumber())
    .pipe(concat('lib.js', {
      newLine: '\n\n'
    }))
    .pipe(gulp.dest(filePath.public.scripts))
    .on('end', () => {
      if(env === 'development' && bs.active) gulp.start('bs:reload');
    });
});