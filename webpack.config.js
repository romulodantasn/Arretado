const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin'); 
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: './src/main.ts', 
  output: {
    filename: './docs/bundle.js',
    path: path.resolve(__dirname, 'docs'), // Pasta onde o arquivo será salvo
    publicPath: '/arretadov1.0.02/', // Ajuste para o caminho correto no GitHub Pages
  },
  resolve: {
    extensions: ['.ts', '.js'], // Extensões que o Webpack irá resolver
  },
  module: {
    rules: [
      {
        test: /\.(png|jpg|jpeg|gif)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'assets/sprites/[name][ext][query]'
        }
      },
      {
        test: /\.ts$/,  
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: 'src/index.html', // Caminho para o seu arquivo HTML de origem
      filename: 'index.html', // Nome do arquivo de saída na pasta docs
      publicPath: '/arretadov1.0.02'
    }),
    new CopyPlugin({
      patterns: [
        { from: 'src/assets', to: 'assets' }, // Copia os assets da pasta src para a pasta docs/assets
      ],
    }),
  ],
  mode: 'development', // Pode ser 'development' ou 'production'
};
