import * as fs from 'fs';
import { createInstrumenter } from 'istanbul-lib-instrument';
import * as path from 'path';
import * as typescript from 'typescript';
// tslint:disable-next-line: no-var-requires
const sync = require('globby').sync;

const instrumenter = createInstrumenter({
    esModules: true,
});

declare type KarmaReprter = (coverageReporterConfig: any) => void;
interface Reporter extends KarmaReprter {
    $inject: string[];
}

const sabarivkaReporter: Reporter = Object.defineProperty(
    function (coverageReporterConfig) {
        this.onBrowserComplete = getFileIntrumenterFn(coverageReporterConfig);
    },
    '$inject',
    {
        value: ['config.coverageReporter'],
    },
);

interface Config {
    include?: string[] | string;
    exclude?: string[] | string;
}

function getFileIntrumenterFn(coverageReporterConfig: Config): (a, b) => any {
    return (browser, { coverage = {} }) => {
        const filesToCover = getListOfFilesToCover(coverageReporterConfig);

        instrumentFilesWithCoverage(filesToCover, coverage);
    };
}

function instrumentFilesWithCoverage(filesToCover: string[], coverage) {
    filesToCover.forEach((filePath: string) => {
        const fullFilePath = path.resolve(process.cwd(), filePath);

        if (!coverage[fullFilePath]) {
            const fileContent = getFileTranspilledToJs(fullFilePath);

            instrumentFile(fileContent, fullFilePath, coverage);
        }
    });
}

function instrumentFile(jsResult: typescript.TranspileOutput, fullFilePath: string, coverage: any) {
    instrumenter.instrumentSync(jsResult.outputText, fullFilePath);
    coverage[fullFilePath] = instrumenter.lastFileCoverage();
}

function getFileTranspilledToJs(fullFilePath: string) {
    const rawFile = fs.readFileSync(fullFilePath, 'utf-8');
    const jsResult = typescript.transpileModule(rawFile, {
        compilerOptions: {
            allowJs: true,
            module: typescript.ModuleKind.ES2015,
        },
    });
    return jsResult;
}

function getListOfFilesToCover(coverageReporterConfig: Config) {
    const includeFlattenPattern: string[] = flatten(coverageReporterConfig.include);
    const excludeFlattenPattern: string[] = flatten(coverageReporterConfig.exclude).map(val => negatePattern(val));

    return sync([...includeFlattenPattern, ...excludeFlattenPattern]);
}

module.exports = {
    'reporter:karma-sabarivka-reporter': ['type', sabarivkaReporter],
    'reporter:sabarivka': ['type', sabarivkaReporter],
};

function negatePattern(pattern: string): string {
    return isNegated(pattern) ? pattern.slice(1) : `!${pattern}`;

    function isNegated(val: string) {
        return val.charAt(0) === '!' && val.charAt(1) !== '(';
    }
}

function flatten(arr: string[] | undefined | string): string[] {
    return [].concat(...([arr || []]));
}
