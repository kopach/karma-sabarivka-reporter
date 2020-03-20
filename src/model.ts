import { InitialCoverage } from 'istanbul-lib-instrument';
import { arrayOf, or, string, structure } from 'predicates';
import { ConfigOptions } from 'karma';

// NOTE: this type name is used in package.json `prebuild` script
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

export type KarmaReprter = (
  karmaConfig: KarmaOptions
) => void & {
  $inject: string[];
};

export type CoverageData = InitialCoverage['coverageData'];

export type InstrumenterFnArgs = [never, { coverage: CoverageData }];
