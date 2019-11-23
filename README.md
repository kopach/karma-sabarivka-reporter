# karma-sabarivka-reporter

- [karma-sabarivka-reporter](#karma-sabarivka-reporter)
  - [Why?](#why)
  - [Usage](#usage)

A Karma plugin. Adds untested files to [istanbul](https://github.com/gotwarlost/istanbul) coverage statistic

## Why?

If your project has singe entracne point for your test files (e.g. `test.(ts|js)` file which gathers all `*.spec.(ts|js))`) - you probably facing an issue, that if files with source code aren't imported directly in one of `*.spec.(ts|js))` files - such a file doesn't shows up in coverate report at all, which creates higher coverate result then they are in reality.

This karma plugin tries to fix this issue by going through all source files and including them explicitly to coverage result.

Plugin works with both: TypeScript (`*.ts`) and JavaScript (`*.js`) files

## Usage

`karma.conf.js`

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
