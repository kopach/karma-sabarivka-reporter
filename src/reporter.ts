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
    if (!isKarmaConfigAppropriate(karmaConfig, logger)) {
      return;
    }

    this.onBrowserComplete = getFileIntrumenterFn(karmaConfig);
  },
  '$inject',
  {
    value: ['config', 'logger'],
  }
);

function isKarmaConfigAppropriate(
  karmaConfig: ConfigOptions,
  logger: Logger
): boolean | never {
  const log: Log = logger.create('[karma-sabarivka-reporter]');

  return (
    ensureIstanbulEnabled(karmaConfig, log) &&
    ensureValidSabarivkaReporterConfig(karmaConfig)
  );
}

function ensureIstanbulEnabled(karmaConfig: ConfigOptions, log: Log): boolean {
  if (!isIstanbulEnabled(karmaConfig)) {
    log.warn(
      '"coverage-istanbul" is not listed under karma "reporters" config section. No coverage report is being created'
    );

    return false;
  }

  return true;
}

function ensureValidSabarivkaReporterConfig(
  karmaConfig: ConfigOptions
): boolean | never {
  if (!isValidSabarivkaReporterConfig(karmaConfig)) {
    const schema: string = JSON.stringify(
      require('../dist/public_api.schema.json'),
      null,
      2
    );
    throw new Error(
      `Not valid karma-sabarivka-reporter-confiig\nvalid schema is: \n${schema}`
    );
  }

  return true;
}

function isIstanbulEnabled(coverageReporterConfig: ConfigOptions): boolean {
  const withIstanbulReporter = (
    reporters: ConfigOptions['reporters']
  ): boolean => {
    return !!reporters && (isIn(reporters, 'coverage') || isIn(reporters, 'coverage-istanbul'));
  };

  return structure({
    reporters: withIstanbulReporter,
  })(coverageReporterConfig);
}
