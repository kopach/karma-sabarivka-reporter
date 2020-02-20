<div align="center"><pre>
╔═╗╔═╗╔╗ ╔═╗╦═╗╦╦  ╦╦╔═╔═╗
╚═╗╠═╣╠╩╗╠═╣╠╦╝║╚╗╔╝╠╩╗╠═╣
╚═╝╩ ╩╚═╝╩ ╩╩╚═╩ ╚╝ ╩ ╩╩ ╩
</pre></div>

<h1 align="center">

[karma-sabarivka-reporter](https://github.com/kopach/karma-sabarivka-reporter)

</h1>

<div align="center">

[![Greenkeeper badge](https://badges.greenkeeper.io/kopach/karma-sabarivka-reporter.svg)](https://greenkeeper.io/)
[![Travis CI badge](https://travis-ci.com/kopach/karma-sabarivka-reporter.svg?branch=master)](https://travis-ci.com/kopach/karma-sabarivka-reporter/branches)
[![Snyk Vulnerabilities badge](https://snyk.io/test/github/kopach/karma-sabarivka-reporter/badge.svg)](https://snyk.io/test/github/kopach/karma-sabarivka-reporter)

</div>

⭐️ Please, star me on GitHub — it helps!

[karma-sabarivka-reporter](https://github.com/kopach/karma-sabarivka-reporter) – is a Karma plugin which adds untested files to [istanbul](https://github.com/gotwarlost/istanbul) coverage statistic

![screenshot before](./assets/before.png)

![screenshot after](./assets/after.png)

## 🧬 Table of Contents

- [Why?](#-why)
- [Features](#-features)
- [Install](#-install)
- [API](#-api)
- [Usage](#-usage)
- [License](#-license)

## ❓ Why?

If your project has single entry point for your test files (e.g. `test.(ts|js)` file which gathers all `*.spec.(ts|js))`) - you're probably facing an issue with "fake" test coverage. To have a real picture of test coverage all files with source code should be imported directly into `*.spec.(ts|js))` files. Files with source code, which were not imported in any `*.spec.(ts|js))` files will not be shown in coverage report at all, which creates higher coverage result than it is in reality.

This plugin will be at least useful for all Angular 2-8 projects generated using angular-cli.

This karma plugin attempts to fix described issue by going through all of the source files and including them explicitly into coverage result.

Plugin works with both: TypeScript (`*.ts`) and JavaScript (`*.js`) files

## ✨ Features

- Both JavaScript `*.js` and TypeScript `*.js` files support
- Multiple patterns
- Negated patterns: ['foo*', '!foobar']

## 💾 Install

With [npm](https://npmjs.org/) installed, run

```bash
npm install --save-dev karma-sabarivka-reporter
```

## 👽 API

`@param {string[] | string} coverageReporter.include` - Glob pattern, `string` or `array of strings`. Files which should be included into the coverage result.

## 🔨 Usage

Update `karma.conf.js`

### `include` as array of strings

```JavaScript
reporters: [
  // ...
  'sabarivka'
  // ...
],
coverageReporter: {
  include: [
      // Specify include pattern(s) first
      'src/**/*.(ts|js)',
      // Then specify "do not include" patterns (note `!` sign on the beggining of each statement)
      '!src/main.(ts|js)',
      '!src/**/*.spec.(ts|js)',
      '!src/**/*.module.(ts|js)',
      '!src/**/environment*.(ts|js)'
  ]
},
```

Same result may be achieved with more complex one line glob pattern

### `include` as string

```JavaScript
reporters: [
  // ...
  'sabarivka'
  // ...
],
coverageReporter: {
    include: 'src/**/!(*.spec|*.module|environment*|main).(ts|js)',
},
```

## 📄 License

This software is licensed under the [MIT](https://github.com/kopach/karma-sabarivka-reporter/blob/master/LICENSE)
