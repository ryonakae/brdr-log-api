import gulp from 'gulp';
import filePath from '../filePath';
import watch from 'gulp-watch';
import runSequence from 'run-sequence';


gulp.task('watch', () => {
  // sass
  watch([
    filePath.dev.styles + '**/*.{scss,sass,css}'
  ], (event) => {
    gulp.start('sass');
  });

  // image minify
  watch(filePath.dev.images + '**/*', (event) => {
    gulp.start('image:min');
  });

  // sprite image
  watch(filePath.dev.sprite + '*', (event) => {
    runSequence('image:sprite', 'sass');
  });

  // js libraries
  watch([
    filePath.dev.scripts + 'lib/**/*',
    'gulp/jsLib.js'
  ], (event) => {
    gulp.start('concat:js');
  });

  // other file
  watch([
    filePath.dev.fonts + '**/*',
    filePath.dev.root + 'assets/audio/**/*',
    filePath.dev.root + 'assets/video/**/*',
    filePath.dev.root + '**/*.{php,html}',
    filePath.dev.root + 'style.css'
  ], (event) => {
    gulp.start('copyFile');
  });
});
