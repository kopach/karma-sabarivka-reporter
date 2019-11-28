# karma-sabarivka-reporter

[![Known Vulnerabilities](https://snyk.io/test/github/kopach/karma-sabarivka-reporter/badge.svg?targetFile=package.json)](https://snyk.io/test/github/kopach/karma-sabarivka-reporter?targetFile=package.json)
[![GitHub](https://img.shields.io/github/license/kopach/karma-sabarivka-reporter)](https://github.com/kopach/karma-sabarivka-reporter/blob/master/LICENSE)
[![GitHub code size in bytes](https://img.shields.io/github/languages/code-size/kopach/karma-sabarivka-reporter)](https://github.com/kopach/karma-sabarivka-reporter)

> [https://github.com/kopach/karma-sabarivka-reporter](https://github.com/kopach/karma-sabarivka-reporter)

- [karma-sabarivka-reporter](#karma-sabarivka-reporter)
  - [Support](#support)
  - [Why?](#why)
  - [Features](#features)
  - [Usage](#usage)
    - [Install via npm](#install-via-npm)
    - [Update `karma.conf.js`](#update-karmaconfjs)
      - [Basic syntax](#basic-syntax)
      - [Example](#example)

A Karma plugin. Adds untested files to [istanbul](https://github.com/gotwarlost/istanbul) coverage statistic

## Support

Do you like this project? Please, star it on GitHub :sparkles:.

[![GitHub stars](https://img.shields.io/github/stars/kopach/karma-sabarivka-reporter)](https://github.com/kopach/karma-sabarivka-reporter/stargazers)

## Why?

If your project has single entry point for your test files (e.g. `test.(ts|js)` file which gathers all `*.spec.(ts|js))`) - you're probably facing an issue with "fake" test coverage. To have a real picture of test coverage all files with source code should be imported directly into `*.spec.(ts|js))` files. Files with source code, which were not imported in any `*.spec.(ts|js))` files will not be shown in coverage report at all, which creates higher coverage result than it is in reality.

This karma plugin attempts to fix described issue by going through all of the source files and including them explicitly into coverage result.

Plugin works with both: TypeScript (`*.ts`) and JavaScript (`*.js`) files

## Features

- Both JavaScript `*.js` and TypeScript `*.js` files support
- Multiple patterns
- Exclude patterns: ['foo*', '!foobar']

## Usage

### Install via [npm](https://www.npmjs.com/package/karma-sabarivka-reporter)

``` bash
npm install --save-dev karma-sabarivka-reporter
```

### Update `karma.conf.js`

#### Basic syntax

`@param {string[] | string} [coverageReporter.include]` - Glob pattern string or array of strings. Files which should be included into the coverage result.

`@param {string[] | string} [coverageReporter.exclude]` - Glob pattern string or array of strings. Files which should be excluded from the coverage result.

#### Example

``` JavaScript
reporters: [
  // ...
  'sabarivka'
  // ...
],
coverageReporter: {
  include: 'src/**/*.(ts|js)',
  exclude: [
    'src/main.(ts|js)',
    'src/**/*.spec.(ts|js)',
    'src/**/*.module.(ts|js)',
    'src/**/environment*.(ts|js)'
  ]
},
```
