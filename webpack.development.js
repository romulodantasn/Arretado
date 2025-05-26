const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './core/main.ts',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'src'),
    publicPath: '/',
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  module: {  // Corrigido aqui
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  devServer: {
    static: {
      directory: path.resolve(__dirname, 'src'),
    },
    port: 8080,
    open: true,
    compress: true,
    hot: true,
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './core/index.html', // Caminho para o HTML original
    }),
  ],
  mode: 'development',
};
