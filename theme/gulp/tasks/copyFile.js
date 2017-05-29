import gulp from 'gulp';
import filePath from '../filePath';
import env from '../env';
import bs from './browserSync';


gulp.task('copyFile', () => {
  return gulp
    .src(
      [
        filePath.dev.fonts + '**/*',
        filePath.dev.root + 'assets/audio/**/*',
        filePath.dev.root + 'assets/video/**/*',
        filePath.dev.root + '**/*.{php,html}',
        filePath.dev.root + 'style.css'
      ],
      { base: filePath.dev.root }
    )
    .pipe(gulp.dest(filePath.public.root))
    .on('end', () => {
      if(env === 'development' && bs.active) gulp.start('bs:reload');
    });
});