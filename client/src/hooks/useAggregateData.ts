import { useState, useEffect, useCallback } from "react";

export interface AggKeyStatsItem {
  year: number;
  targetPop: string;
  popReq: number;
  popTrg: number;
  popTreat: number;
  progCovPct: number | null;
  natCovPct: number | null;
}

export interface AggKeyStatsResponse {
  meta: {
    years: number[];
    targetPops: string[];
  };
  data: AggKeyStatsItem[];
}

interface UseAggregateDataOptions {
  country?: string;
  disease?: string;
  year?: number;
}

interface UseAggregateDataResult {
  data: AggKeyStatsItem[];
  years: number[];
  targetPops: string[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useAggregateData(
  options: UseAggregateDataOptions = {},
): UseAggregateDataResult {
  const { country, disease, year } = options;

  const [data, setData] = useState<AggKeyStatsItem[]>([]);
  const [years, setYears] = useState<number[]>([]);
  const [targetPops, setTargetPops] = useState<string[]>([]);
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
      const response = await fetch(`/api/agg_key_stats${queryString}`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: AggKeyStatsResponse = await response.json();

      setData(result.data);
      setYears(result.meta.years);
      setTargetPops(result.meta.targetPops);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch data");
      console.error("Error fetching aggregate data:", err);
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
    targetPops,
    loading,
    error,
    refetch: fetchData,
  };
}
