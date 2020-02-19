import { InitialCoverage } from 'istanbul-lib-instrument';

export type Config = {
  include: string[] | string;
};

export type KarmaReprter = (
  coverageReporterConfig: Config
) => void & {
  $inject: string[];
};

export type CoverageData = InitialCoverage['coverageData'];

export type InstrumenterFnArgs = [never, { coverage: CoverageData }];
