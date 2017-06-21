import webpack from 'webpack';
import path from 'path';
import filePath from '../gulp/filePath';
import autoprefixer from 'autoprefixer';
import bourbon from 'node-bourbon';


export default {
  entry: [
    filePath.dev.scripts + 'app.js'
  ],
  output: {
    filename: 'app.js'
  },
  module: {
    rules: [
      // 画像とフォントは200KB以下ならbase64エンコード
      // base64エンコードしない場合はテーマ内の指定のディレクトリのパスを入れる
      // images
      {
        test: /\.(jpg|png|gif)$/,
        loader: 'url-loader?emitFile=false&limit=200000&name=' + filePath.theme.images + '[name].[ext]'
      },
      // images(svg)
      {
        test: /\.svg$/,
        loader: 'svg-sprite-loader'
      },
      // webfont
      {
        test: /\.(otf|eot|ttf|woff|woff2)$/,
        loader: 'url-loader?emitFile=false&limit=200000&name=' + filePath.theme.fonts + '[name].[ext]'
      },
      // eslint
      {
        test: /\.(js|vue)$/,
        enforce: 'pre',
        exclude: /node_modules/,
        loader: 'eslint-loader'
      },
      // babel js
      {
        test: /\.js$/,
        loader: 'babel-loader',
        options: {
          presets: [['es2015', { modules: false }]]
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
      bourbon: bourbon.includePaths[0] + '/_bourbon.scss',
      styles: path.resolve(__dirname, '../' + filePath.dev.styles),
      css: path.resolve(__dirname, '../' + filePath.public.styles),
      images: path.resolve(__dirname, '../' + filePath.public.images),
      fonts: path.resolve(__dirname, '../' + filePath.public.fonts)
    }
  }
}
