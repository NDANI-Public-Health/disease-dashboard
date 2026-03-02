import React from "react";

const years = [
  2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025, 2026,
];

const DemographicsTable = () => {
  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      {/* Header with year selector - primary color */}
      <div className="flex items-center justify-between p-2 bg-primary text-white">
        <h2 className="text-lg font-semibold">Key statistics for</h2>
        <select className="px-3 py-2 border border-blue-400 rounded-md text-sm bg-yellow-500 text-white focus:outline-none focus:ring-2 focus:ring-blue-300">
          {years.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
      </div>
      {/* Two column layout with vertical divider */}
      <div className="flex">
        {/* Left column */}
        <div className="flex-1 p-6">
          {/* Population living in IUs requiring PC */}
          <div className="mb-6">
            <p className="font-semibold text-gray-700 mb-2">
              Population living in IUs requiring PC:
            </p>
            <div className="flex flex-wrap gap-4 text-sm text-gray-600">
              <span>
                <span className="font-medium">{"12,133,997"}</span> SAC
              </span>
              <span className="text-gray-400">|</span>
              <span>
                <span className="font-medium">{"12,455,854 "}</span> Adults
              </span>
            </div>
            <p className="text-sm mt-2">
              {"103"} IUs in total | {"112"} IUs high prevalence & {"316"} IUs
              moderate prevalence & {"44"} IUs low prevalence
            </p>
          </div>

          {/* Population treated with PC */}
          <div>
            <p className="font-semibold text-gray-700 mb-2">
              Population treated with PC:
            </p>
            <div className="flex flex-wrap gap-4 text-sm text-gray-600">
              <span>
                <span className="font-medium">{"9,454,230"}</span> SAC
              </span>
              <span className="text-gray-400">|</span>
              <span>
                <span className="font-medium ">{"331,521 "}</span> Adults
              </span>
            </div>
            <p className="text-sm text-gray-600 mt-2">
              {"51"} IUs achieved effective coverage
            </p>
          </div>
        </div>

        {/* Vertical divider */}
        <div className="w-px bg-gray-200 self-stretch m-2"></div>

        {/* Right column */}
        <div className="flex-1 p-6">
          {/* Population targeted for PC */}
          <div>
            <p className="font-semibold text-gray-700 mb-2">
              Population targeted for PC:
            </p>
            <div className="flex flex-wrap gap-4 text-sm text-gray-600">
              <span>
                <span className="font-medium ">{"18,734,819 "}</span> SAC
              </span>
              <span className="text-gray-400">|</span>
              <span>
                <span className="font-medium ">{"1,354,987"}</span> Adults
              </span>
            </div>
            <p className="text-sm text-gray-600 mt-2">{"63"} IUs targeted</p>
          </div>
        </div>
      </div>

      {/* Bottom section with padding */}
      <div className="px-4 pb-6">
        <hr className="border-gray-200" />
        <h3 className="font-bold text-gray-800 mb-2">Drug regimen</h3>
        <p className="text-sm  mb-4">PZQ in {"69"} IUs</p>

        <h3 className="font-bold text-gray-800 mb-2">Coverage indicators</h3>
        <p className="text-sm text-gray-600">
          Geographic coverage: <span className="font-semibold">{"62%"}</span> of
          IUs requiring PC
        </p>
        <p className="text-sm text-gray-600">
          Programme coverage: <span className="font-semibold">{"50.5%"}</span>{" "}
          of SAC and <span className="font-semibold">{"24.5%"}</span> of Adults
          targeted for PC were treated
        </p>
        <p className="text-sm text-gray-600">
          National coverage: <span className="font-semibold">{"77.9%"}</span> of
          SAC and <span className="font-semibold">{"2.7%"}</span> of Adults
          requiring PC in the country were treated
        </p>
      </div>
    </div>
  );
};

export default DemographicsTable;
