import React, { useState } from "react";
import axios from "axios";
import "./App.css";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

function App() {
  const [repoUrl, setRepoUrl] = useState("");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async () => {
    if (!repoUrl) return alert("Enter repo URL");

    try {
      setLoading(true);

      // ✅ CHANGED THIS LINE
      const res = await axios.post(
        "https://codebase-mri-backend.onrender.com/analyze",
        { repoUrl }
      );

      setData(res.data);
    } catch (err) {
      alert(err.response?.data?.error || "Backend error");
    } finally {
      setLoading(false);
    }
  };

  const chartData =
    data?.files?.slice(0, 12).map((f) => ({
      name: f.name.split("/").pop(),
      lines: f.lines,
    })) || [];

  return (
    <div className="app">
      <div className="sidebar">
        <h2>🧠 MRI</h2>
        <p>Dashboard</p>
        <p>Analysis</p>
        <p>Settings</p>
      </div>

      <div className="main">
        <div className="topbar">
          <input
            placeholder="Paste GitHub repo..."
            value={repoUrl}
            onChange={(e) => setRepoUrl(e.target.value)}
          />
          <button onClick={handleAnalyze}>
            {loading ? "Running..." : "Run"}
          </button>
        </div>

        {!data ? (
          <div className="empty">
            <h1>Analyze a Repository</h1>
            <p>Paste a GitHub URL to begin</p>
          </div>
        ) : (
          <>
            <div className="cards">
              <div className="card">
                <h2>{data.riskScore}/100</h2>
                <p>Risk Score</p>
              </div>

              <div className="card">
                <h2>{data.dependencies}</h2>
                <p>Dependencies</p>
              </div>

              <div className="card">
                <h2
                  style={{
                    color:
                      data.risk === "High"
                        ? "#ff4d4d"
                        : data.risk === "Medium"
                        ? "#f59e0b"
                        : "#10b981",
                  }}
                >
                  {data.risk}
                </h2>
                <p>Risk Level</p>
              </div>
            </div>

            <div className="chart-box">
              <h3>File Distribution</h3>

              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
                  <XAxis dataKey="name" hide />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="lines" fill="#6366f1" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="card">
              <h3>Summary</h3>
              <p>{data.summary || "No summary available"}</p>
            </div>

            <div className="card">
              <h3>Reasons</h3>
              {data.reasons?.length > 0 ? (
                data.reasons.map((r, i) => <p key={i}>• {r}</p>)
              ) : (
                <p>No issues found</p>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default App;