import React, { useMemo } from "react";
import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { useSupplyData } from "../hooks/useSupplyData";

interface CaseDelaysChartProps {
  country?: string;
  disease?: string;
  year?: number;
}

export const CaseDelaysChart: React.FC<CaseDelaysChartProps> = ({
  country,
  disease,
  year,
}) => {
  const { data, loading, error } = useSupplyData({ country, disease, year });

  const chartData = useMemo(() => {
    if (!data || data.length === 0) {
      return { categories: [], values: [] };
    }

    // Sort by year
    const sortedData = [...data].sort((a, b) => a.year - b.year);

    const categories: string[] = sortedData.map((item) => item.year.toString());
    const values: number[] = sortedData.map((item) => item.deliveryDelayDays);

    return { categories, values };
  }, [data]);

  const options: ApexOptions = {
    chart: {
      type: "bar",
      toolbar: {
        show: true,
      },
      background: "#ffffff",
    },
    title: {
      text: "Delays in Delivery of PZQ\nScheduled MDA Date vs. Actual Delivery Date",
      align: "center",
      style: {
        fontSize: "16px",
        fontWeight: "bold",
        color: "#1a365d",
      },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "60%",
        borderRadius: 4,
        colors: {
          ranges: [
            {
              from: -1000,
              to: 0,
              color: "#2e7d32", // Green for negative (early)
            },
            {
              from: 0,
              to: 1000,
              color: "#d32f2f", // Red for positive (late)
            },
          ],
        },
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      show: true,
      width: 2,
      colors: ["transparent"],
    },
    xaxis: {
      categories: chartData.categories,
      title: {
        text: "Year",
      },
      axisBorder: {
        show: true,
        color: "#78909c",
      },
      axisTicks: {
        show: true,
        color: "#78909c",
      },
    },
    yaxis: {
      title: {
        text: "Delivery Delay (Days)",
      },
      labels: {
        formatter: (value: number) => {
          return value.toFixed(0);
        },
      },
    },
    annotations: {
      yaxis: [
        {
          y: 0,
          borderColor: "#455a64",
          borderWidth: 2,
          strokeDashArray: 0,
        },
      ],
    },
    tooltip: {
      y: {
        formatter: (value: number) => {
          if (value < 0) {
            return Math.abs(value) + " days early";
          }
          return value + " days late";
        },
      },
    },
    legend: {
      show: false,
    },
    grid: {
      borderColor: "#e0e0e0",
      strokeDashArray: 4,
      xaxis: {
        lines: {
          show: false,
        },
      },
      yaxis: {
        lines: {
          show: true,
        },
      },
    },
    fill: {
      opacity: 1,
    },
  };

  const series = [
    {
      name: "Delivery Delay",
      data: chartData.values,
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64 text-red-500">
        <p>Error loading data: {error}</p>
      </div>
    );
  }

  if (chartData.categories.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        <p>No supply data available</p>
      </div>
    );
  }

  return (
    <div className="w-full m-4">
      <Chart options={options} series={series} type="bar" height={550} />
    </div>
  );
};

export default CaseDelaysChart;
