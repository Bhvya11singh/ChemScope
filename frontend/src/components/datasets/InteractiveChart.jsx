import { Bar } from "react-chartjs-2";

function InteractiveChart({ data, options }) {
  return (
    <div className="chart-container">
      <Bar
        data={data}
        options={options}
      />
    </div>
  );
}

export default InteractiveChart;