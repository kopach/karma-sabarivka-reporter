import {
  InstrumenterFnArgs,
  isValidSabarivkaReporterConfig,
  KarmaReprter,
  KarmaOptions,
} from './model';
import { getFileIntrumenterFn } from './instrumenter';
import { ConfigOptions } from 'karma';
import { structure, in as isIn } from 'predicates';

type Log = {
  warn: (arg0: string) => void;
};

type Logger = {
  create: (arg0: string) => Log;
};

export const sabarivkaReporter: KarmaReprter = Object.defineProperty(
  function(
    this: { onBrowserComplete: (...args: InstrumenterFnArgs) => void },
    karmaConfig: KarmaOptions,
    logger: Logger
  ): void {
    if (!isIstanbulEnabled(karmaConfig)) {
      const log: Log = logger.create('[karma-sabarivka-reporter]');

      log.warn(
        '"coverage-istanbul" is not listed under karma "reporters" config section. No coverage report is being created'
      );

      return;
    }

    ensureSabarivkaReporterConfigCorrectness(karmaConfig);

    this.onBrowserComplete = getFileIntrumenterFn(karmaConfig);
  },
  '$inject',
  {
    value: ['config', 'logger'],
  }
);

function isIstanbulEnabled(coverageReporterConfig: ConfigOptions): boolean {
  const withIstanbulReporter = (
    reporters: ConfigOptions['reporters']
  ): boolean => {
    return !!reporters && isIn(reporters, 'coverage-istanbul');
  };

  return structure({
    reporters: withIstanbulReporter,
  })(coverageReporterConfig);
}

function ensureSabarivkaReporterConfigCorrectness(
  coverageReporterConfig: ConfigOptions
): void | never {
  if (!isValidSabarivkaReporterConfig(coverageReporterConfig)) {
    const schema: string = JSON.stringify(
      require('../dist/public_api.schema.json'),
      null,
      2
    );
    // TODO: try to reuse logger
    throw new Error(
      `Not valid karma-sabarivka-reporter-confiig\nvalid schema is: \n${schema}`
    );
  }
}
