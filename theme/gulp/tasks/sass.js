import gulp from 'gulp';
import filePath from '../filePath';
import env from '../env';
import sass from 'gulp-sass';
import autoprefixer from 'gulp-autoprefixer';
import combineMediaQueries from 'gulp-combine-media-queries';
import csscomb from 'gulp-csscomb';
import cleanCSS from 'gulp-clean-css';
import plumber from 'gulp-plumber';
import sourcemaps from 'gulp-sourcemaps';
import gulpif from 'gulp-if';
import lazypipe from 'lazypipe';
import bs from './browserSync';
import bourbon from 'node-bourbon';


gulp.task('sass', () => {
  // lazypipe().pipe(fn[, arg1[, arg2[, ...]]])
  // e.g.: lazypipe().pipe(concat, 'bundle.js', {newLine: ';'});
  const prodTasks = lazypipe()
    .pipe(combineMediaQueries)
    .pipe(csscomb)
    .pipe(cleanCSS);

  return gulp
    .src([
      filePath.dev.styles + '**/*.{scss,sass}',
      '!' + filePath.dev.styles + '**/_*.{scss,sass}'
    ])
    .pipe(plumber({
      errorHandler(err) {
        console.log(err.message);
        this.emit('end');
      }
    }))
    .pipe(gulpif(env === 'development', sourcemaps.init()))
    .pipe(sass({
      outputStyle: 'expanded',
      includePaths: bourbon.includePaths
    }))
    .pipe(autoprefixer({
      browsers: [
        'last 4 versions',
        'ie >= 10',
        'iOS >= 8.1',
        'Android >= 4.4'
      ],
      cascade: false
    }))
    .pipe(gulpif(env === 'development', sourcemaps.write('./')))
    .pipe(gulpif(env === 'production', prodTasks()))
    .pipe(gulp.dest(filePath.public.styles))
    .pipe(bs.stream({match: '**/*.css'}));
});