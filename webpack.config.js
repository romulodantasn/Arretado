const path = require('path');

module.exports = {
  entry: './src/main.ts', // Arquivo principal do seu projeto
  output: {
    filename: 'bundle.js', // Arquivo de saída
    path: path.resolve(__dirname, 'src'), // Pasta onde o arquivo será salvo
  },
  resolve: {
    extensions: ['.ts', '.js'], // Extensões que o Webpack irá resolver
  },
  odule: {
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
  mode: 'development', // Pode ser 'development' ou 'production'
};
