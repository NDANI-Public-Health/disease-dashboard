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
