import webpack from 'webpack';
import merge from 'webpack-merge';
import baseConfig from './webpack.config.base';

module.exports = merge(baseConfig, {
  entry: [
    'webpack-hot-middleware/client?noinfo=true&quiet=true'
  ],
  output: {
    publicPath: '/'
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
});
