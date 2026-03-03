import { useState, useEffect, useCallback, useMemo } from "react";

export interface PieChartDataItem {
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

export interface PieChartDataResponse {
  meta: {
    years: number[];
    targetPops: string[];
  };
  data: PieChartDataItem[];
}

interface UsePieChartDataOptions {
  country?: string;
  disease?: string;
  year?: number;
}

interface PieChartSeries {
  labels: string[];
  series: number[];
  colors: string[];
}

interface PCReceivedData {
  received: number;
  notReceived: number;
  total: number;
}

interface TargetVsTreatedData {
  targeted: number;
  treated: number;
  notTreated: number;
}

interface UsePieChartDataResult {
  data: PieChartDataItem[];
  years: number[];
  targetPops: string[];
  pieChartData: PieChartSeries;
  pcReceivedData: PCReceivedData;
  targetVsTreatedData: TargetVsTreatedData;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function usePieChartData(
  options: UsePieChartDataOptions = {},
): UsePieChartDataResult {
  const { country, disease, year } = options;

  const [data, setData] = useState<PieChartDataItem[]>([]);
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

      const result: PieChartDataResponse = await response.json();

      setData(result.data);
      setYears(result.meta.years);
      setTargetPops(result.meta.targetPops);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch data");
      console.error("Error fetching pie chart data:", err);
    } finally {
      setLoading(false);
    }
  }, [country, disease, year]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Transform data for pie chart format
  const pieChartData = useMemo((): PieChartSeries => {
    const selectedYear = year || 2024;
    const yearData = data.filter((d) => d.year === selectedYear);

    // Default colors for target populations
    const colorMap: Record<string, string> = {
      SAC: "#4CAF50", // Green
      Adult: "#2196F3", // Blue
      Total: "#9C27B0", // Purple
    };

    const labels: string[] = [];
    const series: number[] = [];
    const colors: string[] = [];

    yearData.forEach((item) => {
      labels.push(item.targetPop);
      series.push(item.popTreat);
      colors.push(colorMap[item.targetPop] || "#757575");
    });

    return { labels, series, colors };
  }, [data, year]);

  // Transform data for PC Received vs Not Received pie chart (using Total targetPop)
  const pcReceivedData = useMemo((): PCReceivedData => {
    const selectedYear = year || 2024;
    const totalData = data.find(
      (d) => d.year === selectedYear && d.targetPop === "Total",
    );

    if (!totalData) {
      return { received: 0, notReceived: 0, total: 0 };
    }

    return {
      received: totalData.popReqReceived,
      notReceived: totalData.popReqNotReceived,
      total: totalData.popReq,
    };
  }, [data, year]);

  // Transform data for Target vs Treated pie chart (using Total targetPop)
  const targetVsTreatedData = useMemo((): TargetVsTreatedData => {
    const selectedYear = year || 2024;
    const totalData = data.find(
      (d) => d.year === selectedYear && d.targetPop === "Total",
    );

    if (!totalData) {
      return { targeted: 0, treated: 0, notTreated: 0 };
    }

    return {
      targeted: totalData.popTrg,
      treated: totalData.popTreat,
      notTreated: totalData.popNotTreat,
    };
  }, [data, year]);

  return {
    data,
    years,
    targetPops,
    pieChartData,
    pcReceivedData,
    targetVsTreatedData,
    loading,
    error,
    refetch: fetchData,
  };
}
