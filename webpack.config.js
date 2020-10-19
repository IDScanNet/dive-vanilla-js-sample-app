const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist'),
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader'
        ]
      }
    ]
  },
  resolve: {
      fallback: { 
          "http": require.resolve("stream-http") 
      }
  },
  plugins: [
    new CopyWebpackPlugin ({ patterns: [ { from: 'node_modules/@idscan/idvc/dist/networks/**/*', to: 'assets/[folder]/[name].[ext]', toType: 'template' } ] }),
    new HtmlWebpackPlugin({
        title: 'DVS Demo Application',
        template: 'index.html'
      })
  ],
  target: 'web'
};