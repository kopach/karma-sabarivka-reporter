import * as fs from 'fs';
import { sync } from 'globby';
import { createInstrumenter, Instrumenter } from 'istanbul-lib-instrument';
import * as path from 'path';
import { ModuleKind, transpileModule, TranspileOutput } from 'typescript';

const instrumenter: Instrumenter = createInstrumenter({
  esModules: true,
});

declare type KarmaReprter = (coverageReporterConfig: Config) => void;
interface Reporter extends KarmaReprter {
  $inject: string[];
}

const sabarivkaReporter: Reporter = Object.defineProperty(
  function(
    // tslint:disable-next-line: no-any
    this: { onBrowserComplete: (a: any, b: any) => any },
    coverageReporterConfig: Config
  ): void {
    this.onBrowserComplete = getFileIntrumenterFn(coverageReporterConfig);
  },
  '$inject',
  {
    value: ['config.coverageReporter'],
  }
);

interface Config {
  include: string[] | string;
}

function getFileIntrumenterFn(
  coverageReporterConfig: Config
  // tslint:disable-next-line: no-any
): (...args: any) => any {
  // tslint:disable-next-line: no-any
  return (...[, { coverage = {} }]: any): void => {
    const filesToCover: string[] = getListOfFilesToCover(
      coverageReporterConfig
    );

    instrumentFilesWithCoverage(filesToCover, coverage);
  };
}

function instrumentFilesWithCoverage(
  filesToCover: string[],
  // tslint:disable-next-line: no-any
  coverage: { [x: string]: any }
): void {
  filesToCover.forEach((filePath: string) => {
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
  // tslint:disable-next-line: no-any
  coverage: any
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
  // tslint:disable-next-line: no-any
  return [].concat(...(arr as any[]));
}
