import { useState, useEffect, useCallback } from "react";

export interface EndemicityDataItem {
  year: number;
  endemicityLevel: string;
  endemicityLabel: string;
  colorHex: string;
  iuRequiringPc: number;
  iuReceivedPc: number;
  geoCoveragePct: number;
}

export interface EndemicityDataResponse {
  meta: {
    years: number[];
    endemicityLevels: string[];
  };
  data: EndemicityDataItem[];
}

interface UseEndemicityDataOptions {
  country?: string;
  disease?: string;
  year?: number;
}

interface UseEndemicityDataResult {
  data: EndemicityDataItem[];
  years: number[];
  endemicityLevels: string[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useEndemicityData(
  options: UseEndemicityDataOptions = {},
): UseEndemicityDataResult {
  const { country, disease, year } = options;

  const [data, setData] = useState<EndemicityDataItem[]>([]);
  const [years, setYears] = useState<number[]>([]);
  const [endemicityLevels, setEndemicityLevels] = useState<string[]>([]);
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
      const response = await fetch(`/api/agg_geo_coverage${queryString}`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: EndemicityDataResponse = await response.json();

      setData(result.data);
      setYears(result.meta.years);
      setEndemicityLevels(result.meta.endemicityLevels);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch data");
      console.error("Error fetching endemicity data:", err);
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
    endemicityLevels,
    loading,
    error,
    refetch: fetchData,
  };
}
