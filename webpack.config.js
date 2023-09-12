const path = require('path');
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: './src/index.js',
  mode: "development",
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
        new CopyWebpackPlugin({
          patterns: [{
            from: '**/*',
            to: 'networks/[file]',
            toType: 'template',
            context: 'node_modules/@idscan/idvc2/dist/networks/',
          }],
        }),
        new HtmlWebpackPlugin({
        title: 'DVS Demo Application',
        template: 'index.html'
      })
  ],
  target: 'web'
};