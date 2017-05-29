import gulp from 'gulp';
import filePath from '../filePath';
import del from 'del';


gulp.task('cleanPublic', () => {
  return del([
    filePath.public.root + '**/*',
    '!' + filePath.public.root + '.gitkeep'
  ]);
});