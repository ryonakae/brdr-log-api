import minimist from 'minimist';
import gutil from 'gulp-util';

const minimistOption = {
  string: 'env',
  default: {
    env: process.env.NODE_ENV || 'development'
  }
};

const options = minimist(process.argv.slice(2), minimistOption);

gutil.log('[env]', gutil.colors.yellow(options.env));

export default options.env;