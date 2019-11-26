# karma-sabarivka-reporter

> [https://github.com/kopach/karma-sabarivka-reporter](https://github.com/kopach/karma-sabarivka-reporter)

- [karma-sabarivka-reporter](#karma-sabarivka-reporter)
  - [Why?](#why)
  - [Features](#features)
  - [Usage](#usage)
    - [Install via npm](#install-via-npm)
    - [Update `karma.conf.js`](#update-karmaconfjs)
      - [Basic syntax](#basic-syntax)
      - [Example](#example)

A Karma plugin. Adds untested files to [istanbul](https://github.com/gotwarlost/istanbul) coverage statistic

## Why?

If your project has single entry point for your test files (e.g. `test.(ts|js)` file which gathers all `*.spec.(ts|js))`) - you probably facing an issue, that if files with source code aren't imported directly in one of `*.spec.(ts|js))` files - such a file doesn't shows up in coverate report at all, which creates higher coverate result then they are in reality.

This karma plugin tries to fix this issue by going through all source files and including them explicitly to coverage result.

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
