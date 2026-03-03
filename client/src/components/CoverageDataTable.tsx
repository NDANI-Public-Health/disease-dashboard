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

const coverageData: CoverageDataItem[] = [
  {
    year: 2014,
    targetPop: "Adults",
    popReq: 7984386,
    popTrg: 0,
    popTreat: 0,
    progCovPct: null,
    natCovPct: 0,
  },
  {
    year: 2014,
    targetPop: "PreSAC",
    popReq: 0,
    popTrg: 0,
    popTreat: 0,
    progCovPct: null,
    natCovPct: null,
  },
  {
    year: 2014,
    targetPop: "SAC",
    popReq: 15251603,
    popTrg: 3657431,
    popTreat: 2539007,
    progCovPct: 69.42,
    natCovPct: 16.65,
  },
  {
    year: 2014,
    targetPop: "Total",
    popReq: 23235989,
    popTrg: 3657431,
    popTreat: 2539007,
    progCovPct: 69.42,
    natCovPct: 10.93,
  },
  {
    year: 2015,
    targetPop: "Adults",
    popReq: 8406051,
    popTrg: 2509540,
    popTreat: 621506,
    progCovPct: 24.77,
    natCovPct: 7.39,
  },
  {
    year: 2015,
    targetPop: "PreSAC",
    popReq: 0,
    popTrg: 0,
    popTreat: 0,
    progCovPct: null,
    natCovPct: null,
  },
  {
    year: 2015,
    targetPop: "SAC",
    popReq: 15709346,
    popTrg: 14860937,
    popTreat: 4839274,
    progCovPct: 32.56,
    natCovPct: 30.81,
  },
  {
    year: 2015,
    targetPop: "Total",
    popReq: 24115397,
    popTrg: 14860937,
    popTreat: 5460780,
    progCovPct: 36.75,
    natCovPct: 22.64,
  },
  {
    year: 2016,
    targetPop: "Adults",
    popReq: 8645919,
    popTrg: 995952,
    popTreat: 273748,
    progCovPct: 27.49,
    natCovPct: 3.17,
  },
  {
    year: 2016,
    targetPop: "PreSAC",
    popReq: 0,
    popTrg: 0,
    popTreat: 0,
    progCovPct: null,
    natCovPct: null,
  },
  {
    year: 2016,
    targetPop: "SAC",
    popReq: 16116023,
    popTrg: 13527365,
    popTreat: 4925674,
    progCovPct: 36.41,
    natCovPct: 30.56,
  },
  {
    year: 2016,
    targetPop: "Total",
    popReq: 24761942,
    popTrg: 14523317,
    popTreat: 5199422,
    progCovPct: 35.8,
    natCovPct: 21,
  },
  {
    year: 2017,
    targetPop: "Adults",
    popReq: 8830751,
    popTrg: 3410893,
    popTreat: 762146,
    progCovPct: 22.34,
    natCovPct: 8.63,
  },
  {
    year: 2017,
    targetPop: "PreSAC",
    popReq: 0,
    popTrg: 0,
    popTreat: 0,
    progCovPct: null,
    natCovPct: null,
  },
  {
    year: 2017,
    targetPop: "SAC",
    popReq: 16502791,
    popTrg: 15129302,
    popTreat: 6231125,
    progCovPct: 41.19,
    natCovPct: 37.76,
  },
  {
    year: 2017,
    targetPop: "Total",
    popReq: 25333542,
    popTrg: 18410280,
    popTreat: 6993271,
    progCovPct: 37.99,
    natCovPct: 27.6,
  },
  {
    year: 2018,
    targetPop: "Adults",
    popReq: 8435625,
    popTrg: 243383,
    popTreat: 189167,
    progCovPct: 77.72,
    natCovPct: 2.24,
  },
  {
    year: 2018,
    targetPop: "PreSAC",
    popReq: 0,
    popTrg: 0,
    popTreat: 0,
    progCovPct: null,
    natCovPct: null,
  },
  {
    year: 2018,
    targetPop: "SAC",
    popReq: 16635311,
    popTrg: 16600480,
    popTreat: 6778805,
    progCovPct: 40.83,
    natCovPct: 40.75,
  },
  {
    year: 2018,
    targetPop: "Total",
    popReq: 25070936,
    popTrg: 16843863,
    popTreat: 6967972,
    progCovPct: 41.37,
    natCovPct: 27.79,
  },
  {
    year: 2019,
    targetPop: "Adults",
    popReq: 8678278,
    popTrg: 5337205,
    popTreat: 3587457,
    progCovPct: 67.22,
    natCovPct: 41.34,
  },
  {
    year: 2019,
    targetPop: "PreSAC",
    popReq: 0,
    popTrg: 0,
    popTreat: 0,
    progCovPct: null,
    natCovPct: null,
  },
  {
    year: 2019,
    targetPop: "SAC",
    popReq: 17065755,
    popTrg: 25384545,
    popTreat: 10406234,
    progCovPct: 40.99,
    natCovPct: 60.98,
  },
  {
    year: 2019,
    targetPop: "Total",
    popReq: 25744033,
    popTrg: 26620496,
    popTreat: 13993691,
    progCovPct: 52.57,
    natCovPct: 54.36,
  },
  {
    year: 2020,
    targetPop: "Adults",
    popReq: 8845765,
    popTrg: 8077966,
    popTreat: 6100961,
    progCovPct: 75.53,
    natCovPct: 68.97,
  },
  {
    year: 2020,
    targetPop: "PreSAC",
    popReq: 0,
    popTrg: 0,
    popTreat: 0,
    progCovPct: null,
    natCovPct: null,
  },
  {
    year: 2020,
    targetPop: "SAC",
    popReq: 17444158,
    popTrg: 9687139,
    popTreat: 9423502,
    progCovPct: 97.28,
    natCovPct: 54.02,
  },
  {
    year: 2020,
    targetPop: "Total",
    popReq: 26289923,
    popTrg: 17765115,
    popTreat: 15524463,
    progCovPct: 87.39,
    natCovPct: 59.05,
  },
  {
    year: 2021,
    targetPop: "Adults",
    popReq: 9074888,
    popTrg: 1837782,
    popTreat: 315026,
    progCovPct: 17.14,
    natCovPct: 3.47,
  },
  {
    year: 2021,
    targetPop: "PreSAC",
    popReq: 0,
    popTrg: 0,
    popTreat: 0,
    progCovPct: null,
    natCovPct: null,
  },
  {
    year: 2021,
    targetPop: "SAC",
    popReq: 18284721,
    popTrg: 1860217,
    popTreat: 1084314,
    progCovPct: 58.29,
    natCovPct: 5.93,
  },
  {
    year: 2021,
    targetPop: "Total",
    popReq: 27359609,
    popTrg: 3697999,
    popTreat: 1399340,
    progCovPct: 37.84,
    natCovPct: 5.11,
  },
  {
    year: 2022,
    targetPop: "Adults",
    popReq: 23348602,
    popTrg: 1899293,
    popTreat: 1896809,
    progCovPct: 99.87,
    natCovPct: 8.12,
  },
  {
    year: 2022,
    targetPop: "PreSAC",
    popReq: 0,
    popTrg: 0,
    popTreat: 0,
    progCovPct: null,
    natCovPct: null,
  },
  {
    year: 2022,
    targetPop: "SAC",
    popReq: 25838469,
    popTrg: 6169657,
    popTreat: 3243436,
    progCovPct: 52.57,
    natCovPct: 12.55,
  },
  {
    year: 2022,
    targetPop: "Total",
    popReq: 49187071,
    popTrg: 8068950,
    popTreat: 5140245,
    progCovPct: 63.7,
    natCovPct: 10.45,
  },
  {
    year: 2023,
    targetPop: "Adults",
    popReq: 22290204,
    popTrg: 1576500,
    popTreat: 934379,
    progCovPct: 59.27,
    natCovPct: 4.19,
  },
  {
    year: 2023,
    targetPop: "PreSAC",
    popReq: 0,
    popTrg: 0,
    popTreat: 0,
    progCovPct: null,
    natCovPct: null,
  },
  {
    year: 2023,
    targetPop: "SAC",
    popReq: 17714682,
    popTrg: 18197924,
    popTreat: 12426891,
    progCovPct: 68.29,
    natCovPct: 70.15,
  },
  {
    year: 2023,
    targetPop: "Total",
    popReq: 40004949,
    popTrg: 19774482,
    popTreat: 13361270,
    progCovPct: 67.57,
    natCovPct: 33.4,
  },
  {
    year: 2024,
    targetPop: "Adults",
    popReq: 12455854,
    popTrg: 1354987,
    popTreat: 331521,
    progCovPct: 24.47,
    natCovPct: 2.66,
  },
  {
    year: 2024,
    targetPop: "PreSAC",
    popReq: 11341983,
    popTrg: 0,
    popTreat: 0,
    progCovPct: null,
    natCovPct: 0,
  },
  {
    year: 2024,
    targetPop: "SAC",
    popReq: 12133997,
    popTrg: 18734819,
    popTreat: 9454230,
    progCovPct: 50.46,
    natCovPct: 77.92,
  },
  {
    year: 2024,
    targetPop: "Total",
    popReq: 24590238,
    popTrg: 20089806,
    popTreat: 9785751,
    progCovPct: 48.71,
    natCovPct: 39.8,
  },
];

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
  //   const { data: coverageData } = useAggregateData({
  //     country,
  //     disease,
  //     year: selectedYear,
  //   });
  const [year, setYear] = useState<number>(selectedYear || 2024);

  const tableData = useMemo(() => {
    const yearData = coverageData.filter((d) => d.year === year);
    console.log("Filtered coverage data for year", year, yearData);

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
  }, [year]);

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

      {/* Table */}
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
    </div>
  );
}
