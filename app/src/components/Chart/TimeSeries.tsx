import React, { useState } from "react";
import { Line } from "react-chartjs-2";
import { XMarkIcon } from "@heroicons/react/24/outline";

import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";

ChartJS.register(
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  Filler
);

interface Props {
  data: {
    lst: { month: string; value: number | null }[];
    ndvi: { month: string; value: number | null }[];
  } | null;
}

const TimeSeries: React.FC<Props> = ({ data }) => {
  if (!data) {
    return (
      <div className="bg-neutral-900 p-4 rounded-lg mt-2 flex items-center justify-center h-full min-h-[17rem]">
        <span className="text-white text-sm animate-pulse">
          Loading time series...
        </span>
      </div>
    );
  }

  const labels = data.lst.map((d) => d.month);

  const chartData = {
    labels,
    datasets: [
      {
        label: "LST (°C)",
        data: data.lst.map((d) => d.value),
        borderColor: "red",
        backgroundColor: "rgba(255,0,0,0.2)",
        tension: 0.3,
        fill: false,
      },
      {
        label: "NDVI",
        data: data.ndvi.map((d) => d.value),
        borderColor: "green",
        backgroundColor: "rgba(0,255,0,0.2)",
        tension: 0.3,
        fill: false,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        ticks: {
          color: "#ffffff",
        },
        grid: {
          color: "rgba(255,255,255,0.1)",
        },
      },
      y: {
        ticks: {
          color: "#ffffff",
        },
        grid: {
          color: "rgba(255,255,255,0.1)",
        },
      },
    },
    plugins: {
      legend: {
        labels: {
          color: "#ffffff",
        },
      },
      tooltip: {
        mode: "index",
        intersect: false,
      },
    },
  };

  return (
    <div className="bg-neutral-900 p-4 rounded-lg mt-2">
      <div>
        <h3 className="text-white text-sm font-semibold mb-2">
          Time Series (Last 12 Months)
        </h3>
      </div>
      <div className="max-h-[13rem]">
        <Line
          data={chartData}
          options={chartOptions}
          style={{ width: "100%", height: "100%" }}
        />
      </div>
    </div>
  );
};

export default TimeSeries;
