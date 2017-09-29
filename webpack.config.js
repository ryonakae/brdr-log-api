const webpack = require('webpack')
const merge = require('webpack-merge')
const path = require('path')
const cssnext = require('postcss-cssnext')
const postcssImport = require('postcss-import')
const cssnano = require('cssnano')
const filePath = require('./file-path')


// common config
const common = {
  entry: [
    path.join(filePath.src, 'index.js')
  ],

  output: {
    filename: 'index.js',
    path: filePath.dist
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
          publicPath: filePath.theme
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
          publicPath: filePath.theme
        }
      },

      // js
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/
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
      '@': filePath.src,
      styles: path.join(filePath.assets, 'styles'),
      images: path.join(filePath.assets, 'images'),
      fonts:  path.join(filePath.assets, 'fonts')
    }
  }
}


// development config
const dev = {
  entry: [
    'webpack-hot-middleware/client?noinfo=true&quiet=true'
  ],

  output: {
    publicPath: filePath.theme
  },

  plugins: [
    new webpack.DefinePlugin({
      "process.env.NODE_ENV": JSON.stringify('development')
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.LoaderOptionsPlugin({
      debug: true
    })
  ],

  cache: true,
  devtool: 'inline-source-map',
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


// detect config
const config = process.env.NODE_ENV === 'production' ? prod : dev


// exports
module.exports = merge(common, config)
