/* tslint:disable */
import { readFileSync } from 'fs';
import { join } from 'path';
import { expect } from 'chai';
import { Server } from 'karma';
import * as rimraf from 'rimraf';
import * as karmaSabarivkaReporter from '../src';
import { generate } from 'shortid';

const OUTPUT_PATH = join(__dirname, 'fixtures', 'outputs');

function createServer(
  config = {},
  cliOutputFilename = 'karma-output.log',
  isSabarivkaReporterEnabled = true
) {
  const configFile = join(__dirname, '/karma.conf.js');

  return new Server(
    {
      configFile, // NOTE: there should be config file in filesystem for Karma Server to work
      plugins: [
        'karma-mocha',
        'karma-chrome-launcher',
        'karma-webpack',
        'karma-sourcemap-loader',
        'karma-coverage-istanbul-reporter',
        ...(isSabarivkaReporterEnabled ? [karmaSabarivkaReporter] : []),
      ],
      reporters: [
        'coverage-istanbul',
        ...(isSabarivkaReporterEnabled ? ['sabarivka'] : []),
      ],
      ...(isSabarivkaReporterEnabled
        ? {
            loggers: [
              {
                type: 'file',
                filename: cliOutputFilename,
              },
            ],
          }
        : {}),
      ...config,
    },
    () => {} // DO NOT REMOVE: won't work without this empty callback.
  );
}

describe('karma-sabarivka-reporter', () => {
  afterEach(done => {
    rimraf(OUTPUT_PATH, done);
  });

  it('should not have untested files included in coverage raport if karma-sabarivka-reporter disabled', done => {
    // given
    const coverageReportDir = join(OUTPUT_PATH, `coverage${generate()}`);
    const server = createServer(
      {
        coverageIstanbulReporter: {
          fixWebpackSourcePaths: true,
          reports: ['json-summary'],
          dir: coverageReportDir,
        },
      },
      undefined,
      false
    );
    function checkOutput() {
      const coverageSummary = JSON.stringify(
        readFileSync(`${coverageReportDir}/coverage-summary.json`).toString()
      );
      expect(coverageSummary).to.not.contain('ignored-file.ts');
      expect(coverageSummary).to.contain('example.ts');
      expect(coverageSummary).to.contain('another-file.ts');

      done();
    }

    // when
    ((server.start() as unknown) as Promise<void>).then(() => {
      // then
      server.on('run_complete', () => {
        checkOutput();
      });
    });
  });

  describe('Correct config:', () => {
    [
      {
        name: 'untested files are blacklisted from include pattern',
        config: {
          coverageReporter: {
            include: ['**/**/example.ts', '!**/**/ignored-file.ts'],
          },
        },
      },
      {
        name: 'untested files are not covered by include array pattern',
        config: {
          coverageReporter: {
            include: ['**/**/example.ts'],
          },
        },
      },
      {
        name: 'untested files are not covered by include string pattern',
        config: {
          coverageReporter: {
            include: '**/**/example.ts',
          },
        },
      },
      {
        name: 'include pattern is empty string',
        config: {
          coverageReporter: {
            include: '',
          },
        },
      },
      {
        name: 'include pattern is empty array',
        config: {
          coverageReporter: {
            include: [],
          },
        },
      },
    ].forEach(({ name, config }) => {
      it(`should not have untested files included in coverage raport if: ${name}`, done => {
        // given
        const coverageReportDir = join(OUTPUT_PATH, `coverage${generate()}`);
        const server = createServer(
          {
            ...config,
            coverageIstanbulReporter: {
              fixWebpackSourcePaths: true,
              reports: ['json-summary'],
              dir: coverageReportDir,
            },
          },
          undefined,
          true
        );
        function checkOutput() {
          const coverageSummary = JSON.stringify(
            readFileSync(
              `${coverageReportDir}/coverage-summary.json`
            ).toString()
          );
          expect(coverageSummary).to.not.contain('ignored-file.ts');
          expect(coverageSummary).to.contain('example.ts');
          expect(coverageSummary).to.contain('another-file.ts');

          done();
        }

        // when
        ((server.start() as unknown) as Promise<void>).then(() => {
          // then
          server.on('run_complete', () => {
            checkOutput();
          });
        });
      });
    });

    [
      {
        name: 'untested files are covered by include array pattern',
        config: {
          coverageReporter: {
            include: ['**/**/example.ts', '**/**/ignored-file.ts'],
          },
        },
      },
      {
        name: 'untested files are covered by include string pattern',
        config: {
          coverageReporter: {
            include: '**/**/ignored-file.ts',
          },
        },
      },
    ].forEach(({ name, config }) => {
      it(`should have untested files included in coverage raport if: ${name}`, done => {
        // given
        const coverageReportDir = join(OUTPUT_PATH, `coverage${generate()}`);
        const server = createServer(
          {
            ...config,
            coverageIstanbulReporter: {
              fixWebpackSourcePaths: true,
              reports: ['json-summary'],
              dir: coverageReportDir,
            },
          },
          undefined,
          true
        );
        function checkOutput() {
          const coverageSummary = JSON.stringify(
            readFileSync(
              `${coverageReportDir}/coverage-summary.json`
            ).toString()
          );
          expect(coverageSummary).to.contain('ignored-file.ts');
          expect(coverageSummary).to.contain('example.ts');
          expect(coverageSummary).to.contain('another-file.ts');

          done();
        }

        // when
        ((server.start() as unknown) as Promise<void>).then(() => {
          // then
          server.on('run_complete', () => {
            checkOutput();
          });
        });
      });
    });
  });

  // WORKAROUND: This test suite should go after in the end as oterwise tests aren't working
  describe('Incorrect config:', () => {
    [
      {
        name: 'root config object is null',
        config: { coverageReporter: null },
      },
      {
        name: 'config property is null',
        config: { coverageReporter: { include: null } },
      },
      {
        name: 'config property wit incorect type T',
        config: { coverageReporter: { include: 2 } },
      },
      {
        name: 'config property wit incorect type T[]',
        config: { coverageReporter: { include: [2] } },
      },
    ].forEach(({ name, config }) => {
      it(`should throw error with config schema if incorrect config being set: ${name}`, done => {
        // given
        const KarmaCLIOutputFile = join(
          OUTPUT_PATH,
          `karma-output${generate()}.log`
        );
        const server = createServer(config, KarmaCLIOutputFile);
        const schema = JSON.stringify(
          require('../dist/public_api.schema.json'),
          null,
          2
        );

        function checkOutput() {
          const CLI_output = readFileSync(KarmaCLIOutputFile).toString();
          setTimeout(() => {
            expect(CLI_output).to.contain(
              `Not valid karma-sabarivka-reporter-confiig\nvalid schema is: \n${schema}`
            );
            done();
          }, 300);
        }

        // when
        ((server.start() as unknown) as Promise<void>).then(() => {
          // then
          checkOutput();
        });
      });
    });
  });
});
