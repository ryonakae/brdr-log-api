const webpack = require('webpack');
const merge = require('webpack-merge');
const path = require('path');
const autoprefixer = require('autoprefixer');
const bourbon = require('node-bourbon');


// theme path
const themePath = '/wp-content/themes/l/';


// common config
const common = {
  entry: [
    './src/scripts/app.js'
  ],

  output: {
    filename: './scripts/app.js',
    path: path.resolve(__dirname, 'dist')
  },

  module: {
    rules: [
      // 画像とフォントはlimit(byte)以下ならbase64エンコード
      // それ以上ならファイルパスを記述+ファイルをコピー
      // images
      {
        test: /\.(jpg|png|gif)$/,
        loader: 'url-loader',
        options: {
          limit: 200000,
          name: '[name].[ext]',
          outputPath: 'images/',
          publicPath: themePath
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
          limit: 200000,
          name: '[name].[ext]',
          outputPath: 'fonts/',
          publicPath: themePath
        }
      },

      // eslint
      {
        test: /\.(js|vue)$/,
        enforce: 'pre',
        loader: 'eslint-loader',
        exclude: /node_modules/
      },

      // babel js
      {
        test: /\.js$/,
        loader: 'babel-loader',
        options: {
          presets: [['es2015', {modules: false}]]
        }
      },

      // vuejs
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          postcss: [
            autoprefixer({
              browsers: [
                'last 2 versions',
                'ie > 11',
                'iOS >= 10',
                'Android >= 5.0'
              ],
              cascade: false
            })
          ]
        }
      }
    ]
  },

  resolve: {
    alias: {
      // webpackでheadに挿入したりbase64エンコードしてcssに入れるファイルがあるパスを記述する
      bourbon: path.resolve(bourbon.includePaths[0], '_bourbon.scss'),
      styles:  path.resolve(__dirname, 'src/styles'),
      images:  path.resolve(__dirname, 'src/images'),
      fonts:   path.resolve(__dirname, 'src/fonts')
    }
  }
};


// development config
const dev = {
  entry: [
    'webpack-hot-middleware/client?noinfo=true&quiet=true'
  ],

  output: {
    publicPath: themePath
  },

  plugins: [
    new webpack.DefinePlugin({
      "process.env.NODE_ENV": JSON.stringify('development')
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin()
  ],

  devtool: 'inline-source-map',
  cache: true
};


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
};


// detect config
const config = process.env.NODE_ENV === 'production' ? prod : dev;


// exports
module.exports = merge(common, config);
