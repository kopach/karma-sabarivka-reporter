<h1 align="center">

[![logo](./assets/logo.png)](#)

[karma-sabarivka-reporter](https://github.com/kopach/karma-sabarivka-reporter)

</h1>

<div align="center">

[![Code coverrage badge](https://codecov.io/gh/kopach/karma-sabarivka-reporter/branch/master/graph/badge.svg)](https://codecov.io/gh/kopach/karma-sabarivka-reporter)
[![Snyk Vulnerabilities badge](https://snyk.io/test/github/kopach/karma-sabarivka-reporter/badge.svg)](https://snyk.io/test/github/kopach/karma-sabarivka-reporter)
[![Maintainability](https://api.codeclimate.com/v1/badges/f7e2f85327eeb6b52439/maintainability)](https://codeclimate.com/github/kopach/karma-sabarivka-reporter/maintainability)
[![Language grade: JavaScript](https://img.shields.io/lgtm/grade/javascript/g/kopach/karma-sabarivka-reporter.svg?logo=lgtm&logoWidth=18)](https://lgtm.com/projects/g/kopach/karma-sabarivka-reporter/context:javascript)

[![NPM badge](https://nodei.co/npm/karma-sabarivka-reporter.png?compact=true)](https://www.npmjs.com/package/karma-sabarivka-reporter)

</div>

⭐️ Please, star me on GitHub — it helps!

[karma-sabarivka-reporter](https://github.com/kopach/karma-sabarivka-reporter) – is a Karma plugin which adds untested files to [istanbul](https://github.com/gotwarlost/istanbul) coverage statistic

<h1 align="center">

![screenshot before](./assets/before.png)

![screenshot after](./assets/after.png)

</h1>

## Table of Contents

- [❓ Why?](#-why-)
- [✨ Features](#-features-)
- [💾 Install](#-install-)
- [👽 API](#-api-)
- [🔨 Usage](#-usage-)
  - [`include` as array of strings](#include-as-array-of-strings-)
  - [`include` as string](#include-as-string-)
  - [karma `plugins` section](#karma-plugins-section-)
- [📄 License](#-license-)

## ❓ Why? [🔝](#table-of-contents)

With `karma`, to test source code – you need to include only `*.spec.(ts|js)` files into test config. Then those spec files will import corresponding source code files. This leads to an issue with "fake" test coverage, as if some source code file would be omitted by all `*.spec.(ts|js))` files – this source code file won't be shown in coverage report at all.

`karma-sabarivka-reporter` plugin fixes described issue by going through all the source files and including them explicitly into coverage result.

Plugin works with both: TypeScript (`*.ts`) and JavaScript (`*.js`) files

## ✨ Features [🔝](#table-of-contents)

- Both [karma-coverage-istanbul-reporter](https://www.npmjs.com/package/karma-coverage-istanbul-reporter) and [karma-coverage](https://www.npmjs.com/package/karma-coverage) supported
- Both JavaScript `*.js` and TypeScript `*.ts` files support
- Multiple patterns
- Negated patterns: ['foo*', '!foobar']

## 💾 Install [🔝](#table-of-contents)

With [npm](https://npmjs.org/) installed, run

```bash
npm install --save-dev karma-sabarivka-reporter
```

## 👽 API [🔝](#table-of-contents)

`@param {string[] | string} coverageReporter.include` - Glob pattern, `string` or `array of strings`. Files which should be included into the coverage result.

## 🔨 Usage [🔝](#table-of-contents)

**Important Note:** if used with [karma-coverage](https://www.npmjs.com/package/karma-coverage), `'sabarivka'` should go before `'coverage'` in `reporters` list

Update `karma.conf.js`

### `include` as array of strings [🔝](#table-of-contents)

```JavaScript
reporters: [
  // ...
  'sabarivka'
  // 'coverage-istanbul' or 'coverage' (reporters order is important for 'coverage' reporter)
  // ...
],
coverageReporter: {
  include: [
      // Specify include pattern(s) first
      'src/**/*.(ts|js)',
      // Then specify "do not include" patterns (note `!` sign on the beginning of each statement)
      '!src/main.(ts|js)',
      '!src/**/*.spec.(ts|js)',
      '!src/**/*.module.(ts|js)',
      '!src/**/environment*.(ts|js)'
  ]
},
```

Same result may be achieved with more complex one line glob pattern

### `include` as string [🔝](#table-of-contents)

```JavaScript
reporters: [
  // ...
  'sabarivka'
  // 'coverage-istanbul' or 'coverage' (reporters order is important for 'coverage' reporter)
  // ...
],
coverageReporter: {
    include: 'src/**/!(*.spec|*.module|environment*|main).(ts|js)',
},
```

### karma `plugins` section [🔝](#table-of-contents)

If your karma config has `plugins` section, add also `karma-sabarivka-reporter` there, otherwise — no action is required.

Karma's documentation:
> By default, Karma loads all sibling NPM modules which have a name starting with karma-\*.\
You can also explicitly list plugins you want to load via the `plugins` configuration setting. The configuration value can either be a string (module name), which will be required by Karma, or an object (inlined plugin).

[See here more info on how karma plugins loading works](https://karma-runner.github.io/4.0/config/plugins.html)

```JavaScript
plugins: [
  // ...
  require('karma-sabarivka-reporter'),
  // ...
],
```

## 📄 License [🔝](#table-of-contents)

This software is licensed under the [MIT](https://github.com/kopach/karma-sabarivka-reporter/blob/master/LICENSE)
