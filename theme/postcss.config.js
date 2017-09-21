const path = require('path')
const filePath = require('./file-path')

const options = {
  postcssImport: {
    path: path.join(filePath.assets, 'styles')
  },
  cssnext: {
    browsers: [
      'last 2 versions',
      'ie > 11',
      'iOS >= 10',
      'Android >= 5.0'
    ],
    cascade: false
  },
  cssnano: {
    preset: 'default',
    autoprefixer: false,
    discardUnused: {
      fontFace: false
    }
  }
}

module.exports = ({env}) => ({
  plugins: {
    'postcss-import': options.postcssImport,
    'postcss-cssnext': options.cssnext,
    'cssnano': env === 'production' ? options.cssnano : false
  }
})
