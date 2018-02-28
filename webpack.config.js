const webpack = require('webpack')
const WorkBoxPlugin = require('workbox-webpack-plugin')
const merge = require('webpack-merge')
const path = require('path')

const filePath = {
  theme: '/wp-content/themes/l/'
}

// common config
const common = {
  entry: {
    index: path.join(__dirname, 'src/index.js')
  },

  output: {
    filename: '[name].js',
    path: path.join(__dirname, 'theme')
  },

  module: {
    rules: [
      // images
      {
        test: /\.(jpg|png|bmp|gif)$/,
        loader: 'url-loader',
        options: {
          limit: 20000,
          name: '[name].[ext]',
          outputPath: 'images/',
          publicPath: filePath.theme + 'images/'
        }
      },
      // images(svg)
      {
        test: /\.svg$/,
        loader: 'svg-sprite-loader'
      },

      // webfont
      {
        test: /\.(otf|eot|ttf|woff|woff2)$/,
        loader: 'url-loader',
        options: {
          limit: 1,
          name: '[name].[ext]',
          outputPath: 'fonts/',
          publicPath: filePath.theme + 'fonts/'
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

  plugins: [
    new webpack.NamedModulesPlugin(),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      minChunks: module => {
        return module.context && module.context.includes('node_modules')
      }
    }),
    new WorkBoxPlugin({
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
            cacheExpiration: {
              maxAgeSeconds: 60 * 60 * 24
            }
          }
        },
        {
          urlPattern: /^(https?):\/\/.*\/.*\.(jpg|jpeg|gif|png)/,
          // urlPattern: /(https?)(:\/\/[-_.!~*\'()a-zA-Z0-9;\/?:\@&=+\$,%#]+)\.(jpg|jpeg|gif|png)$/,
          handler: 'cacheFirst',
          options: {
            cacheName: 'images',
            cacheExpiration: {
              maxAgeSeconds: 60 * 60 * 24 * 7
            }
          }
        }
      ]
    })
  ]
}

// development config
const dev = {
  entry: {
    index: [
      path.join(__dirname, 'src/index.js'),
      'webpack-hot-middleware/client?noinfo=true&quiet=true'
    ]
  },

  output: {
    publicPath: filePath.theme
  },

  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('development')
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.LoaderOptionsPlugin({
      debug: true
    })
  ],

  cache: true,
  devtool: 'inline-source-map'
}

// production config
const prod = {
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production')
    }),
    new webpack.optimize.ModuleConcatenationPlugin(),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false,
        drop_console: true
      },
      comments: false
    }),
    new webpack.optimize.AggressiveMergingPlugin(),
    new webpack.optimize.OccurrenceOrderPlugin()
  ]
}

// exports
module.exports = merge(
  common,
  process.env.NODE_ENV === 'production' ? prod : dev
)
