import React, { useState, useMemo } from "react";
import { useAggregateData } from "../hooks/useAggregateData";

interface CoverageDataItem {
  year: number;
  targetPop: string;
  popReq: number;
  popTrg: number;
  popTreat: number;
  progCovPct: number | null;
  natCovPct: number | null;
}

interface CoverageDataTableProps {
  selectedYear?: number;
  country?: string;
  disease?: string;
  year?: number;
}

const years = [
  2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024,
];

const formatNumber = (num: number): string => {
  return num.toLocaleString();
};

export default function CoverageDataTable({
  selectedYear,
  country,
  disease,
}: CoverageDataTableProps) {
  const { data: coverageData, loading } = useAggregateData({
    country,
    disease,
    year: selectedYear,
  });

  const [year, setYear] = useState<number>(selectedYear || 2024);

  const tableData = useMemo(() => {
    const filterYear = year || 2024;

    const yearData = coverageData.filter((d) => d.year === filterYear);

    const sacData = yearData.find((d) => d.targetPop === "SAC");
    const adultData = yearData.find((d) => d.targetPop === "Adults");
    const totalData = yearData.find((d) => d.targetPop === "Total");

    return {
      popReq: {
        sac: sacData?.popReq || 0,
        adult: adultData?.popReq || 0,
        total: totalData?.popReq || 0,
      },
      popTrg: {
        sac: sacData?.popTrg || 0,
        adult: adultData?.popTrg || 0,
        total: totalData?.popTrg || 0,
      },
      popTreat: {
        sac: sacData?.popTreat || 0,
        adult: adultData?.popTreat || 0,
        total: totalData?.popTreat || 0,
      },
      progCovPct: {
        sac: sacData?.progCovPct,
        adult: adultData?.progCovPct,
      },
      natCovPct: {
        sac: sacData?.natCovPct,
        adult: adultData?.natCovPct,
      },
    };
  }, [year, coverageData]);

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 bg-primary">
        <h2 className="text-xl font-bold text-white tracking-wide">
          Key Statistics
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
                    Indicator
                  </th>
                  <th className="px-6 py-4 text-right text-sm font-bold text-gray-700 uppercase tracking-wider border-b-2 border-primary/20">
                    <span className="inline-flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                      SAC
                    </span>
                  </th>
                  <th className="px-6 py-4 text-right text-sm font-bold text-gray-700 uppercase tracking-wider border-b-2 border-primary/20">
                    <span className="inline-flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-green-500"></span>
                      Adult
                    </span>
                  </th>
                  <th className="px-6 py-4 text-right text-sm font-bold text-gray-700 uppercase tracking-wider border-b-2 border-primary/20">
                    <span className="inline-flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-purple-500"></span>
                      Total
                    </span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                <tr className="group hover:bg-blue-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
                        <svg
                          className="w-5 h-5 text-amber-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                          />
                        </svg>
                      </div>
                      <span className="font-medium text-gray-800">
                        Population living in UI requiring PC
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className="inline-block px-3 py-1 bg-blue-50 text-blue-700 font-semibold rounded-full text-sm">
                      {formatNumber(tableData.popReq.sac)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className="inline-block px-3 py-1 bg-green-50 text-green-700 font-semibold rounded-full text-sm">
                      {formatNumber(tableData.popReq.adult)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className="inline-block px-3 py-1 bg-purple-50 text-purple-700 font-semibold rounded-full text-sm">
                      {formatNumber(tableData.popReq.total)}
                    </span>
                  </td>
                </tr>
                <tr className="group hover:bg-blue-50/50 transition-colors bg-gray-50/50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                        <svg
                          className="w-5 h-5 text-blue-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      </div>
                      <span className="font-medium text-gray-800">
                        Population targeted with PC
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className="inline-block px-3 py-1 bg-blue-50 text-blue-700 font-semibold rounded-full text-sm">
                      {formatNumber(tableData.popTrg.sac)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className="inline-block px-3 py-1 bg-green-50 text-green-700 font-semibold rounded-full text-sm">
                      {formatNumber(tableData.popTrg.adult)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className="inline-block px-3 py-1 bg-purple-50 text-purple-700 font-semibold rounded-full text-sm">
                      {formatNumber(tableData.popTrg.total)}
                    </span>
                  </td>
                </tr>
                <tr className="group hover:bg-blue-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                        <svg
                          className="w-5 h-5 text-green-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                          />
                        </svg>
                      </div>
                      <span className="font-medium text-gray-800">
                        Population treated with PC
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className="inline-block px-3 py-1 bg-blue-50 text-blue-700 font-semibold rounded-full text-sm">
                      {formatNumber(tableData.popTreat.sac)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className="inline-block px-3 py-1 bg-green-50 text-green-700 font-semibold rounded-full text-sm">
                      {formatNumber(tableData.popTreat.adult)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className="inline-block px-3 py-1 bg-purple-50 text-purple-700 font-semibold rounded-full text-sm">
                      {formatNumber(tableData.popTreat.total)}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Coverage Details */}
          <div className="mt-4 space-y-2">
            <p className="text-sm text-gray-700">
              <span className="text-blue-600 font-semibold">
                Programme coverage:
              </span>{" "}
              <span className="font-semibold">
                {tableData.progCovPct.sac ?? "N/A"}%
              </span>{" "}
              of SAC and{" "}
              <span className="font-semibold">
                {tableData.progCovPct.adult ?? "N/A"}%
              </span>{" "}
              of adults targeted for PC were treated.
            </p>
            <p className="text-sm text-gray-700">
              <span className="text-amber-600 font-semibold">
                National coverage:
              </span>{" "}
              <span className="font-semibold">
                {tableData.natCovPct.sac ?? "N/A"}%
              </span>{" "}
              of SAC and{" "}
              <span className="font-semibold">
                {tableData.natCovPct.adult ?? "N/A"}%
              </span>{" "}
              of adults requiring PC were treated.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
