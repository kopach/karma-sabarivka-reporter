process.env.CHROME_BIN = require('puppeteer').executablePath();
process.env.NODE_OPTIONS = '--max-old-space-size=4096';

const webpack = require('webpack');

const webpackConfig = {
  mode: 'development',
  module: {
    rules: [
      {
        test: /\.ts$/,
        loader: 'tslint-loader',
        exclude: /node_modules/,
        enforce: 'pre',
      },
      {
        test: /\.ts$/,
        loader: 'ts-loader?silent=true',
        exclude: /node_modules/,
      },
      {
        test: /\.ts$/,
        exclude: /(node_modules|\.spec\.ts$)/,
        loader: 'istanbul-instrumenter-loader',
        enforce: 'post',
        options: {
          esModules: true,
        },
      },
    ],
  },
  plugins: [
    new webpack.SourceMapDevToolPlugin({
      filename: null,
      test: /\.(ts|js)($|\?)/i,
    }),
  ],
  resolve: {
    extensions: ['.ts', '.js'],
  },
};

module.exports = function(config) {
  config.set({
    basePath: './',

    browsers: ['ChromeHeadlessWithoutSandbox'],
    customLaunchers: {
      ChromeHeadlessWithoutSandbox: {
        base: 'ChromeHeadless',
        flags: ['--no-sandbox', '--disable-setuid-sandbox'],
      },
    },
    frameworks: ['mocha'],

    singleRun: true,

    files: ['fixtures/typescript/test/test.spec.ts'],

    preprocessors: {
      'fixtures/typescript/test/test.spec.ts': ['webpack', 'sourcemap'],
    },

    webpack: webpackConfig,

    webpackMiddleware: {
      stats: 'errors-only',
      logLevel: 'silent',
    },
  });
};
