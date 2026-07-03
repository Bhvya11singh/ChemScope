import { Scatter } from "react-chartjs-2";

function PCAChart({ data, options }) {
  return (
    <div className="chart-container">
      <Scatter
        data={data}
        options={options}
      />
    </div>
  );
}

export default PCAChart;