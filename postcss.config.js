const path = require('path')

const options = {
  postcssImport: {
    path: path.join(__dirname, 'src/styles')
  },
  cssnext: {
    browsers: ['last 2 versions', 'IE >= 11', 'iOS >= 11', 'Android >= 5.0'],
    cascade: false
  }
}

module.exports = ctx => ({
  plugins: {
    'postcss-import': options.postcssImport,
    'postcss-cssnext': options.cssnext,
    csswring: ctx.env === 'production'
  }
})
