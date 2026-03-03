export interface CaseRecord {
  id: number;
  country: string;
  disease: string;
  year: number;
  cases: number;
  deaths: number;
  population: number;
  prevalence: number;
}

export interface SummaryStats {
  totalCases: number;
  totalDeaths: number;
  countriesAffected: number;
  avgPrevalence: number;
}

export interface AggKeyStat {
  year: number;
  targetPop: string;
  popReq: number;
  popTrg: number;
  popTreat: number;
  popReqReceived: number;
  popReqNotReceived: number;
  popNotTreat: number;
  progCovPct: number | null;
  natCovPct: number | null;
}

export interface AggKeyStatsResponse {
  meta: {
    years: number[];
    targetPops: string[];
  };
  data: AggKeyStat[];
}

export interface AggGeoCoverage {
  year: number;
  endemicityLevel: string;
  endemicityLabel: string;
  colorHex: string;
  iuRequiringPc: number;
  iuReceivedPc: number;
  geoCoveragePct: number;
}

export interface AggGeoCoverageResponse {
  meta: {
    years: number[];
    endemicityLevels: string[];
  };
  data: AggGeoCoverage[];
}

export interface AggCoverageTrend {
  year: number;
  progAdultCovPct: number | null;
  progTotalCovPct: number | null;
  natAdultCovPct: number | null;
  natTotalCovPct: number | null;
}

export interface AggCoverageTrendsResponse {
  meta: {
    years: number[];
  };
  data: AggCoverageTrend[];
}

export interface AggSupplyDelay {
  year: number;
  deliveryDelayDays: number;
}

export interface AggSupplyDelayResponse {
  meta: {
    years: number[];
  };
  data: AggSupplyDelay[];
}

export interface AggEffectiveRound {
  iuId: number;
  iuName: string;
  state: string;
  country: string;
  totalMdaRounds: number;
  effectiveRounds: number;
  ineffectiveRounds: number;
  latestYear: number;
  latestEndemicity: string;
  latestCoverage: number | null;
  hasTransmissionRisk: boolean;
}

export interface AggEffectiveRoundsResponse {
  meta: {
    states: string[];
    endemicities: string[];
  };
  data: AggEffectiveRound[];
}

export interface AggSacCoverage {
  year: number;
  iuRequiringTreatment: number;
  iuTreated: number;
  iuEffectiveCoverage: number;
  iuRequiringTreatmentPct: number;
  natSacCovPct: number;
  progSacCovPct: number;
}

export interface AggSacCoverageResponse {
  meta: {
    years: number[];
  };
  data: AggSacCoverage[];
}
