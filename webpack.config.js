const webpack = require('webpack')
const path = require('path')
const { GenerateSW } = require('workbox-webpack-plugin')
const THEME_PATH = '/wp-content/themes/l/'

module.exports = {
  entry: {
    index: path.join(__dirname, 'src/index.js')
  },

  output: {
    filename: '[name].js',
    path: path.join(__dirname, 'theme')
  },

  module: {
    rules: [
      // svg images
      {
        test: /\.svg$/,
        loader: 'svg-sprite-loader'
      },
      // images
      {
        test: /\.(jpg|png|bmp|gif)$/,
        loader: 'url-loader',
        options: {
          limit: 20000,
          name: '[name].[ext]',
          outputPath: 'images/',
          publicPath: THEME_PATH + 'images/'
        }
      },

      // webfont
      {
        test: /\.(otf|eot|ttf|woff|woff2)$/,
        loader: 'url-loader',
        options: {
          limit: 1,
          name: '[name].[ext]',
          outputPath: 'fonts/',
          publicPath: THEME_PATH + 'fonts/'
        }
      },

      // js
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      },

      // vue
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      }
    ]
  },

  resolve: {
    alias: {
      '@': path.join(__dirname, 'src'),
      styles: path.join(__dirname, 'src/assets/styles'),
      images: path.join(__dirname, 'src/assets/images'),
      fonts: path.join(__dirname, 'src/assets/fonts')
    }
  },

  optimization: {
    splitChunks: {
      cacheGroups: {
        vendor: {
          test: /node_modules/,
          name: 'vendor',
          chunks: 'initial',
          enforce: true
        }
      }
    }
  },

  plugins: [
    new GenerateSW({
      cacheId: 'brdr-log',
      globDirectory: path.join(__dirname, 'theme'),
      globPatterns: ['**/*.{html,css,js}', 'fonts/**/*'],
      swDest: path.join(__dirname, 'theme/service-worker.js'),
      clientsClaim: true,
      skipWaiting: true,
      runtimeCaching: [
        {
          urlPattern: /\/wp-json\/.+/,
          handler: 'networkFirst',
          options: {
            cacheName: 'api',
            expiration: {
              maxAgeSeconds: 60 * 60 * 24
            }
          }
        },
        {
          urlPattern: /^(https?):\/\/.*\/.*\.(jpg|jpeg|gif|png)/,
          handler: 'cacheFirst',
          options: {
            cacheName: 'images',
            expiration: {
              maxAgeSeconds: 60 * 60 * 24 * 7
            }
          }
        }
      ]
    })
  ]
}
