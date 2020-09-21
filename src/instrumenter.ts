import * as fs from 'fs';
import { sync } from 'globby';
import { createInstrumenter, Instrumenter } from 'istanbul-lib-instrument';
import * as path from 'path';
import { ModuleKind, transpileModule, TranspileOutput } from 'typescript';
import { CoverageData, InstrumenterFnArgs, PublicAPI } from './model';

export function getFileIntrumenterFn(
  coverageReporterConfig: PublicAPI
): (...args: InstrumenterFnArgs) => void {
  return (...[, { coverage }]: InstrumenterFnArgs): void => {
    const filesToCover: string[] = getListOfFilesToCover(
      coverageReporterConfig
    );

    addFileListToCoverageData(filesToCover, coverage);
  };
}

function getListOfFilesToCover(coverageReporterConfig: PublicAPI): string[] {
  const globPatternList: string[] = flatten([
    coverageReporterConfig.coverageReporter.include || [],
  ]);

  return sync(globPatternList);
}

function addFileListToCoverageData(
  filesToCover: string[],
  coverage?: CoverageData
): void {
  filesToCover.forEach((filePath: string): void => {
    if (!coverage) return;

    const fullFilePath: string = path.resolve(process.cwd(), filePath);

    if (!coverage[fullFilePath]) {
      const fileContentJS: TranspileOutput = getFileTranspilledToJs(
        fullFilePath
      );

      coverage[fullFilePath] = getFileCoverageData(fileContentJS, fullFilePath);
    }
  });
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

function getFileCoverageData(
  fileContentJS: TranspileOutput,
  fullFilePath: string
): ReturnType<Instrumenter['lastFileCoverage']> {
  const instrumenter: Instrumenter = createInstrumenter({
    esModules: true,
  });

  instrumenter.instrumentSync(fileContentJS.outputText, fullFilePath);

  return instrumenter.lastFileCoverage();
}

function flatten(arr: ReadonlyArray<string | string[]>): string[] {
  return ([] as string[]).concat(...arr);
}
