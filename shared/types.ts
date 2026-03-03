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
