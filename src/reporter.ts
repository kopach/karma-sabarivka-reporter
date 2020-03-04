import {
  InstrumenterFnArgs,
  isSabarivkaReporterConfig,
  KarmaReprter,
  PublicAPI,
} from './model';
import { getFileIntrumenterFn } from './instrumenter';

export const sabarivkaReporter: KarmaReprter = Object.defineProperty(
  function(
    this: { onBrowserComplete: (...args: InstrumenterFnArgs) => void },
    coverageReporterConfig: PublicAPI
  ): void {
    ensureConfigCorrectness(coverageReporterConfig);

    this.onBrowserComplete = getFileIntrumenterFn(coverageReporterConfig);
  },
  '$inject',
  {
    value: ['config'],
  }
);

function ensureConfigCorrectness(
  coverageReporterConfig: PublicAPI
): void | never {
  if (!isSabarivkaReporterConfig(coverageReporterConfig)) {
    const schema: string = JSON.stringify(
      require('../dist/public_api.schema.json'),
      null,
      2
    );
    throw new Error(
      `Not valid karma-sabarivka-reporter-confiig\nvalid schema is: \n${schema}`
    );
  }
}
