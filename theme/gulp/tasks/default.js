import gulp from 'gulp';
import env from '../env';
import runSequence from 'run-sequence';


gulp.task('default', () => {
  // development
  if (env === 'development') {
    runSequence('cleanPublic', ['copyFile', 'image:sprite'], ['sass', 'image:min'], 'webpack', 'bs:init', 'watch');
  }

  // production
  else if (env === 'production') {
    runSequence('clearCache', 'cleanPublic', ['copyFile', 'image:sprite'], ['sass', 'image:min'], 'webpack');
  }
});
