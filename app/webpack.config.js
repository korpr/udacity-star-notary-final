const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const NodePolyfillPlugin = require("node-polyfill-webpack-plugin")
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
module.exports = {

  mode: "development",
  entry: "./src/index.js",
  output: {
    filename: "index_bundle.js",
    path: path.resolve(__dirname, "dist"),
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: ["babel-loader"]
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"]
      }
    ]
  },
  

  plugins: [
  
    new NodePolyfillPlugin(),
    new HtmlWebpackPlugin({
      template: 'src/index.html', // relative to project root 
    }),
  ],
  devtool: 'cheap-module-source-map',
  devServer: { contentBase: path.join(__dirname, "dist"), writeToDisk: true, hot: true },
};
