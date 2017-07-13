const webpack = require('webpack');
const merge = require('webpack-merge');
const path = require('path');
const cssnext = require('postcss-cssnext');
const postcssImport = require('postcss-import');


// theme path
const filePath = {
  theme: '/wp-content/themes/l/',
  dist: path.resolve(__dirname, 'dist'),
  styles: path.resolve(__dirname, './src/styles'),
  images: path.resolve(__dirname, './src/images'),
  fonts: path.resolve(__dirname, './src/fonts')
};


// common config
const common = {
  entry: [
    './src/scripts/app.js'
  ],

  output: {
    filename: './scripts/app.js',
    path: filePath.dist
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
          limit: 200000,
          name: '[name].[ext]',
          outputPath: 'fonts/',
          publicPath: filePath.theme
        }
      },

      // eslint
      {
        test: /\.(js|vue)$/,
        loader: 'eslint-loader',
        exclude: /node_modules/,
        enforce: 'pre'
      },

      // vuejs
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          postcss: [
            postcssImport({
              path: [filePath.styles]
            }),
            cssnext({
              // Autoprefixer
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
      styles:  filePath.styles,
      images:  filePath.images,
      fonts:   filePath.fonts
    }
  },

  stats: {
    colors: true
  }
};


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
