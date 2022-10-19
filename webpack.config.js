const path = require('path');
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
        new HtmlWebpackPlugin({
        title: 'DVS Demo Application',
        template: 'index.html'
      })
  ],
  target: 'web'
};