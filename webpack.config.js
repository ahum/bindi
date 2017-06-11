const path = require('path');

module.exports = {
  devtool: 'eval',
  context: __dirname,
  entry: './entry.js',
  output: {
    path: __dirname,
    filename: 'bundle.js'
  }
}