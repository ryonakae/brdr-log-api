const path = require('path')

module.exports = {
  theme: '/wp-content/themes/l/',
  src: path.resolve(__dirname, 'src'),
  dist: path.resolve(__dirname, 'dist'),
  public: path.resolve(__dirname, 'public'),
  assets: path.resolve(__dirname, path.join('src', 'assets'))
}
