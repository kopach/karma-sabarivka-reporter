/* tslint:disable */

const fs = require('fs');
const path = require('path');
const { expect } = require('chai');
const karma = require('karma');
const rimraf = require('rimraf');
const karmaSabarivkaReporter = require('../dist');
const shortid = require('shortid');
const util = require('util');

const OUTPUT_PATH = path.join(__dirname, 'fixtures', 'outputs');
const readFileAsync = util.promisify(fs.readFile);
const fileReadTimeout = 300; // Hacky workaround to make sure the output file has been written

function createServer(
  config = {},
  cliOutputFilename = 'karma-output.log',
  isSabarivkaReporterEnabled = true
) {
  const configFile = path.join(__dirname, '/karma.conf.js');

  return new karma.Server(
    Object.assign(
      {
        configFile, // TODO: make import instead of file path
        plugins: [
          'karma-mocha',
          'karma-chrome-launcher',
          'karma-phantomjs-launcher',
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
      },
      config
    ),
    () => {} // DO NOT REMOVE: won't work without this empty callback. TODO: investigate this
  );
}

describe('karma-sabarivka-reporter', () => {
  afterEach((done) => {
    rimraf(OUTPUT_PATH, done);
  });

  describe.only('incorrect config', () => {
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
        console.log('start1');
        // given
        const KarmaCLIOutputFile = path.join(
          __dirname,
          'fixtures',
          'outputs',
          `karma-output${shortid.generate()}.log`
        );
        const server = createServer(config, KarmaCLIOutputFile);
        const schema = JSON.stringify(
          require('../dist/public_api.schema.json'),
          null,
          2
        );
        function checkOutput() {
          const CLI_output = fs.readFileSync(KarmaCLIOutputFile).toString();
          expect(CLI_output).to.contain(
            `Not valid karma-sabarivka-reporter-confiig\nvalid schema is: \n${schema}`
          );
          done();
        }

        // when
        server.start();

        // then
        setTimeout(checkOutput, fileReadTimeout);
        console.log('stop1');
      });
    });
  });

  describe.only('correct config', () => {
    it('should not throw error if correct config being set', done => {
      console.log('start');
      // TODO: remove this
      // given
      const KarmaCLIOutputFile = path.join(
        __dirname,
        'fixtures',
        'outputs',
        `karma-output${shortid.generate()}.log`
      );
      const server = createServer(
        { coverageReporter: { include: '' } },
        KarmaCLIOutputFile
      );
      function checkOutput() {
        const CLI_output = fs.readFileSync(KarmaCLIOutputFile).toString();
        expect(CLI_output).not.to.contain(
          'Not valid karma-sabarivka-reporter-confiig'
        );
        done();
      }

      // when
      server.start();

      // then

      server.on('run_complete', () => {
        setTimeout(checkOutput, fileReadTimeout);
      });
      console.log('stop');
    });

    it('should not have untested files included in coverage raport if karma-sabarivka-reporter disabled', done => {
      console.log('start');
      // given
      const server = createServer(undefined, undefined, false);
      function checkOutput() {
        const coverageSummary = JSON.stringify(
          JSON.parse(fs.readFileSync(`${OUTPUT_PATH}/coverage-summary.json`))
        );
        expect(coverageSummary).to.not.contain('ignored-file.ts');
        expect(coverageSummary).to.contain('example.ts');
        expect(coverageSummary).to.contain('another-file.ts');

        done();
      }

      // when
      server.start();

      // then
      server.on('run_complete', () => {
        setTimeout(checkOutput, fileReadTimeout);
      });
      console.log('stop');
    });

    it('should not have untested files included in coverage raport if they are not covered by include pattern', done => {
      console.log('start');
      // given
      const server = createServer(
        { coverageReporter: { include: '**/**/example.ts' } },
        undefined,
        true
      );
      function checkOutput() {
        const coverageSummary = JSON.stringify(
          JSON.parse(fs.readFileSync(`${OUTPUT_PATH}/coverage-summary.json`))
        );
        expect(coverageSummary).to.not.contain('ignored-file.ts');
        expect(coverageSummary).to.contain('example.ts');
        expect(coverageSummary).to.contain('another-file.ts');

        done();
      }

      // when
      server.start();

      // then
      server.on('run_complete', () => {
        setTimeout(checkOutput, fileReadTimeout);
      });
      console.log('stop');
    });

    it('should not have untested files included in coverage raport if they are not covered by include array pattern', done => {
      console.log('start');
      // given
      const server = createServer(
        { coverageReporter: { include: ['**/**/example.ts'] } },
        undefined,
        true
      );
      function checkOutput() {
        const coverageSummary = JSON.stringify(
          JSON.parse(fs.readFileSync(`${OUTPUT_PATH}/coverage-summary.json`))
        );
        expect(coverageSummary).to.not.contain('ignored-file.ts');
        expect(coverageSummary).to.contain('example.ts');
        expect(coverageSummary).to.contain('another-file.ts');

        done();
      }

      // when
      server.start();

      // then
      server.on('run_complete', () => {
        setTimeout(checkOutput, fileReadTimeout);
      });
      console.log('stop');
    });

    it('should not have untested files included in coverage raport if they are blacklisted from include pattern', done => {
      console.log('start');
      // given
      const server = createServer(
        {
          coverageReporter: {
            include: ['**/**/example.ts', '!**/**/ignored-file.ts'],
          },
        },
        undefined,
        true
      );
      function checkOutput() {
        const coverageSummary = JSON.stringify(
          JSON.parse(fs.readFileSync(`${OUTPUT_PATH}/coverage-summary.json`))
        );
        expect(coverageSummary).to.not.contain('ignored-file.ts');
        expect(coverageSummary).to.contain('example.ts');
        expect(coverageSummary).to.contain('another-file.ts');

        done();
      }

      // when
      server.start();

      // then
      server.on('run_complete', () => {
        setTimeout(checkOutput, fileReadTimeout);
      });
      console.log('stop');
    });
  });
});
