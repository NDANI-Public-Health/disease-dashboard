import React, { useState, useMemo } from "react";
import { useEndemicityData } from "../hooks/useEndimicityData";

interface EndemicityDataItem {
  year: number;
  endemicityLevel: string;
  endemicityLabel: string;
  colorHex: string;
  iuRequiringPc: number;
  iuReceivedPc: number;
  geoCoveragePct: number;
}

interface EndemicityTableProps {
  country?: string;
  disease?: string;
  year?: number;
}

const endemicityData: EndemicityDataItem[] = [
  {
    year: 2014,
    endemicityLevel: "High",
    endemicityLabel: "High prevalence (50% and above)",
    colorHex: "#c62828",
    iuRequiringPc: 15,
    iuReceivedPc: 4,
    geoCoveragePct: 26.67,
  },
  {
    year: 2014,
    endemicityLevel: "Low",
    endemicityLabel: "Low prevalence (less than 10%)",
    colorHex: "#fff176",
    iuRequiringPc: 263,
    iuReceivedPc: 54,
    geoCoveragePct: 20.53,
  },
  {
    year: 2014,
    endemicityLevel: "Moderate",
    endemicityLabel: "Moderate prevalence (10%-49%)",
    colorHex: "#ffb300",
    iuRequiringPc: 305,
    iuReceivedPc: 67,
    geoCoveragePct: 21.97,
  },
  {
    year: 2014,
    endemicityLevel: "Non-endemic",
    endemicityLabel: "Non-endemic",
    colorHex: "#b0bec5",
    iuRequiringPc: 191,
    iuReceivedPc: 0,
    geoCoveragePct: 0,
  },
  {
    year: 2015,
    endemicityLevel: "High",
    endemicityLabel: "High prevalence (50% and above)",
    colorHex: "#c62828",
    iuRequiringPc: 10,
    iuReceivedPc: 9,
    geoCoveragePct: 90,
  },
  {
    year: 2015,
    endemicityLevel: "Low",
    endemicityLabel: "Low prevalence (less than 10%)",
    colorHex: "#fff176",
    iuRequiringPc: 251,
    iuReceivedPc: 84,
    geoCoveragePct: 33.47,
  },
  {
    year: 2015,
    endemicityLevel: "Moderate",
    endemicityLabel: "Moderate prevalence (10%-49%)",
    colorHex: "#ffb300",
    iuRequiringPc: 322,
    iuReceivedPc: 130,
    geoCoveragePct: 40.37,
  },
  {
    year: 2015,
    endemicityLevel: "Non-endemic",
    endemicityLabel: "Non-endemic",
    colorHex: "#b0bec5",
    iuRequiringPc: 191,
    iuReceivedPc: 0,
    geoCoveragePct: 0,
  },
  {
    year: 2016,
    endemicityLevel: "High",
    endemicityLabel: "High prevalence (50% and above)",
    colorHex: "#c62828",
    iuRequiringPc: 10,
    iuReceivedPc: 8,
    geoCoveragePct: 80,
  },
  {
    year: 2016,
    endemicityLevel: "Low",
    endemicityLabel: "Low prevalence (less than 10%)",
    colorHex: "#fff176",
    iuRequiringPc: 251,
    iuReceivedPc: 53,
    geoCoveragePct: 21.12,
  },
  {
    year: 2016,
    endemicityLevel: "Moderate",
    endemicityLabel: "Moderate prevalence (10%-49%)",
    colorHex: "#ffb300",
    iuRequiringPc: 322,
    iuReceivedPc: 123,
    geoCoveragePct: 38.2,
  },
  {
    year: 2016,
    endemicityLevel: "Non-endemic",
    endemicityLabel: "Non-endemic",
    colorHex: "#b0bec5",
    iuRequiringPc: 191,
    iuReceivedPc: 0,
    geoCoveragePct: 0,
  },
  {
    year: 2017,
    endemicityLevel: "High",
    endemicityLabel: "High prevalence (50% and above)",
    colorHex: "#c62828",
    iuRequiringPc: 10,
    iuReceivedPc: 6,
    geoCoveragePct: 60,
  },
  {
    year: 2017,
    endemicityLevel: "Low",
    endemicityLabel: "Low prevalence (less than 10%)",
    colorHex: "#fff176",
    iuRequiringPc: 251,
    iuReceivedPc: 86,
    geoCoveragePct: 34.26,
  },
  {
    year: 2017,
    endemicityLevel: "Moderate",
    endemicityLabel: "Moderate prevalence (10%-49%)",
    colorHex: "#ffb300",
    iuRequiringPc: 322,
    iuReceivedPc: 149,
    geoCoveragePct: 46.27,
  },
  {
    year: 2017,
    endemicityLevel: "Non-endemic",
    endemicityLabel: "Non-endemic",
    colorHex: "#b0bec5",
    iuRequiringPc: 191,
    iuReceivedPc: 0,
    geoCoveragePct: 0,
  },
  {
    year: 2018,
    endemicityLevel: "High",
    endemicityLabel: "High prevalence (50% and above)",
    colorHex: "#c62828",
    iuRequiringPc: 10,
    iuReceivedPc: 2,
    geoCoveragePct: 20,
  },
  {
    year: 2018,
    endemicityLevel: "Low",
    endemicityLabel: "Low prevalence (less than 10%)",
    colorHex: "#fff176",
    iuRequiringPc: 279,
    iuReceivedPc: 80,
    geoCoveragePct: 28.67,
  },
  {
    year: 2018,
    endemicityLevel: "Moderate",
    endemicityLabel: "Moderate prevalence (10%-49%)",
    colorHex: "#ffb300",
    iuRequiringPc: 294,
    iuReceivedPc: 171,
    geoCoveragePct: 58.16,
  },
  {
    year: 2018,
    endemicityLevel: "Non-endemic",
    endemicityLabel: "Non-endemic",
    colorHex: "#b0bec5",
    iuRequiringPc: 191,
    iuReceivedPc: 0,
    geoCoveragePct: 0,
  },
  {
    year: 2019,
    endemicityLevel: "High",
    endemicityLabel: "High prevalence (50% and above)",
    colorHex: "#c62828",
    iuRequiringPc: 10,
    iuReceivedPc: 9,
    geoCoveragePct: 90,
  },
  {
    year: 2019,
    endemicityLevel: "Low",
    endemicityLabel: "Low prevalence (less than 10%)",
    colorHex: "#fff176",
    iuRequiringPc: 279,
    iuReceivedPc: 171,
    geoCoveragePct: 61.29,
  },
  {
    year: 2019,
    endemicityLevel: "Moderate",
    endemicityLabel: "Moderate prevalence (10%-49%)",
    colorHex: "#ffb300",
    iuRequiringPc: 294,
    iuReceivedPc: 173,
    geoCoveragePct: 58.84,
  },
  {
    year: 2019,
    endemicityLevel: "Non-endemic",
    endemicityLabel: "Non-endemic",
    colorHex: "#b0bec5",
    iuRequiringPc: 191,
    iuReceivedPc: 0,
    geoCoveragePct: 0,
  },
  {
    year: 2020,
    endemicityLevel: "High",
    endemicityLabel: "High prevalence (50% and above)",
    colorHex: "#c62828",
    iuRequiringPc: 10,
    iuReceivedPc: 8,
    geoCoveragePct: 80,
  },
  {
    year: 2020,
    endemicityLevel: "Low",
    endemicityLabel: "Low prevalence (less than 10%)",
    colorHex: "#fff176",
    iuRequiringPc: 279,
    iuReceivedPc: 5,
    geoCoveragePct: 1.79,
  },
  {
    year: 2020,
    endemicityLevel: "Moderate",
    endemicityLabel: "Moderate prevalence (10%-49%)",
    colorHex: "#ffb300",
    iuRequiringPc: 294,
    iuReceivedPc: 256,
    geoCoveragePct: 87.07,
  },
  {
    year: 2020,
    endemicityLevel: "Non-endemic",
    endemicityLabel: "Non-endemic",
    colorHex: "#b0bec5",
    iuRequiringPc: 191,
    iuReceivedPc: 0,
    geoCoveragePct: 0,
  },
  {
    year: 2021,
    endemicityLevel: "High",
    endemicityLabel: "High prevalence (50% and above)",
    colorHex: "#c62828",
    iuRequiringPc: 10,
    iuReceivedPc: 3,
    geoCoveragePct: 30,
  },
  {
    year: 2021,
    endemicityLevel: "Low",
    endemicityLabel: "Low prevalence (less than 10%)",
    colorHex: "#fff176",
    iuRequiringPc: 296,
    iuReceivedPc: 37,
    geoCoveragePct: 12.5,
  },
  {
    year: 2021,
    endemicityLevel: "Moderate",
    endemicityLabel: "Moderate prevalence (10%-49%)",
    colorHex: "#ffb300",
    iuRequiringPc: 294,
    iuReceivedPc: 28,
    geoCoveragePct: 9.52,
  },
  {
    year: 2021,
    endemicityLevel: "Non-endemic",
    endemicityLabel: "Non-endemic",
    colorHex: "#b0bec5",
    iuRequiringPc: 174,
    iuReceivedPc: 0,
    geoCoveragePct: 0,
  },
  {
    year: 2022,
    endemicityLevel: "High",
    endemicityLabel: "High prevalence (50% and above)",
    colorHex: "#c62828",
    iuRequiringPc: 112,
    iuReceivedPc: 39,
    geoCoveragePct: 34.82,
  },
  {
    year: 2022,
    endemicityLevel: "Low",
    endemicityLabel: "Low prevalence (less than 10%)",
    colorHex: "#fff176",
    iuRequiringPc: 241,
    iuReceivedPc: 36,
    geoCoveragePct: 14.94,
  },
  {
    year: 2022,
    endemicityLevel: "Moderate",
    endemicityLabel: "Moderate prevalence (10%-49%)",
    colorHex: "#ffb300",
    iuRequiringPc: 317,
    iuReceivedPc: 57,
    geoCoveragePct: 17.98,
  },
  {
    year: 2022,
    endemicityLevel: "Non-endemic",
    endemicityLabel: "Non-endemic",
    colorHex: "#b0bec5",
    iuRequiringPc: 104,
    iuReceivedPc: 0,
    geoCoveragePct: 0,
  },
  {
    year: 2023,
    endemicityLevel: "High",
    endemicityLabel: "High prevalence (50% and above)",
    colorHex: "#c62828",
    iuRequiringPc: 112,
    iuReceivedPc: 101,
    geoCoveragePct: 90.18,
  },
  {
    year: 2023,
    endemicityLevel: "Low",
    endemicityLabel: "Low prevalence (less than 10%)",
    colorHex: "#fff176",
    iuRequiringPc: 241,
    iuReceivedPc: 0,
    geoCoveragePct: 0,
  },
  {
    year: 2023,
    endemicityLevel: "Moderate",
    endemicityLabel: "Moderate prevalence (10%-49%)",
    colorHex: "#ffb300",
    iuRequiringPc: 316,
    iuReceivedPc: 256,
    geoCoveragePct: 81.01,
  },
  {
    year: 2023,
    endemicityLevel: "Non-endemic",
    endemicityLabel: "Non-endemic",
    colorHex: "#b0bec5",
    iuRequiringPc: 105,
    iuReceivedPc: 0,
    geoCoveragePct: 0,
  },
  {
    year: 2024,
    endemicityLevel: "High",
    endemicityLabel: "High prevalence (50% and above)",
    colorHex: "#c62828",
    iuRequiringPc: 112,
    iuReceivedPc: 105,
    geoCoveragePct: 93.75,
  },
  {
    year: 2024,
    endemicityLevel: "Low",
    endemicityLabel: "Low prevalence (less than 10%)",
    colorHex: "#fff176",
    iuRequiringPc: 241,
    iuReceivedPc: 0,
    geoCoveragePct: 0,
  },
  {
    year: 2024,
    endemicityLevel: "Moderate",
    endemicityLabel: "Moderate prevalence (10%-49%)",
    colorHex: "#ffb300",
    iuRequiringPc: 316,
    iuReceivedPc: 259,
    geoCoveragePct: 81.96,
  },
  {
    year: 2024,
    endemicityLevel: "Non-endemic",
    endemicityLabel: "Non-endemic",
    colorHex: "#b0bec5",
    iuRequiringPc: 105,
    iuReceivedPc: 0,
    geoCoveragePct: 0,
  },
];

const years = [
  2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024,
];

export default function EndemicityTable({
  year: selectedYear,
  disease,
  country,
}: EndemicityTableProps) {
  const [year, setYear] = useState<number>(selectedYear || 2024);
  const { data } = useEndemicityData({ year, disease, country });

  const { tableData, totals } = useMemo(() => {
    // Filter by year and only include High and Moderate endemicity levels
    const yearData = endemicityData.filter(
      (d) =>
        d.year === year &&
        (d.endemicityLevel === "High" || d.endemicityLevel === "Moderate"),
    );

    // Calculate totals only for High and Moderate
    const totalIuRequiring = yearData.reduce(
      (sum, d) => sum + d.iuRequiringPc,
      0,
    );
    const totalIuReceived = yearData.reduce(
      (sum, d) => sum + d.iuReceivedPc,
      0,
    );
    const totalCoverage =
      totalIuRequiring > 0 ? (totalIuReceived / totalIuRequiring) * 100 : 0;

    return {
      tableData: yearData,
      totals: {
        iuRequiringPc: totalIuRequiring,
        iuReceivedPc: totalIuReceived,
        geoCoveragePct: totalCoverage,
      },
    };
  }, [year]);

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-primary to-primary/80">
        <h2 className="text-xl font-bold text-white tracking-wide">
          Endemicity by IUs & Geographic Coverage
        </h2>
        <select
          value={year}
          onChange={(e) => setYear(Number(e.target.value))}
          className="px-4 py-2 bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg text-sm text-white font-medium focus:outline-none focus:ring-2 focus:ring-white/50 transition-all cursor-pointer hover:bg-white/30"
        >
          {years.map((y) => (
            <option key={y} value={y} className="text-gray-800">
              {y}
            </option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="p-6">
        <div className="overflow-hidden rounded-lg border border-gray-200">
          <table className="w-full">
            <thead>
              <tr className="bg-gradient-to-r from-gray-50 to-gray-100">
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider border-b-2 border-primary/20">
                  Endemicity
                </th>
                <th className="px-6 py-4 text-right text-sm font-bold text-gray-700 uppercase tracking-wider border-b-2 border-primary/20">
                  IU Requiring PC
                </th>
                <th className="px-6 py-4 text-right text-sm font-bold text-gray-700 uppercase tracking-wider border-b-2 border-primary/20">
                  IU Received PC
                </th>
                <th className="px-6 py-4 text-right text-sm font-bold text-gray-700 uppercase tracking-wider border-b-2 border-primary/20">
                  Coverage
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {tableData.map((row, index) => (
                <tr
                  key={row.endemicityLevel}
                  className={`group hover:bg-blue-50/50 transition-colors ${
                    index % 2 === 1 ? "bg-gray-50/50" : ""
                  }`}
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div
                        className="flex-shrink-0 w-3 h-3 rounded-full"
                        style={{ backgroundColor: row.colorHex }}
                      />
                      <span className="font-medium text-gray-800">
                        {row.endemicityLabel}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className="inline-block px-3 py-1 bg-blue-50 text-blue-700 font-semibold rounded-full text-sm">
                      {row.iuRequiringPc}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className="inline-block px-3 py-1 bg-green-50 text-green-700 font-semibold rounded-full text-sm">
                      {row.iuReceivedPc}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                        row.geoCoveragePct >= 90
                          ? "bg-emerald-50 text-emerald-700"
                          : row.geoCoveragePct >= 80
                            ? "bg-green-50 text-green-700"
                            : row.geoCoveragePct >= 50
                              ? "bg-amber-50 text-amber-700"
                              : "bg-red-50 text-red-700"
                      }`}
                    >
                      {row.geoCoveragePct.toFixed(2)}%
                    </span>
                  </td>
                </tr>
              ))}
              {/* Total Row */}
              <tr className="bg-gray-100 font-semibold">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex-shrink-0 w-3 h-3 rounded-full bg-primary" />
                    <span className="font-bold text-gray-900">Total</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-right">
                  <span className="inline-block px-3 py-1 bg-primary/10 text-primary font-bold rounded-full text-sm">
                    {totals.iuRequiringPc}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <span className="inline-block px-3 py-1 bg-primary/10 text-primary font-bold rounded-full text-sm">
                    {totals.iuReceivedPc}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <span className="inline-block px-3 py-1 bg-primary/10 text-primary font-bold rounded-full text-sm">
                    {totals.geoCoveragePct.toFixed(2)}%
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
