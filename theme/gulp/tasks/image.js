import gulp from 'gulp';
import filePath from '../filePath';
import env from '../env';
import imagemin from 'gulp-imagemin';
import pngcrush from 'imagemin-pngcrush';
import cache from 'gulp-cache';
import spritesmith from 'gulp.spritesmith';
import gulpif from 'gulp-if';
import plumber from 'gulp-plumber';
import buffer from 'vinyl-buffer';
import merge from 'merge-stream';
import bs from './browserSync';


// image minify
gulp.task('image:min', () => {
  const imageminOption = {
    optimizationLevel: 7,
    progressive: true,
    interlaced: true,
    svgoPlugins: [{removeViewBox: false}],
    use: [pngcrush()]
  };

  return gulp
    .src([
      filePath.dev.images + '**/*',
      filePath.public.images + 'sprite.png',
      '!' + filePath.dev.images + 'sprite',
      '!' + filePath.dev.sprite + '*'
    ])
    .pipe(gulpif(env === 'production', imagemin(imageminOption)))
    .pipe(gulp.dest(filePath.public.images))
    .on('end', () => {
      if(env === 'development' && bs.active) gulp.start('bs:reload');
    });
});


// image sprite
// webpackのaliasで解決するために、imgPath,retinaImgPathは'images/...'というパスにする
gulp.task('image:sprite', (callback) => {
  const spriteData = gulp.src(filePath.dev.sprite + '*.png')
    .pipe(plumber())
    .pipe(spritesmith({
      imgName: 'sprite.png',
      imgPath: 'images/sprite.png',
      cssName: '_sprite.scss',
      padding: 10,
      retinaSrcFilter: filePath.dev.sprite + '*-2x.png',
      retinaImgName: 'sprite-2x.png',
      retinaImgPath: 'images/sprite-2x.png'
    }));

  const imgStream = spriteData.img
    .pipe(buffer())
    .pipe(gulp.dest(filePath.public.images));

  const cssStream = spriteData.css
    .pipe(buffer())
    .pipe(gulp.dest(filePath.dev.styles));

  return merge(imgStream, cssStream);
});