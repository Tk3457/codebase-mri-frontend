import React, { useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [repoUrl, setRepoUrl] = useState("");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async () => {
    if (!repoUrl) return alert("Please enter a GitHub URL");
    setLoading(true);
    try {
      const res = await axios.post("http://localhost:5000/analyze", { repoUrl });
      setData(res.data);
    } catch (err) {
      alert("Error connecting to server. Make sure your backend is running!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">
      {/* SIDEBAR */}
      <div className="sidebar">
        <div className="brand">
          <h2>⚙️ Codebase MRI</h2>
          <p className="sub">Intelligence Engine v1.0</p>
        </div>
        
        <div className="section">
          <p className="title">WORKSPACE</p>
          <p className={`item ${!data ? 'active' : ''}`} onClick={() => setData(null)}>Dashboard</p>
          <p className="item">Analysis History</p>
          <p className="item">Saved Reports</p>
        </div>

        <div className="section">
          <p className="title">RESOURCES</p>
          <p className="item">Documentation</p>
          <p className="item">API Reference</p>
        </div>

        <div className="status"><span className="dot"></span> All systems operational</div>
      </div>

      {/* MAIN CONTENT */}
      <div className="main">
        <header className="hero-search">
          <div className="search-container">
            <label>SCAN REPOSITORY</label>
            <div className="input-group">
              <input 
                value={repoUrl} 
                onChange={(e) => setRepoUrl(e.target.value)} 
                placeholder="https://github.com/facebook/react" 
              />
              <button onClick={handleAnalyze} disabled={loading}>
                {loading ? <div className="spinner"></div> : "Start Scan"}
              </button>
            </div>
          </div>
        </header>

        {!data ? (
          /* INITIAL EMPTY STATE */
          <div className="dashboard-placeholder">
            <div className="welcome-text">
              <h1>Ready for a checkup?</h1>
              <p>Enter a repository URL above to perform a deep-tissue scan of dependencies and security risks.</p>
            </div>
            
            <div className="grid-placeholder">
              <div className="info-box">
                <h4>Dependency Audit</h4>
                <p>We check for package bloat and supply chain vulnerabilities.</p>
              </div>
              <div className="info-box">
                <h4>Security Heuristics</h4>
                <p>Scanning for exposed .env files and hardcoded credentials.</p>
              </div>
              <div className="info-box">
                <h4>Community Trust</h4>
                <p>Analyzing stars and maintenance frequency for reliability.</p>
              </div>
            </div>
          </div>
        ) : (
          /* RESULTS VIEW */
          <div className="results-view animate-up">
            <div className="stats-grid">
              <div className="stat-card">
                <p className="stat-label">HEALTH SCORE</p>
                <h2 className="stat-value">{data.riskScore}/100</h2>
                <div className="progress-bar"><div className="fill" style={{width: `${data.riskScore}%`}}></div></div>
              </div>
              <div className="stat-card">
                <p className="stat-label">DEPENDENCIES</p>
                <h2 className="stat-value">{data.dependencies}</h2>
                <p className="stat-subtext">Packages identified</p>
              </div>
              <div className="stat-card">
                <p className="stat-label">RISK LEVEL</p>
                <h2 className={`stat-value risk-${data.risk.toLowerCase()}`}>{data.risk}</h2>
                <p className="stat-subtext">Security Classification</p>
              </div>
            </div>

            <div className="summary-card">
              <div className="summary-header">
                <h3>Analysis Summary</h3>
                <span className="badge">Verified Scan</span>
              </div>
              <p className="summary-text">{data.summary}</p>
              <div className="reasons-list">
                {data.reasons?.map((r, i) => (
                  <div key={i} className="reason-item">
                    <span className="icon">→</span> {r}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;