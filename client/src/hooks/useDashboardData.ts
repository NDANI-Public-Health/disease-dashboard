import { useState, useEffect, useCallback } from "react";
import { CaseRecord, SummaryStats } from "../types";

interface DashboardData {
  countries: string[];
  diseases: string[];
  cases: CaseRecord[];
  summary: SummaryStats;
  selectedCountry: string;
  selectedDisease: string;
  setSelectedCountry: (country: string) => void;
  setSelectedDisease: (disease: string) => void;
  loading: boolean;
  setSelectedYear: (year: number) => void;
  selectedYear: number;
}

export function useDashboardData(): DashboardData {
  const [countries, setCountries] = useState<string[]>([]);
  const [diseases, setDiseases] = useState<string[]>([]);
  const [cases, setCases] = useState<CaseRecord[]>([]);
  const [summary, setSummary] = useState<SummaryStats>({
    totalCases: 0,
    totalDeaths: 0,
    countriesAffected: 0,
    avgPrevalence: 0,
  });
  const [selectedCountry, setSelectedCountry] = useState("Nigeria");
  const [selectedDisease, setSelectedDisease] = useState("Schistosomiasis");
  const [selectedYear, setSelectedYear] = useState<number>(2024);
  const [loading, setLoading] = useState(true);

  // Fetch filter options on mount
  useEffect(() => {
    Promise.all([
      fetch("/api/filters/countries").then((r) => r.json()),
      fetch("/api/filters/diseases").then((r) => r.json()),
    ]).then(([c, d]) => {
      setCountries(c.countries);
      setDiseases(d.diseases);
    });
  }, []);

  // Fetch data when filters change
  const fetchData = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (selectedCountry) params.set("country", selectedCountry);
    if (selectedDisease) params.set("disease", selectedDisease);
    const qs = params.toString() ? `?${params.toString()}` : "";

    const [casesRes, summaryRes] = await Promise.all([
      fetch(`/api/cases${qs}`).then((r) => r.json()),
      fetch(`/api/cases/summary${qs}`).then((r) => r.json()),
    ]);

    setCases(casesRes.cases);
    setSummary(summaryRes);
    setLoading(false);
  }, [selectedCountry, selectedDisease]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    countries,
    diseases,
    cases,
    summary,
    selectedCountry,
    selectedDisease,
    setSelectedCountry,
    setSelectedDisease,
    loading,
    setSelectedYear,
    selectedYear,
  };
}
