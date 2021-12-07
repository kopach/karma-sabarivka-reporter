import { InitialCoverage } from 'istanbul-lib-instrument';
import { arrayOf, or, string, structure } from 'predicates';
import { ConfigOptions } from 'karma';

// NOTE: this name used in package.json `prebuild` script
export type PublicAPI = {
  coverageReporter: {
    include: string[] | string;
  };
};

export type KarmaOptions = ConfigOptions & PublicAPI;

export const isValidSabarivkaReporterConfig = (
  value: ConfigOptions
): value is KarmaOptions =>
  structure({
    coverageReporter: structure({
      include: or(string, arrayOf(string)),
    }),
  })(value);

export type Log = {
  warn: (arg0: string) => void;
};

export type Logger = {
  create: (arg0: string) => Log;
};

export type ReporterThis = {
  onBrowserComplete: (...args: InstrumenterFnArgs) => void;
  adapters: unknown[];
};

export type KarmaReporter = (
  this: ReporterThis,
  karmaConfig: KarmaOptions,
  logger: Logger
) => void;

export type CoverageData = InitialCoverage['coverageData'];

export type InstrumenterFnArgs = [never, { coverage: CoverageData }];
