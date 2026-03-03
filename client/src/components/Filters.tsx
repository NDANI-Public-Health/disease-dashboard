import { useState } from "react";

interface FiltersProps {
  countries: string[];
  diseases: string[];
  selectedCountry: string;
  selectedDisease: string;
  selectedYear: number;
  onCountryChange: (country: string) => void;
  onDiseaseChange: (disease: string) => void;
  setSelectedYear: (year: number) => void;
}

export default function Filters({
  countries,
  diseases,
  selectedCountry,
  selectedDisease,
  selectedYear,
  onCountryChange,
  onDiseaseChange,
  setSelectedYear,
}: FiltersProps) {
  const years = [
    2024, 2023, 2022, 2021, 2020, 2019, 2018, 2017, 2016, 2015, 2014,
  ];

  return (
    <div className="filters">
      <div className="filter-group">
        <label>Country</label>
        <select
          value={selectedCountry}
          onChange={(e) => onCountryChange(e.target.value)}
        >
          <option value="">All Countries</option>
          {countries.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>
      <div className="filter-group">
        <label>Disease</label>
        <select
          value={selectedDisease}
          onChange={(e) => onDiseaseChange(e.target.value)}
        >
          <option value="">All Diseases</option>
          {diseases.map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>
      </div>
      <div className="filter-group">
        <label>Year</label>
        <select
          value={selectedYear}
          onChange={(e) => setSelectedYear(Number(e.target.value))}
          className="px-4 py-2 bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg text-sm text-white font-medium focus:outline-none focus:ring-2 focus:ring-white/50 transition-all cursor-pointer hover:bg-white/30"
        >
          {years.map((y) => (
            <option key={y} value={y} className="text-gray-800">
              {y}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
