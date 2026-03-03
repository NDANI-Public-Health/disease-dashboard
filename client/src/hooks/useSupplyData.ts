import { useState, useEffect, useCallback } from "react";

export interface SupplyDataItem {
  year: number;
  deliveryDelayDays: number;
}

export interface SupplyDataResponse {
  meta: {
    years: number[];
  };
  data: SupplyDataItem[];
}

interface UseSupplyDataOptions {
  country?: string;
  disease?: string;
  year?: number;
}

interface UseSupplyDataResult {
  data: SupplyDataItem[];
  years: number[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useSupplyData(
  options: UseSupplyDataOptions = {},
): UseSupplyDataResult {
  const { country, disease, year } = options;

  const [data, setData] = useState<SupplyDataItem[]>([]);
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
      const response = await fetch(`/api/agg_supply_delay${queryString}`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: SupplyDataResponse = await response.json();

      setData(result.data);
      setYears(result.meta.years);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch data");
      console.error("Error fetching supply data:", err);
    } finally {
      setLoading(false);
    }
  }, [country, disease, year]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  console.log("Supply data fetched:", data);
  return {
    data,
    years,
    loading,
    error,
    refetch: fetchData,
  };
}
