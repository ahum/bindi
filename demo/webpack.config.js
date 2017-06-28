const path = require('path');
const { CheckerPlugin } = require('awesome-typescript-loader')

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
    new CheckerPlugin()
  ]
}