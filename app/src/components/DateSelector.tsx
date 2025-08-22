import React from "react";

interface Props {
  date: string;
  setDate: (date: string) => void;
  fetchTile: () => void;
}

const DateSelector: React.FC<Props> = ({ date, setDate, fetchTile }) => {
  return (
    <div style={{ position: "absolute", zIndex: 1000, padding: 10 }}>
      <label>
        Select Month (YYYY-MM):
        <input
          type="month"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          style={{ marginLeft: 10 }}
        />
      </label>
      <button onClick={fetchTile} style={{ marginLeft: 10 }}>
        Update
      </button>
    </div>
  );
};

export default DateSelector;
