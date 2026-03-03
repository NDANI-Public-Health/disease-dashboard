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

const years = [
  2024, 2023, 2022, 2021, 2020, 2019, 2018, 2017, 2016, 2015, 2014,
];

export default function EndemicityTable({
  year: selectedYear,
  disease,
  country,
}: EndemicityTableProps) {
  const [year, setYear] = useState<number>(selectedYear || 2024);
  const {
    data: endemicityData,
    endemicityLevels,
    loading,
  } = useEndemicityData({
    year,
    disease,
    country,
  });

  const { tableData, totals } = useMemo(() => {
    // Filter by year and only include High and Moderate endemicity levels
    const filterYear = year || 2024;

    const yearData = endemicityData.filter(
      (d) =>
        d.year == filterYear &&
        (d.endemicityLevel == "High" || d.endemicityLevel == "Moderate"),
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
  }, [year, endemicityData]);

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
      {loading ? (
        <div className="flex items-center justify-center h-48">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : (
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
                    key={`${row.year}-${row.endemicityLevel}`}
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
      )}
    </div>
  );
}
