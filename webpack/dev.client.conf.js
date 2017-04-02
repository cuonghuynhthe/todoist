const path = require('path')
const webpack = require('webpack')
const cssnano = require('cssnano')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const SassLintPlugin = require('sasslint-webpack-plugin')
const ForkCheckerPlugin = require('awesome-typescript-loader').ForkCheckerPlugin
const extractTextPlugin = new ExtractTextPlugin('styles.[_hash].css')

const loader = {
  cssmodules: 'css-loader?modules&-minimize&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]&sourceMap',
  css: 'css-loader?sourceMap',
  babel: 'babel-loader?presets[]=react&presets[]=es2015&presets[]=stage-0&presets[]=react-hmre&cacheDirectory=true'
}

module.exports = {
  context: path.join(__dirname, '../'),
  cache: true,
  debug: false,
  devtool: 'cheap-module-inline-source-map',
  target: 'web',
  entry: {
    client: [
      'webpack-hot-middleware/client',
      './src/client'
    ]
  },
  plugins: [
    new webpack.ProvidePlugin({
      React: 'react',
    }),
    new webpack.DefinePlugin({
      __CLIENT__: true,
    }),
    new webpack.NoErrorsPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    extractTextPlugin,
    new SassLintPlugin({
      glob: './src/client/**/*.s?(a|c)ss'
    }),
    new webpack.DllReferencePlugin({
      context: path.resolve('./src'),
      manifest: require('../build/dll/vendor-manifest.json')
    }),
    new ForkCheckerPlugin(),
  ],
  output: {
    path: path.join(__dirname, '..', 'build'),
    filename: '[name].js',
    publicPath: '/public/static/',
    libraryTarget: 'var',
  },
  resolve: {
    modulesDirectories: ['./node_modules'],
    extensions: ['', '.js', '.jsx', '.ts', '.tsx', '.css', '.scss'],
    root: path.resolve('./src'),
  },
  module: {
    preLoaders: [
      {
        test: /\.jsx?$/,
        loader: 'eslint',
        include: path.resolve('./src/client'),
      },
      {
        test: /\.tsx?$/,
        loader: 'tslint',
        include: path.resolve('./src/client'),
      }
    ],
    loaders: [
      {
        test: /\.tsx?$/,
        loader: 'awesome-typescript-loader',
        include: path.resolve('./src/client'),
      },
      {
        test: /\.jsx?$/,
        loader: loader.babel,
        include: path.resolve('./src'),
      },
      {
        test: /\.css$/,
        loader: extractTextPlugin.extract('style-loader', loader.css),
        include: path.resolve('./src/tokyo'),
      },
      {
        test: /\.local\.scss$/,
        loaders: [
          'style',
          loader.cssmodules,
          'postcss',
          'sass?sourceMap',
        ],
        include: path.resolve('./src'),
      },
      {
        test: /^((?!local).)*\.scss$/,
        loader: extractTextPlugin.extract('style-loader', `${loader.css}!sass-loader?sourceMap`),
        include: path.resolve('./src/tokyo'),
      },
      { test: /\.woff(\?.*)?$/, loader: 'url?prefix=fonts/&name=[name].[ext]&limit=10000&mimetype=application/font-woff' },
      { test: /\.woff2(\?.*)?$/, loader: 'url?prefix=fonts/&name=[name].[ext]&limit=10000&mimetype=application/font-woff2' },
      { test: /\.otf(\?.*)?$/, loader: 'file?prefix=fonts/&name=[name].[ext]&limit=10000&mimetype=font/opentype' },
      { test: /\.ttf(\?.*)?$/, loader: 'url?prefix=fonts/&name=[name].[ext]&limit=10000&mimetype=application/octet-stream' },
      { test: /\.eot(\?.*)?$/, loader: 'file?prefix=fonts/&name=[name].[ext]' },
      { test: /\.svg(\?.*)?$/, loader: 'url?prefix=fonts/&name=[name].[ext]&limit=10000&mimetype=image/svg+xml' },
      { test: /\.(png|jpg|gif)$/, loader: 'url?limit=8192' }
    ]
  },
  postcss: [
    cssnano({
      autoprefixer: {
        add: true,
        remove: true,
        browsers: ['last 2 versions']
      },
      discardComments: {
        removeAll: true
      },
      safe: false,
      sourcemap: true,
      zindex: false,
    })
  ]
}
