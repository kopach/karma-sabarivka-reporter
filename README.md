# karma-sabarivka-reporter

> https://github.com/kopach/karma-sabarivka-reporter

- [karma-sabarivka-reporter](#karma-sabarivka-reporter)
  - [Why?](#why)
  - [Usage](#usage)
    - [Install via npm](#install-via-npm)
    - [Update `karma.conf.js`](#update-karmaconfjs)

A Karma plugin. Adds untested files to [istanbul](https://github.com/gotwarlost/istanbul) coverage statistic

## Why?

If your project has singe entrance point for your test files (e.g. `test.(ts|js)` file which gathers all `*.spec.(ts|js))`) - you're probably facing an issue with "fake" test coverage. To have a real picture of test coverage all files with source code should be imported directly into `*.spec.(ts|js))` files. Files with source code, which were not imported in any `*.spec.(ts|js))` files will not be shown in coverage report at all, which creates higher coverage result than it is in reality.

This karma plugin attempts to fix described issue by going through all of the source files and including them explicitly into coverage result.

Plugin works with both: TypeScript (`*.ts`) and JavaScript (`*.js`) files

## Usage

### Install via [npm](https://www.npmjs.com/package/karma-sabarivka-reporter)

``` bash
npm install --save-dev karma-sabarivka-reporter
```

### Update `karma.conf.js`

``` JavaScript
reporters: [
  // ...
  'sabarivka'
  // ...
],
coverageReporter: {
    include: 'src/**/!(*.spec|*.module|environment*).ts',
    exclude: 'src/main.ts',
    // ...
},
```
