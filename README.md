<div align="center"><pre>
╔═╗╔═╗╔╗ ╔═╗╦═╗╦╦  ╦╦╔═╔═╗
╚═╗╠═╣╠╩╗╠═╣╠╦╝║╚╗╔╝╠╩╗╠═╣
╚═╝╩ ╩╚═╝╩ ╩╩╚═╩ ╚╝ ╩ ╩╩ ╩
</pre></div>

<h1 align="center">
    <a href="https://github.com/kopach/karma-sabarivka-reporter">karma-sabarivka-reporter</a>
</h1>

<div align="center">
    <a href="https://snyk.io/test/github/kopach/karma-sabarivka-reporter">
        <img src="https://camo.githubusercontent.com/f857e5f0ba00648dd89224a8aa91af1f389806bf/68747470733a2f2f736e796b2e696f2f746573742f6769746875622f6b6f706163682f6b61726d612d736162617269766b612d7265706f727465722f62616467652e7376673f74617267657446696c653d7061636b6167652e6a736f6e"
            alt="Known Vulnerabilities"
        />
    </a>
    <a href="https://github.com/kopach/karma-sabarivka-reporter/blob/master/LICENSE">
        <img src="https://camo.githubusercontent.com/b2a47d97326e4ad2ca799414b77ffb57d16ba92a/68747470733a2f2f696d672e736869656c64732e696f2f6769746875622f6c6963656e73652f6b6f706163682f6b61726d612d736162617269766b612d7265706f72746572"
            alt="MIT"
        />
    </a>
    <a href="https://github.com/kopach/karma-sabarivka-reporter">
        <img src="https://camo.githubusercontent.com/034d02a85c11c83e86b36f4af5fb9b2f99eea13a/68747470733a2f2f696d672e736869656c64732e696f2f6769746875622f6c616e6775616765732f636f64652d73697a652f6b6f706163682f6b61726d612d736162617269766b612d7265706f72746572"
            alt="GitHub code size in bytes"
        />
    </a>
</div>

## Table of Contents

- [Support](#support)
- [Why?](#why)
- [Features](#features)
- [Install](#install)
- [API](#api)
- [Usage](#usage)
  - [`include` as array of strings](#include-as-array-of-strings)
  - [`include` as string](#include-as-string)
- [License](#license)

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
- Negated patterns: ['foo*', '!foobar']

## Install

With [npm](https://npmjs.org/) installed, run

```bash
npm install --save-dev karma-sabarivka-reporter
```

## API

`@param {string[] | string} coverageReporter.include` - Glob pattern, `string` or `array of strings`. Files which should be included into the coverage result.

## Usage

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

## License

[MIT](https://github.com/kopach/karma-sabarivka-reporter/blob/master/LICENSE)
