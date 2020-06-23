/* tslint:disable */
import { readFileSync } from 'fs';
import { join } from 'path';
import { expect } from 'chai';
import { Server } from 'karma';
import * as rimraf from 'rimraf';
import * as karmaSabarivkaReporter from '../src';
import { generate } from 'shortid';

const OUTPUT_PATH = join(__dirname, 'fixtures', 'outputs');

describe('karma-sabarivka-reporter:', () => {
  beforeEach(done => {
    rimraf(OUTPUT_PATH, done);
  });

  it(`should log warning message if non of required reporters are listed in "reporters" list`, done => {
    // given
    const KarmaCLIOutputFile = join(
      OUTPUT_PATH,
      `karma-output${generate()}.log`
    );
    const server = createServer(
      { reporters: ['sabarivka'] },
      KarmaCLIOutputFile
    );

    // when
    const karmaStart = (server.start() as unknown) as Promise<void>;

    checkKarmaSuccessOutput(server, karmaStart, () => {
      const CLI_output = readFileSync(KarmaCLIOutputFile).toString();
      expect(CLI_output).to.contain(
        '[WARN] [karma-sabarivka-reporter] - Neither "coverage-istanbul" nor "coverage" reporter is listed under karma "reporters" config section. No coverage report is being created'
      );
      done();
    });
  });

  ['coverage', 'coverage-istanbul'].forEach(coverageReporter => {
    describe(`Configured with "${coverageReporter}" reporter:`, () => {
      it('should not have untested files included in coverage raport if karma-sabarivka-reporter disabled', done => {
        // given
        const coverageReportDir = join(OUTPUT_PATH, `coverage${generate()}`);
        const server = createServer(
          {
            reporters: [coverageReporter],
            coverageIstanbulReporter: {
              reports: ['json-summary'],
              dir: coverageReportDir,
            },
            coverageReporter: {
              type: 'json-summary',
              dir: coverageReportDir,
              subdir: '.',
            },
          },
          undefined,
          false
        );

        // when
        const karmaStart = (server.start() as unknown) as Promise<void>;

        // then
        checkKarmaSuccessOutput(server, karmaStart, () => {
          const coverageSummary = JSON.stringify(
            readFileSync(
              `${coverageReportDir}/coverage-summary.json`
            ).toString()
          );

          expect(coverageSummary).to.not.contain('ignored-file.ts');
          expect(coverageSummary).to.contain('example.ts');
          expect(coverageSummary).to.contain('another-file.ts');

          done();
        });
      });

      describe('Correct config:', () => {
        [
          {
            name: 'untested files are blacklisted from include pattern',
            config: {
              coverageReporter: {
                include: ['test/**/example.ts', '!test/**/ignored-file.ts'],
              },
            },
          },
          {
            name: 'untested files are not covered by include array pattern',
            config: {
              coverageReporter: {
                include: ['test/**/example.ts'],
              },
            },
          },
          {
            name: 'untested files are not covered by include string pattern',
            config: {
              coverageReporter: {
                include: 'test/**/example.ts',
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
            const coverageReportDir = join(
              OUTPUT_PATH,
              `coverage${generate()}`
            );
            const server = createServer(
              {
                reporters: [coverageReporter, 'sabarivka'],
                coverageIstanbulReporter: {
                  reports: ['json-summary'],
                  dir: coverageReportDir,
                },
                coverageReporter: {
                  ...config.coverageReporter,
                  type: 'json-summary',
                  dir: coverageReportDir,
                  subdir: '.',
                },
              },
              undefined,
              true
            );

            // when
            const karmaStart = (server.start() as unknown) as Promise<void>;

            // then
            checkKarmaSuccessOutput(server, karmaStart, () => {
              const coverageSummary = JSON.stringify(
                readFileSync(
                  `${coverageReportDir}/coverage-summary.json`
                ).toString()
              );
              expect(coverageSummary).to.not.contain('ignored-file.ts');
              expect(coverageSummary).to.contain('example.ts');
              expect(coverageSummary).to.contain('another-file.ts');

              done();
            });
          });
        });

        [
          {
            name: 'untested files are covered by include array pattern',
            config: {
              coverageReporter: {
                include: ['test/**/example.ts', 'test/**/ignored-file.ts'],
              },
            },
          },
          {
            name: 'untested files are covered by include string pattern',
            config: {
              coverageReporter: {
                include: 'test/**/ignored-file.ts',
              },
            },
          },
        ].forEach(({ name, config }) => {
          it(`should have untested files included in coverage raport if: ${name}`, done => {
            // given
            const coverageReportDir = join(
              OUTPUT_PATH,
              `coverage${generate()}`
            );
            const server = createServer(
              {
                reporters: ['sabarivka', coverageReporter],
                coverageIstanbulReporter: {
                  reports: ['json-summary'],
                  dir: coverageReportDir,
                },
                coverageReporter: {
                  ...config.coverageReporter,
                  type: 'json-summary',
                  dir: coverageReportDir,
                  subdir: '.',
                },
              },
              undefined,
              true
            );

            // when
            const karmaStart = (server.start() as unknown) as Promise<void>;

            // then
            checkKarmaSuccessOutput(server, karmaStart, () => {
              const coverageSummary = JSON.stringify(
                readFileSync(
                  `${coverageReportDir}/coverage-summary.json`
                ).toString()
              );

              expect(coverageSummary).to.contain('ignored-file.ts');
              expect(coverageSummary).to.contain('example.ts');
              expect(coverageSummary).to.contain('another-file.ts');

              done();
            });
          });
        });
      });

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
            const server = createServer(
              {
                reporters: ['sabarivka', coverageReporter],
                ...config,
              },
              KarmaCLIOutputFile
            );
            const schema = JSON.stringify(
              require('../dist/public_api.schema.json'),
              null,
              2
            );

            // when
            const karmaStart = (server.start() as unknown) as Promise<void>;

            // then
            checkKarmaErrorOutput(server, karmaStart, () => {
              const CLI_output = readFileSync(KarmaCLIOutputFile).toString();
              expect(CLI_output).to.contain(
                `Not valid karma-sabarivka-reporter-confiig\nvalid schema is: \n${schema}`
              );
              done();
            });
          });
        });
      });
    });
  });

  describe('Reporters order:', () => {
    describe('karma-coverage', () => {
      it(`should work with "sabarivka" registered first`, done => {
        // given
        const coverageReportDir = join(OUTPUT_PATH, `coverage${generate()}`);
        const server = createServer(
          {
            reporters: ['sabarivka', 'coverage'],
            coverageIstanbulReporter: {
              reports: ['json-summary'],
              dir: coverageReportDir,
            },
            coverageReporter: {
              include: 'test/**/ignored-file.ts',
              type: 'json-summary',
              dir: coverageReportDir,
              subdir: '.',
            },
          },
          undefined,
          true
        );

        // when
        const karmaStart = (server.start() as unknown) as Promise<void>;

        // then
        checkKarmaSuccessOutput(server, karmaStart, () => {
          const coverageSummary = JSON.stringify(
            readFileSync(
              `${coverageReportDir}/coverage-summary.json`
            ).toString()
          );

          expect(coverageSummary).to.contain('ignored-file.ts');
          expect(coverageSummary).to.contain('example.ts');
          expect(coverageSummary).to.contain('another-file.ts');

          done();
        });
      });

      it(`should not work with "sabarivka" registered last`, done => {
        // given
        const coverageReportDir = join(OUTPUT_PATH, `coverage${generate()}`);
        const server = createServer(
          {
            reporters: ['coverage', 'sabarivka'],
            coverageIstanbulReporter: {
              reports: ['json-summary'],
              dir: coverageReportDir,
            },
            coverageReporter: {
              include: 'test/**/ignored-file.ts',
              type: 'json-summary',
              dir: coverageReportDir,
              subdir: '.',
            },
          },
          undefined,
          true
        );

        // when
        const karmaStart = (server.start() as unknown) as Promise<void>;

        // then
        checkKarmaSuccessOutput(server, karmaStart, () => {
          const coverageSummary = JSON.stringify(
            readFileSync(
              `${coverageReportDir}/coverage-summary.json`
            ).toString()
          );

          expect(coverageSummary).not.to.contain('ignored-file.ts');
          expect(coverageSummary).to.contain('example.ts');
          expect(coverageSummary).to.contain('another-file.ts');

          done();
        });
      });

      it(`should log warning message if karma-sabarivka registered last`, done => {
        // given
        const KarmaCLIOutputFile = join(
          OUTPUT_PATH,
          `karma-output${generate()}.log`
        );
        const server = createServer(
          { reporters: ['coverage', 'sabarivka'] },
          KarmaCLIOutputFile
        );

        // when
        const karmaStart = (server.start() as unknown) as Promise<void>;

        checkKarmaSuccessOutput(server, karmaStart, () => {
          const CLI_output = readFileSync(KarmaCLIOutputFile).toString();
          expect(CLI_output).to.contain(
            '[WARN] [karma-sabarivka-reporter] - "sabarivka" should go before "coverage" in "reporters" list'
          );
          done();
        });
      });
    });

    describe('karma-coverage-istanbul-reporter', () => {
      it(`should work with "sabarivka" registered first`, done => {
        // given
        const coverageReportDir = join(OUTPUT_PATH, `coverage${generate()}`);
        const server = createServer(
          {
            reporters: ['sabarivka', 'coverage-istanbul'],
            coverageIstanbulReporter: {
              reports: ['json-summary'],
              dir: coverageReportDir,
            },
            coverageReporter: {
              include: 'test/**/ignored-file.ts',
              type: 'json-summary',
              dir: coverageReportDir,
              subdir: '.',
            },
          },
          undefined,
          true
        );

        // when
        const karmaStart = (server.start() as unknown) as Promise<void>;

        // then
        checkKarmaSuccessOutput(server, karmaStart, () => {
          const coverageSummary = JSON.stringify(
            readFileSync(
              `${coverageReportDir}/coverage-summary.json`
            ).toString()
          );

          expect(coverageSummary).to.contain('ignored-file.ts');
          expect(coverageSummary).to.contain('example.ts');
          expect(coverageSummary).to.contain('another-file.ts');

          done();
        });
      });

      it(`should work with "sabarivka" registered last`, done => {
        // given
        const coverageReportDir = join(OUTPUT_PATH, `coverage${generate()}`);
        const server = createServer(
          {
            reporters: ['coverage-istanbul', 'sabarivka'],
            coverageIstanbulReporter: {
              reports: ['json-summary'],
              dir: coverageReportDir,
            },
            coverageReporter: {
              include: 'test/**/ignored-file.ts',
              type: 'json-summary',
              dir: coverageReportDir,
              subdir: '.',
            },
          },
          undefined,
          true
        );

        // when
        const karmaStart = (server.start() as unknown) as Promise<void>;

        // then
        checkKarmaSuccessOutput(server, karmaStart, () => {
          const coverageSummary = JSON.stringify(
            readFileSync(
              `${coverageReportDir}/coverage-summary.json`
            ).toString()
          );

          expect(coverageSummary).to.contain('ignored-file.ts');
          expect(coverageSummary).to.contain('example.ts');
          expect(coverageSummary).to.contain('another-file.ts');

          done();
        });
      });
    });
  });
});

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
        'karma-coverage',
        ...(isSabarivkaReporterEnabled ? [karmaSabarivkaReporter] : []),
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
    () => {}
  );
}

function checkKarmaSuccessOutput(
  karmaServer: Server,
  karmaStart: Promise<void>,
  checkOutput: () => void
) {
  const karmaServerWithStop = (karmaServer as unknown) as {
    stop: () => Promise<void>;
  };

  if (typeof karmaServerWithStop.stop === 'function') {
    karmaStart.then(() =>
      karmaServer.on('run_complete', () => {
        karmaServerWithStop.stop().then(() => {
          checkOutput();
        });
      })
    );
  }
}

function checkKarmaErrorOutput(
  karmaServer: Server,
  karmaStart: Promise<void>,
  checkOutput: () => void
) {
  const karmaServerWithStop = (karmaServer as unknown) as {
    stop: () => Promise<void>;
  };

  if (typeof karmaServerWithStop.stop === 'function') {
    karmaStart.then(() =>
      karmaServerWithStop.stop().then(() => {
        setTimeout(checkOutput, 50);
      })
    );
  }
}
