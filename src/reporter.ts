import {
  InstrumenterFnArgs,
  isValidSabarivkaReporterConfig,
  KarmaReporter,
  KarmaOptions,
} from './model';
import { getFileInstrumenterFn } from './instrumenter';
import { ConfigOptions } from 'karma';
import { structure, in as isIn } from 'predicates';

type Log = {
  warn: (arg0: string) => void;
};

type Logger = {
  create: (arg0: string) => Log;
};

export const sabarivkaReporter: KarmaReporter = Object.defineProperty(
  function (
    this: {
      onBrowserComplete: (...args: InstrumenterFnArgs) => void;
      adapters: unknown[];
    },
    karmaConfig: KarmaOptions,
    logger: Logger
  ): void {
    this.adapters = [];
    if (!isKarmaConfigAppropriate(karmaConfig, logger)) {
      return;

    }
    this.onBrowserComplete = getFileInstrumenterFn(karmaConfig);
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
    ensureIstanbulConfigCorrect(karmaConfig, log) &&
    ensureValidSabarivkaReporterConfig(karmaConfig)
  );
}

function ensureIstanbulEnabled(karmaConfig: ConfigOptions, log: Log): boolean {
  if (!isIstanbulEnabled(karmaConfig)) {
    log.warn(
      'Neither "coverage-istanbul" nor "coverage" reporter listed under karma "reporters" config section. No coverage report created'
    );

    return false;
  }

  return true;
}

function ensureIstanbulConfigCorrect(
  karmaConfig: ConfigOptions,
  log: Log
): boolean {
  if (
    isKarmaCoverageReporter(karmaConfig) &&
    !isKarmaCoverageReporterRegisteredCorrectly(karmaConfig)
  ) {
    log.warn('"sabarivka" should go before "coverage" in "reporters" list');

    return false;
  }

  return true;
}

function isKarmaCoverageReporter(karmaConfig: ConfigOptions): boolean {
  const withKarmaCoverageReporter = (
    reporters: ConfigOptions['reporters']
  ): boolean => !!reporters && isIn(reporters, 'coverage');

  return structure({
    reporters: withKarmaCoverageReporter,
  })(karmaConfig);
}

function isKarmaCoverageReporterRegisteredCorrectly(
  karmaConfig: ConfigOptions
): boolean {
  const withKarmaCoverageReporter = (
    reporters: Required<ConfigOptions>['reporters']
  ): boolean => reporters.indexOf('sabarivka') < reporters.indexOf('coverage');

  return structure({
    reporters: withKarmaCoverageReporter,
  })(karmaConfig);
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
      `Not valid karma-sabarivka-reporter-config\nvalid schema is: \n${schema}`
    );
  }

  return true;
}

function isIstanbulEnabled(coverageReporterConfig: ConfigOptions): boolean {
  const withIstanbulReporter = (
    reporters: ConfigOptions['reporters']
  ): boolean => {
    return (
      !!reporters &&
      (isIn(reporters, 'coverage') || isIn(reporters, 'coverage-istanbul'))
    );
  };

  return structure({
    reporters: withIstanbulReporter,
  })(coverageReporterConfig);
}
