const HtmlWebPackPlugin = require('html-webpack-plugin');
const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  devtool: 'source-map',
  entry: {
    backgroundScript: path.join(__dirname, 'src/background/index.js'),
    popup: ['@babel/polyfill', path.join(__dirname, 'src/popup/index.js')],
  },
  resolve: {
    symlinks: false,
    extensions: ['-browser.js', '.js', '.json', '.jsx'],
    alias: {
      bcoin$: path.resolve(
        __dirname,
        'node_modules/bcoin/lib/bcoin-browser.js'
      ),
    },
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js',
    publicPath: '/',
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
      {
        test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
        loader: require.resolve('url-loader'),
        options: {
          limit: 10000,
          name: 'static/media/[name].[hash:8].[ext]',
        },
      },
      {
        test: [/\.eot$/, /\.ttf$/, /\.svg$/, /\.woff$/, /\.woff2$/],
        use: {
          loader: require.resolve('file-loader'),
        },
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  plugins: [
    new HtmlWebPackPlugin({
      template: `./src/popup/index.html`,
      filename: 'popup.html',
      chunks: ['popup'],
      inject: true,
    }),
    new CopyWebpackPlugin(['manifest.json', { from: 'static', to: 'static' }]),
  ],
};
