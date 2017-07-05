const path = require('path');
const { CheckerPlugin } = require('awesome-typescript-loader')
const webpack = require('webpack');

module.exports = {
  devtool: 'source-map',
  context: __dirname,
  entry: './entry.js',
  output: {
    path: __dirname,
    filename: 'bundle.js'
  },
  module: {
    loaders: [
      {
        test: /\.ts$/,
        loader: 'awesome-typescript-loader'
      }
    ]
  },
  // Currently we need to add '.ts' to the resolve.extensions array.
  resolve: {
    extensions: ['.ts', '.js']
  },
  plugins: [
    new CheckerPlugin(),
    new webpack.DefinePlugin({
      BINDI_DEBUG: false
    })
  ]
}