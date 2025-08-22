import React from "react";
import { generateMonthOptions } from "../../utils";

interface Props {
  date: string;
  setDate: (date: string) => void;
  fetchTile: () => void;
}

const DateSelector: React.FC<Props> = ({ date, setDate, fetchTile }) => {
  const monthOptions = generateMonthOptions("2023-01", "2025-08");

  return (
    <div className="bg-neutral-900 border border-neutral-700 rounded-lg p-4 space-y-3">
      <h2 className="text-white font-semibold text-sm flex items-center gap-2">
        <svg
          className="w-4 h-4 text-white"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M8 7V3m8 4V3m-9 10h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
        Date Filter
      </h2>

      <div className="space-y-2 text-sm text-neutral-300">
        <label htmlFor="month">Select Month</label>
        <select
          id="month"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full mt-1 bg-neutral-800 text-white rounded px-2 py-1 border border-neutral-600"
        >
          {monthOptions.map((month) => (
            <option key={month} value={month}>
              {new Date(month + "-01").toLocaleString("default", {
                month: "long",
                year: "numeric",
              })}
            </option>
          ))}
        </select>
      </div>

      <button
        onClick={fetchTile}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded text-sm font-semibold"
      >
        Apply Filter
      </button>
    </div>
  );
};

export default DateSelector;
