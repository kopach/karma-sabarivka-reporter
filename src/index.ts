import * as fs from 'fs';
import { sync } from 'globby';
import { createInstrumenter, Instrumenter } from 'istanbul-lib-instrument';
import * as path from 'path';
import { ModuleKind, transpileModule, TranspileOutput } from 'typescript';
import {
  CoverageData,
  InstrumenterFnArgs,
  isSabarivkaReporterConfig,
  KarmaReprter,
  PublicAPI,
} from './model';

const instrumenter: Instrumenter = createInstrumenter({
  esModules: true,
});

const sabarivkaReporter: KarmaReprter = Object.defineProperty(
  function(
    this: { onBrowserComplete: (...args: InstrumenterFnArgs) => void },
    coverageReporterConfig: PublicAPI
  ): void {
    if (!isSabarivkaReporterConfig(coverageReporterConfig)) {
      const schema: string = JSON.stringify(
        require('../dist/public_api.schema.json'), // TODO: fix this
        null,
        2
      );

      throw new Error(
        `Not valid karma-sabarivka-reporter-confiig\nvalid schema is: \n${schema}`
      );
    }

    this.onBrowserComplete = getFileIntrumenterFn(coverageReporterConfig);
  },
  '$inject',
  {
    value: ['config'],
  }
);

function getFileIntrumenterFn(
  coverageReporterConfig: PublicAPI
): (...args: InstrumenterFnArgs) => void {
  return (...[, { coverage }]: InstrumenterFnArgs): void => {
    const filesToCover: string[] = getListOfFilesToCover(
      coverageReporterConfig
    );

    instrumentFilesWithCoverage(filesToCover, coverage);
  };
}

function instrumentFilesWithCoverage(
  filesToCover: string[],
  coverage: CoverageData
): void {
  filesToCover.forEach((filePath: string): void => {
    const fullFilePath: string = path.resolve(process.cwd(), filePath);

    if (!coverage[fullFilePath]) {
      const fileContent: TranspileOutput = getFileTranspilledToJs(fullFilePath);

      instrumentFile(fileContent, fullFilePath, coverage);
    }
  });
}

function instrumentFile(
  jsResult: TranspileOutput,
  fullFilePath: string,
  coverage: CoverageData
): void {
  instrumenter.instrumentSync(jsResult.outputText, fullFilePath);
  coverage[fullFilePath] = instrumenter.lastFileCoverage();
}

function getFileTranspilledToJs(fullFilePath: string): TranspileOutput {
  const rawFile: string = fs.readFileSync(fullFilePath, 'utf-8');
  const jsResult: TranspileOutput = transpileModule(rawFile, {
    compilerOptions: {
      allowJs: true,
      module: ModuleKind.ES2015,
    },
  });
  return jsResult;
}

function getListOfFilesToCover(coverageReporterConfig: PublicAPI): string[] {
  const globPatternList: string[] = flatten([
    coverageReporterConfig.coverageReporter.include || [],
  ]);

  return sync(globPatternList);
}

module.exports = {
  'reporter:karma-sabarivka-reporter': ['type', sabarivkaReporter],
  'reporter:sabarivka': ['type', sabarivkaReporter],
};

function flatten(arr: ReadonlyArray<string | string[]>): string[] {
  return ([] as string[]).concat(...arr);
}
