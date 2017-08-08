const webpack = require('webpack');
const merge = require('webpack-merge');
const path = require('path');
const cssnext = require('postcss-cssnext');
const postcssImport = require('postcss-import');


// file path
const filePath = {
  theme: '/wp-content/themes/l/',
  src: path.resolve(__dirname, 'src'),
  dist: path.resolve(__dirname, 'dist'),
  public: path.resolve(__dirname, 'public'),
  assets: path.resolve(__dirname, path.join('src', 'assets'))
};


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
        enforce: 'pre',
        test: /\.(js|vue)$/,
        loader: 'eslint-loader',
        exclude: /(node_modules|library)/
      },

      // js
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      },

      // vuejs
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          postcss: [
            postcssImport({
              path: [path.join(filePath.assets, 'styles')]
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
      styles: path.join(filePath.assets, 'styles'),
      images: path.join(filePath.assets, 'images'),
      fonts:  path.join(filePath.assets, 'fonts')
    }
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
