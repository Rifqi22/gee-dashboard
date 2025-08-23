import React from "react";
import { generateMonthOptions } from "../../utils";
import { CalendarDaysIcon } from "@heroicons/react/24/outline";

interface Props {
  startDate: string;
  endDate: string;
  setStartDate: (date: string) => void;
  setEndDate: (date: string) => void;
  applyDateFilter: () => void;
}

const DateSelector: React.FC<Props> = ({
  startDate,
  endDate,
  setStartDate,
  setEndDate,
  applyDateFilter,
}) => {
  const monthOptions = generateMonthOptions("2023-01", "2025-08");

  return (
    <div className="bg-neutral-900 border border-neutral-700 rounded-lg p-4 space-y-3">
      <h2 className="text-white font-semibold text-sm flex items-center gap-2">
        <CalendarDaysIcon className="w-4 h-4 text-white" />
        Date Filter
      </h2>
      <hr className="text-neutral-500" />

      <div className="space-y-2 text-sm flex flex-col text-neutral-300">
        <label className="text-start">Start Month</label>
        <select
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
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

        <label className="text-start">End Month</label>
        <select
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
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
        onClick={applyDateFilter}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 mt-2 rounded text-sm font-semibold"
      >
        Apply Filter
      </button>
    </div>
  );
};

export default DateSelector;
