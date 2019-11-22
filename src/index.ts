import * as fs from 'fs';
import { sync } from 'glob';
import { createInstrumenter } from 'istanbul-lib-instrument';
import { difference } from 'lodash';
import * as path from 'path';
import * as typescript from 'typescript';

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
    include: any;
    exclude: any;
}

const globOptions = { cwd: process.cwd() };

function getFileIntrumenterFn(coverageReporterConfig: Config): (a, b) => any {
    return (browser, { coverage = {} }) => {
        const filesToCover = getListOfFilesToCover(coverageReporterConfig);

        instrumentFilesWithCoverage(filesToCover, coverage);
    };
}

function instrumentFilesWithCoverage(filesToCover: string[], coverage) {
    filesToCover.forEach((filePath: string) => {
        const fullFilePath = path.resolve(globOptions.cwd, filePath);

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
    const include = sync(coverageReporterConfig.include, globOptions);
    const exclude = coverageReporterConfig.exclude
        ? sync(coverageReporterConfig.exclude, globOptions)
        : [];
    const all = difference(include, exclude);
    return all;
}

module.exports = {
    'reporter:karma-sabarivka-reporter': ['type', sabarivkaReporter],
    'reporter:sabarivka': ['type', sabarivkaReporter],
};
