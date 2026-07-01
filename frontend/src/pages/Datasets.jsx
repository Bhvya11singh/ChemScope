import { useState } from "react";
import axios from "axios";
import Papa from "papaparse";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

import { Bar, Scatter } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8001";

function Datasets() {
  const [data, setData] = useState([]);
  const [xColumn, setXColumn] = useState("");
  const [yColumn, setYColumn] = useState("");
  const [pcaResults, setPcaResults] = useState(null);
  const [pcaLoading, setPcaLoading] = useState(false);
  const [selectedFileName, setSelectedFileName] = useState("No file chosen");
  const [status, setStatus] = useState({
    type: "idle",
    text: "Upload a CSV file to start exploring your dataset.",
  });

  const chartPalette = [
    "#2563eb",
    "#7c3aed",
    "#0f766e",
    "#dc2626",
    "#d97706",
    "#0891b2",
  ];

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setSelectedFileName(file.name);
    setPcaResults(null);
    setXColumn("");
    setYColumn("");
    setStatus({ type: "loading", text: `Reading ${file.name}...` });

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        setData(results.data || []);
        const numericColumns = getNumericColumnsFromRows(results.data || []);
        setStatus({
          type: numericColumns.length >= 2 ? "success" : "warning",
          text:
            numericColumns.length >= 2
              ? `${numericColumns.length} numeric columns detected. You can run PCA.`
              : "At least two numeric columns are needed for PCA.",
        });
      },
      error: (error) => {
        console.error(error);
        setStatus({ type: "error", text: "The file could not be parsed. Please try another CSV." });
      },
    });
  };

  const getNumericColumnsFromRows = (rows) => {
    if (!rows.length) return [];

    return Object.keys(rows[0]).filter((column) =>
      rows.every((row) => {
        const value = row[column];
        if (value === "" || value === null || value === undefined) return true;
        return !Number.isNaN(parseFloat(value));
      })
    );
  };

  const getNumericColumns = () => getNumericColumnsFromRows(data);

  const runPCA = async () => {
    if (data.length === 0) {
      setStatus({ type: "warning", text: "Please upload a dataset first." });
      return;
    }

    const numericColumns = getNumericColumns();

    if (numericColumns.length < 2) {
      setStatus({ type: "warning", text: "Please upload a dataset with at least two numeric columns." });
      return;
    }

    try {
      setPcaLoading(true);
      setStatus({ type: "loading", text: "Running PCA on the numeric data..." });

      const payload = data.map((row) => {
        const numericRow = {};

        numericColumns.forEach((column) => {
          const value = row[column];
          const parsed = value === "" || value === null || value === undefined ? NaN : parseFloat(value);
          numericRow[column] = Number.isNaN(parsed) ? null : parsed;
        });

        return numericRow;
      });

      const response = await axios.post(`${API_BASE_URL}/pca`, payload, {
        timeout: 20000,
        headers: { "Content-Type": "application/json" },
      });

      if (response.data?.error) {
        setPcaResults(null);
        setStatus({ type: "error", text: response.data.error });
        return;
      }

      setPcaResults(response.data);
      setStatus({
        type: "success",
        text: `PCA completed successfully for ${numericColumns.length} numeric columns.`,
      });
    } catch (error) {
      console.error("PCA Error:", error);
      setPcaResults(null);

      if (error.response?.data?.error) {
        setStatus({ type: "error", text: error.response.data.error });
      } else {
        setStatus({ type: "error", text: "The backend could not be reached. Please start the API server on port 8000." });
      }
    } finally {
      setPcaLoading(false);
    }
  };

  const computeStats = (column) => {
    const values = data
      .map((row) => parseFloat(row[column]))
      .filter((v) => !Number.isNaN(v));

    if (values.length === 0) return { mean: "-", min: "-", max: "-" };

    const mean = values.reduce((a, b) => a + b, 0) / values.length;

    return {
      mean: mean.toFixed(2),
      min: Math.min(...values).toFixed(2),
      max: Math.max(...values).toFixed(2),
    };
  };

  const createChartData = (column) => {
    const values = data
      .map((row) => parseFloat(row[column]))
      .filter((v) => !Number.isNaN(v));

    return {
      labels: values.map((_, index) => `Sample ${index + 1}`),
      datasets: [
        {
          label: column,
          data: values,
          backgroundColor: values.map((_, index) => `${chartPalette[index % chartPalette.length]}90`),
          borderColor: values.map((_, index) => chartPalette[index % chartPalette.length]),
          borderWidth: 2,
        },
      ],
    };
  };

  const createScatterData = () => {
    if (!xColumn || !yColumn) return null;

    const points = data
      .map((row) => ({
        x: parseFloat(row[xColumn]),
        y: parseFloat(row[yColumn]),
      }))
      .filter((point) => !Number.isNaN(point.x) && !Number.isNaN(point.y));

    return {
      datasets: [
        {
          label: `${yColumn} vs ${xColumn}`,
          data: points,
          pointRadius: 7,
          pointBackgroundColor: points.map((_, index) => chartPalette[index % chartPalette.length]),
          pointBorderColor: "#ffffff",
        },
      ],
    };
  };

  const correlation = (x, y) => {
    const n = x.length;
    if (n === 0) return 0;

    const meanX = x.reduce((a, b) => a + b, 0) / n;
    const meanY = y.reduce((a, b) => a + b, 0) / n;

    let numerator = 0;
    let denominatorX = 0;
    let denominatorY = 0;

    for (let i = 0; i < n; i++) {
      numerator += (x[i] - meanX) * (y[i] - meanY);
      denominatorX += Math.pow(x[i] - meanX, 2);
      denominatorY += Math.pow(y[i] - meanY, 2);
    }

    const denominator = Math.sqrt(denominatorX * denominatorY);
    return denominator === 0 ? 0 : numerator / denominator;
  };

  const getCorrelationMatrix = () => {
    const cols = getNumericColumns();

    return cols.map((col1) =>
      cols.map((col2) => {
        const x = data.map((row) => parseFloat(row[col1])).filter((v) => !Number.isNaN(v));
        const y = data.map((row) => parseFloat(row[col2])).filter((v) => !Number.isNaN(v));
        return Number(correlation(x, y).toFixed(2));
      })
    );
  };

  return (
    <div className="container-fluid">
      <div className="hero-banner mb-4">
        <h1>Dataset Analytics Lab</h1>
        <p>Upload a CSV file, inspect the data, and run PCA with a clearer workflow.</p>
      </div>

      <div className="workspace-card upload-card">
        <div className="d-flex justify-content-between align-items-start flex-wrap gap-3">
          <div>
            <h3>Upload Dataset</h3>
            <p className="mb-0 text-muted">Drop in a CSV and let the app prepare it for PCA and visualization.</p>
          </div>
          <span className={`status-pill ${status.type}`}>{status.text}</span>
        </div>

        <label className="upload-zone mt-3">
          <input type="file" accept=".csv" onChange={handleFileUpload} />
          <span className="upload-label">Choose CSV file</span>
          <span className="upload-filename">{selectedFileName}</span>
        </label>

        <div className="d-flex flex-wrap align-items-center gap-3 mt-3">
          <button className="btn btn-primary" onClick={runPCA} disabled={pcaLoading || data.length === 0}>
            {pcaLoading ? "Running PCA..." : "Run PCA"}
          </button>
          <span className="text-muted small">
            Rows: {data.length} • Numeric columns: {getNumericColumns().length}
          </span>
        </div>
      </div>

      {data.length > 0 && (
        <div className="descriptor-card mt-4">
          <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-3">
            <h3 className="mb-0">Dataset Preview</h3>
            <div className="d-flex flex-wrap gap-2">
              <span className="metric-pill">Rows: {data.length}</span>
              <span className="metric-pill">Columns: {Object.keys(data[0]).length}</span>
            </div>
          </div>

          <div className="table-responsive">
            <table className="table table-dark table-hover align-middle">
              <thead>
                <tr>
                  {Object.keys(data[0]).map((col) => (
                    <th key={col}>{col}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.slice(0, 10).map((row, idx) => (
                  <tr key={idx}>
                    {Object.values(row).map((value, i) => (
                      <td key={i}>{value}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {data.length > 0 && (
        <div className="descriptor-card mt-4">
          <h3>Summary Statistics</h3>
          <div className="row">
            {getNumericColumns().map((column) => {
              const stats = computeStats(column);

              return (
                <div className="col-md-4 mb-3" key={column}>
                  <div className="property-card">
                    <h5>{column}</h5>
                    <p>Mean: {stats.mean}</p>
                    <p>Min: {stats.min}</p>
                    <p>Max: {stats.max}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {data.length > 0 && (
        <div className="descriptor-card mt-4">
          <h3>Scatter Plot Explorer</h3>
          <div className="row mb-4">
            <div className="col-md-6">
              <select className="form-select" value={xColumn} onChange={(e) => setXColumn(e.target.value)}>
                <option value="">Select X-Axis</option>
                {getNumericColumns().map((col) => (
                  <option key={col} value={col}>
                    {col}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-md-6">
              <select className="form-select" value={yColumn} onChange={(e) => setYColumn(e.target.value)}>
                <option value="">Select Y-Axis</option>
                {getNumericColumns().map((col) => (
                  <option key={col} value={col}>
                    {col}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {xColumn && yColumn && <Scatter data={createScatterData()} options={{ responsive: true, maintainAspectRatio: false }} />}
        </div>
      )}

      {pcaResults?.points && (
        <div className="descriptor-card mt-4">
          <h3>PCA Explorer</h3>
          <div className="mb-3">
            <span className="metric-pill">PC1 Variance: {(pcaResults.explained_variance[0] * 100).toFixed(2)}%</span>
            <span className="metric-pill">PC2 Variance: {(pcaResults.explained_variance[1] * 100).toFixed(2)}%</span>
          </div>

          <Scatter
            data={{
              datasets: [
                {
                  label: "PCA",
                  data: pcaResults.points.map((point) => ({ x: point.pc1, y: point.pc2 })),
                  pointRadius: 7,
                  pointBackgroundColor: pcaResults.points.map((_, index) => chartPalette[index % chartPalette.length]),
                },
              ],
            }}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              scales: {
                x: { title: { display: true, text: "PC1" } },
                y: { title: { display: true, text: "PC2" } },
              },
            }}
          />
        </div>
      )}

      {data.length > 0 &&
        getNumericColumns().map((column) => (
          <div className="descriptor-card mt-4" key={column}>
            <h3>{column} Distribution</h3>
            <Bar data={createChartData(column)} options={{ responsive: true, maintainAspectRatio: false }} />
          </div>
        ))}
    </div>
  );
}

export default Datasets;