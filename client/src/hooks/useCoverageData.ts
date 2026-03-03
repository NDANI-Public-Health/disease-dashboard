import { useState, useEffect, useCallback } from "react";

export interface CoverageTrendItem {
  year: number;
  iuRequiringTreatment: number;
  iuTreated: number;
  iuEffectiveCoverage: number;
  iuRequiringTreatmentPct: number;
  natSacCovPct: number;
  progSacCovPct: number;
}

export interface CoverageTrendResponse {
  meta: {
    years: number[];
  };
  data: CoverageTrendItem[];
}

interface UseCoverageDataOptions {
  country?: string;
  disease?: string;
  year?: number;
}

interface UseCoverageDataResult {
  data: CoverageTrendItem[];
  years: number[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useCoverageData(
  options: UseCoverageDataOptions = {},
): UseCoverageDataResult {
  const { country, disease, year } = options;

  const [data, setData] = useState<CoverageTrendItem[]>([]);
  const [years, setYears] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      if (country) params.set("country", country);
      if (disease) params.set("disease", disease);
      if (year) params.set("year", year.toString());

      const queryString = params.toString() ? `?${params.toString()}` : "";
      const response = await fetch(`/api/agg_sac_coverage${queryString}`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: CoverageTrendResponse = await response.json();

      setData(result.data);
      setYears(result.meta.years);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch data");
      console.error("Error fetching coverage data:", err);
    } finally {
      setLoading(false);
    }
  }, [country, disease, year]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    data,
    years,
    loading,
    error,
    refetch: fetchData,
  };
}
