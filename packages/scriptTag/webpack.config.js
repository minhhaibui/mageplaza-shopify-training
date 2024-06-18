const path = require('path');
const Dotenv = require('dotenv-webpack');

const isProduction = process.env.NODE_ENV === 'production';
const environmentPath = !process.env.ENVIRONMENT ? '.env' : `.env.${process.env.ENVIRONMENT}`;

module.exports = {
  mode: isProduction ? 'production' : 'development',
  entry: ['./index.js'], // Đường dẫn đến file entry ngoài cùng
  output: {
    path: path.resolve(__dirname, '../../static/scripttag'),
    filename: 'index.min.js'
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/env', '@babel/react'],
            plugins: ['@babel/plugin-proposal-class-properties']
          }
        }
      },
      {
        test: /\.css$/, // Thêm quy tắc để xử lý các tệp CSS
        use: ['style-loader', 'css-loader'],
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    extensions: ['.js', '.jsx']
  },
  stats: {
    colors: true
  },
  devtool: isProduction ? false : 'eval-source-map',
  plugins: [
    new Dotenv({
      safe: false,
      defaults: '.env.example',
      systemvars: true,
      path: path.resolve(__dirname, environmentPath)
    })
  ]
};
