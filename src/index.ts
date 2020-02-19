import * as fs from 'fs';
import { sync } from 'globby';
import { createInstrumenter, Instrumenter } from 'istanbul-lib-instrument';
import * as path from 'path';
import { ModuleKind, transpileModule, TranspileOutput } from 'typescript';
import {
  Config,
  CoverageData,
  InstrumenterFnArgs,
  KarmaReprter,
} from './model';

const instrumenter: Instrumenter = createInstrumenter({
  esModules: true,
});

const sabarivkaReporter: KarmaReprter = Object.defineProperty(
  function(
    this: { onBrowserComplete: (...args: InstrumenterFnArgs) => void },
    coverageReporterConfig: Config
  ): void {
    this.onBrowserComplete = getFileIntrumenterFn(coverageReporterConfig);
  },
  '$inject',
  {
    value: ['config.coverageReporter'],
  }
);

function getFileIntrumenterFn(
  coverageReporterConfig: Config
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

function getListOfFilesToCover(coverageReporterConfig: Config): string[] {
  const globPatternList: string[] = flatten([
    coverageReporterConfig.include || [],
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
