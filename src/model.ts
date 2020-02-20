import { InitialCoverage } from 'istanbul-lib-instrument';
import { arrayOf, or, string, structure } from 'predicates';
import { Predicate } from 'predicates/types';

// NOTE: this type name is used in package.json `prebuild` script
export type PublicAPI = {
  coverageReporter: {
    include: string[] | string;
  };
};

export const isSabarivkaReporterConfig: Predicate<PublicAPI> = structure({
  coverageReporter: structure({
    include: or(string, arrayOf(string)),
  }),
});

export type KarmaReprter = (
  coverageReporterConfig: PublicAPI
) => void & {
  $inject: string[];
};

export type CoverageData = InitialCoverage['coverageData'];

export type InstrumenterFnArgs = [never, { coverage: CoverageData }];
