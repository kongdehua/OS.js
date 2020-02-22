const path = require('path');

const mode = process.env.NODE_ENV || 'development';
const minimize = mode === 'production';
const plugins = [];
const webpack = require('webpack');

if (mode === 'production') {
  plugins.push(new OptimizeCSSAssetsPlugin({
    cssProcessorOptions: {
      discardComments: true
    },
  }));
}

module.exports = {
  mode,
  target: 'node',
  devtool: 'source-map',
  entry: {
    server: path.resolve(__dirname, './src/server/index.ts'),
  },
  output: {
    libraryTarget: 'umd',
    library: 'root',
    umdNamedDefine: true,
    sourceMapFilename: 'server.map',
    filename: 'server.js'
  },
  resolve: {
    extensions: ['.ts']
  },
  node: {
    console: true,
    global: true,
    process: true,
    Buffer: true,
    __filename: true,
    __dirname: true,
    setImmediate: true

  },
  optimization: {
    minimize,
  },
  plugins: [
    new webpack.DefinePlugin({ "global.GENTLY": false }),
    ...plugins
  ],
  module: {
    rules: [
      {
        test: /\.(svg|png|jpe?g|gif|webp)$/,
        exclude: /(node_modules|bower_components)/,
        use: [
          {
            loader: 'file-loader'
          }
        ]
      },
      {
        test: /\.ts$/,
        exclude: /(node_modules|bower_components)/,
        use:[
          {
            loader: 'ts-loader',
            options: {
              transpileOnly: true,
              appendTsxSuffixTo: [/\.vue$/],
              configFile: path.resolve(__dirname, "./tsconfig-server.json")
            }
          }
        ]       
      }
    ]
  }
};

