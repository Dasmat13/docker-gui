import React, { useEffect, useState } from "react";

const STATUS_COLORS = {
  running: "#198754", // Bootstrap success green
  exited: "#dc3545", // Bootstrap danger red
  paused: "#ffc107", // Bootstrap warning yellow
  default: "#6c757d", // Bootstrap secondary gray
};

function getStatusColor(status) {
  if (!status) return STATUS_COLORS.default;
  const s = status.toLowerCase();
  if (s.includes("up")) return STATUS_COLORS.running;
  if (s.includes("exited")) return STATUS_COLORS.exited;
  if (s.includes("paused")) return STATUS_COLORS.paused;
  return STATUS_COLORS.default;
}

function cleanName(name) {
  return name.startsWith("/") ? name.slice(1) : name;
}

export default function App() {
  const [containers, setContainers] = useState([]);
  const [logs, setLogs] = useState("");
  const [selectedId, setSelectedId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [removingId, setRemovingId] = useState(null);
  const [error, setError] = useState("");
  const [loadingLogsId, setLoadingLogsId] = useState(null);

  async function fetchContainers() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("http://localhost:3001/api/containers");
      if (!res.ok) throw new Error("Failed to fetch containers");
      const data = await res.json();
      setContainers(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchContainers();
  }, []);

  async function startContainer(id) {
    setError("");
    try {
      await fetch(`http://localhost:3001/api/containers/${id}/start`, { method: "POST" });
      fetchContainers();
    } catch {
      setError("Failed to start container");
    }
  }

  async function stopContainer(id) {
    setError("");
    try {
      await fetch(`http://localhost:3001/api/containers/${id}/stop`, { method: "POST" });
      fetchContainers();
    } catch {
      setError("Failed to stop container");
    }
  }

  async function removeContainer(id) {
    const confirmed = window.confirm("Are you sure you want to remove this container?");
    if (!confirmed) return;
    setRemovingId(id);
    setError("");
    try {
      await fetch(`http://localhost:3001/api/containers/${id}`, { method: "DELETE" });
      if (selectedId === id) setSelectedId(null);
      fetchContainers();
    } catch {
      setError("Failed to remove container");
    } finally {
      setRemovingId(null);
    }
  }

  async function fetchLogs(id) {
    setSelectedId(id);
    setError("");
    setLoadingLogsId(id);
    setLogs("Loading logs...");
    try {
      const res = await fetch(`http://localhost:3001/api/containers/${id}/logs`);
      if (!res.ok) throw new Error("Failed to fetch logs");
      const text = await res.text();
      setLogs(text || "(No logs available)");
    } catch (err) {
      setLogs("");
      setError(err.message);
    } finally {
      setLoadingLogsId(null);
    }
  }

  const selectedContainer = containers.find((c) => c.Id === selectedId);
  const selectedName = selectedContainer
    ? cleanName(selectedContainer.Names?.[0] || "Unknown")
    : "";

  return (
    <div style={styles.page}>
      <header style={styles.header}>
        <h1 style={styles.logo}>Docker Container Manager</h1>
        <button onClick={fetchContainers} style={styles.refreshBtn} aria-label="Refresh containers">
          🔄 Refresh
        </button>
      </header>

      {error && <div style={styles.error}>{error}</div>}

      {loading ? (
        <div style={styles.loading}>Loading containers...</div>
      ) : (
        <main>
          {containers.length === 0 ? (
            <p style={styles.noContainers}>No containers found.</p>
          ) : (
            <div style={styles.containerGrid}>
              {containers.map((c) => {
                const name = cleanName(c.Names?.[0] || "Unknown");
                const statusColor = getStatusColor(c.Status);
                const isRunning = c.State === "running";

                return (
                  <article key={c.Id} style={styles.card}>
                    <header style={styles.cardHeader}>
                      <h2 style={styles.containerName} title={name}>
                        {name}
                      </h2>
                      <span
                        style={{
                          ...styles.statusBadge,
                          backgroundColor: statusColor,
                        }}
                        title={c.Status}
                      >
                        {c.Status}
                      </span>
                    </header>

                    <p style={styles.imageText} title={c.Image}>
                      Image: <code>{c.Image}</code>
                    </p>

                    <div style={styles.buttonGroup}>
                      <button
                        onClick={() => startContainer(c.Id)}
                        disabled={isRunning}
                        style={isRunning ? styles.btnDisabled : styles.btnPrimary}
                        title={isRunning ? "Container already running" : "Start container"}
                      >
                        Start
                      </button>
                      <button
                        onClick={() => stopContainer(c.Id)}
                        disabled={!isRunning}
                        style={!isRunning ? styles.btnDisabled : styles.btnWarning}
                        title={!isRunning ? "Container not running" : "Stop container"}
                      >
                        Stop
                      </button>
                      <button
                        onClick={() => removeContainer(c.Id)}
                        disabled={removingId === c.Id}
                        style={styles.btnDanger}
                        title="Remove container"
                      >
                        {removingId === c.Id ? "Removing..." : "Remove"}
                      </button>
                      <button
                        onClick={() => fetchLogs(c.Id)}
                        disabled={loadingLogsId === c.Id}
                        style={styles.btnInfo}
                        title="View logs"
                      >
                        {loadingLogsId === c.Id ? "Loading..." : "Logs"}
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </main>
      )}

      {selectedId && (
        <section style={styles.logsPanel}>
          <div style={styles.logsHeader}>
            <h2>Logs for {selectedName}</h2>
            <button
              onClick={() => setSelectedId(null)}
              style={styles.closeLogsBtn}
              aria-label="Close logs panel"
            >
              ✖
            </button>
          </div>
          <pre style={styles.logs}>{logs}</pre>
        </section>
      )}
    </div>
  );
}

const styles = {
  page: {
    fontFamily:
      "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif",
    backgroundColor: "#f4f6f8",
    minHeight: "100vh",
    padding: "1rem",
    color: "#212529",
  },
  header: {
    maxWidth: 900,
    margin: "0 auto 1.5rem auto",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottom: "2px solid #e0e0e0",
    paddingBottom: "0.75rem",
  },
  logo: {
    fontWeight: "700",
    fontSize: "1.8rem",
    color: "#2c3e50",
    margin: 0,
  },
  refreshBtn: {
    fontSize: "1rem",
    padding: "8px 16px",
    backgroundColor: "#007bff",
    border: "none",
    borderRadius: 5,
    color: "#fff",
    cursor: "pointer",
    boxShadow:
      "0 3px 5px rgba(0,123,255,0.4), 0 1px 1px rgba(0,0,0,0.1)",
    transition: "background-color 0.3s ease",
  },
  error: {
    maxWidth: 900,
    margin: "0 auto 1rem auto",
    padding: "0.75rem 1rem",
    backgroundColor: "#f8d7da",
    color: "#721c24",
    borderRadius: 5,
    border: "1px solid #f5c6cb",
    fontWeight: "600",
    textAlign: "center",
  },
  loading: {
    maxWidth: 900,
    margin: "2rem auto",
    fontSize: "1.1rem",
    textAlign: "center",
    color: "#555",
  },
  noContainers: {
    maxWidth: 900,
    margin: "2rem auto",
    fontSize: "1.1rem",
    textAlign: "center",
    color: "#6c757d",
  },
  containerGrid: {
    maxWidth: 900,
    margin: "0 auto",
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
    gap: "1rem",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    boxShadow:
      "0 2px 8px rgba(0,0,0,0.1), 0 4px 10px rgba(0,0,0,0.06)",
    padding: "1.25rem",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    minHeight: "180px",
    transition: "box-shadow 0.3s ease",
  },
  cardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  containerName: {
    fontSize: "1.25rem",
    fontWeight: "700",
    color: "#34495e",
    margin: 0,
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    maxWidth: "70%",
  },
  statusBadge: {
    color: "#fff",
    borderRadius: 9999,
    padding: "4px 14px",
    fontWeight: "700",
    fontSize: "0.85rem",
    boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
    userSelect: "none",
  },
  imageText: {
    fontSize: "0.9rem",
    color: "#6c757d",
    marginBottom: 15,
    fontFamily: "monospace",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  buttonGroup: {
    marginTop: "auto",
    display: "flex",
    gap: "0.75rem",
    flexWrap: "wrap",
  },
  btnPrimary: {
    flex: "1 1 auto",
    backgroundColor: "#007bff",
    border: "none",
    borderRadius: 6,
    padding: "10px 0",
    color: "#fff",
    fontWeight: "600",
    cursor: "pointer",
    boxShadow: "0 3px 6px rgba(0,123,255,0.5)",
    transition: "background-color 0.3s ease, box-shadow 0.3s ease",
  },
  btnPrimaryHover: {
    backgroundColor: "#0056b3",
    boxShadow: "0 6px 12px rgba(0,86,179,0.7)",
  },
  btnWarning: {
    flex: "1 1 auto",
    backgroundColor: "#ffc107",
    border: "none",
    borderRadius: 6,
    padding: "10px 0",
    color: "#212529",
    fontWeight: "600",
    cursor: "pointer",
    boxShadow: "0 3px 6px rgba(255,193,7,0.5)",
    transition: "background-color 0.3s ease, box-shadow 0.3s ease",
  },
  btnWarningHover: {
    backgroundColor: "#d39e00",
    boxShadow: "0 6px 12px rgba(211,158,0,0.7)",
  },
  btnDanger: {
    flex: "1 1 auto",
    backgroundColor: "#dc3545",
    border: "none",
    borderRadius: 6,
    padding: "10px 0",
    color: "#fff",
    fontWeight: "600",
    cursor: "pointer",
    boxShadow: "0 3px 6px rgba(220,53,69,0.5)",
    transition: "background-color 0.3s ease, box-shadow 0.3s ease",
  },
  btnDangerHover: {
    backgroundColor: "#a71d2a",
    boxShadow: "0 6px 12px rgba(167,29,42,0.7)",
  },
  btnInfo: {
    flex: "1 1 auto",
    backgroundColor: "#17a2b8",
    border: "none",
    borderRadius: 6,
    padding: "10px 0",
    color: "#fff",
    fontWeight: "600",
    cursor: "pointer",
    boxShadow: "0 3px 6px rgba(23,162,184,0.5)",
    transition: "background-color 0.3s ease, box-shadow 0.3s ease",
  },
  btnInfoHover: {
    backgroundColor: "#0f6674",
    boxShadow: "0 6px 12px rgba(15,102,116,0.7)",
  },
  btnDisabled: {
    flex: "1 1 auto",
    backgroundColor: "#adb5bd",
    border: "none",
    borderRadius: 6,
    padding: "10px 0",
    color: "#6c757d",
    fontWeight: "600",
    cursor: "not-allowed",
    boxShadow: "none",
  },
  logsPanel: {
    maxWidth: 900,
    margin: "2rem auto",
    backgroundColor: "#212529",
    borderRadius: 12,
    padding: "1.5rem",
    boxShadow: "0 5px 20px rgba(0,0,0,0.3)",
    color: "#f8f9fa",
    fontFamily: "'Source Code Pro', monospace",
  },
  logsHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "1rem",
  },
  closeLogsBtn: {
    fontSize: "1.5rem",
    lineHeight: "1",
    backgroundColor: "transparent",
    border: "none",
    color: "#f8f9fa",
    cursor: "pointer",
    padding: 0,
    margin: 0,
    transition: "color 0.3s ease",
  },
  closeLogsBtnHover: {
    color: "#dc3545",
  },
  logs: {
    maxHeight: "400px",
    overflowY: "auto",
    whiteSpace: "pre-wrap",
  },
};
------------------------------------------------------------------------------

import React, { useEffect, useState } from "react";

const STATUS_COLORS = {
  running: "#00aaff",   // neon blue
  exited: "#999999",    // gray for stopped
  paused: "#ffaa00",    // amber
  default: "#555555",
};

function getStatusColor(status) {
  if (!status) return STATUS_COLORS.default;
  const s = status.toLowerCase();
  if (s.includes("up")) return STATUS_COLORS.running;
  if (s.includes("exited")) return STATUS_COLORS.exited;
  if (s.includes("paused")) return STATUS_COLORS.paused;
  return STATUS_COLORS.default;
}

function cleanName(name) {
  return name.startsWith("/") ? name.slice(1) : name;
}

export default function App() {
  const [containers, setContainers] = useState([]);
  const [logs, setLogs] = useState("");
  const [selectedId, setSelectedId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [removingId, setRemovingId] = useState(null);
  const [error, setError] = useState("");
  const [loadingLogsId, setLoadingLogsId] = useState(null);

  async function fetchContainers() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("http://localhost:3001/api/containers");
      if (!res.ok) throw new Error("Failed to fetch containers");
      const data = await res.json();
      setContainers(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchContainers();
  }, []);

  async function startContainer(id) {
    setError("");
    try {
      await fetch(`http://localhost:3001/api/containers/${id}/start`, { method: "POST" });
      fetchContainers();
    } catch {
      setError("Failed to start container");
    }
  }

  async function stopContainer(id) {
    setError("");
    try {
      await fetch(`http://localhost:3001/api/containers/${id}/stop`, { method: "POST" });
      fetchContainers();
    } catch {
      setError("Failed to stop container");
    }
  }

  async function removeContainer(id) {
    const confirmed = window.confirm("Are you sure you want to remove this container?");
    if (!confirmed) return;
    setRemovingId(id);
    setError("");
    try {
      await fetch(`http://localhost:3001/api/containers/${id}`, { method: "DELETE" });
      if (selectedId === id) setSelectedId(null);
      fetchContainers();
    } catch {
      setError("Failed to remove container");
    } finally {
      setRemovingId(null);
    }
  }

  async function fetchLogs(id) {
    setSelectedId(id);
    setError("");
    setLoadingLogsId(id);
    setLogs("Loading logs...");
    try {
      const res = await fetch(`http://localhost:3001/api/containers/${id}/logs`);
      if (!res.ok) throw new Error("Failed to fetch logs");
      const text = await res.text();
      setLogs(text || "(No logs available)");
    } catch (err) {
      setLogs("");
      setError(err.message);
    } finally {
      setLoadingLogsId(null);
    }
  }

  const selectedContainer = containers.find((c) => c.Id === selectedId);
  const selectedName = selectedContainer
    ? cleanName(selectedContainer.Names?.[0] || "Unknown")
    : "";

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600&display=swap');

        html, body, #root {
          margin: 0; padding: 0; height: 100%;
          background-color: #0a1128;
          font-family: 'Inter', sans-serif;
          color: #f0f0f0;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }

        header {
          max-width: 900px;
          margin: 2rem auto 1rem auto;
          padding: 0 1rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          user-select: none;
        }
        .logo {
          font-weight: 700;
          font-size: 1.8rem;
          color: #00aaff;
          letter-spacing: 2px;
          font-family: 'Inter', sans-serif;
        }
        button.refresh-btn {
          background: none;
          border: 2px solid #00aaff;
          color: #00aaff;
          padding: 8px 18px;
          font-weight: 600;
          font-size: 0.9rem;
          border-radius: 8px;
          cursor: pointer;
          transition: background-color 0.25s ease, color 0.25s ease;
        }
        button.refresh-btn:hover:not(:disabled) {
          background-color: #00aaff;
          color: #0a1128;
          box-shadow: 0 0 8px #00aaffaa;
        }
        button.refresh-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        main {
          max-width: 900px;
          margin: 0 auto 3rem auto;
          padding: 0 1rem;
        }

        .error {
          background-color: #ff4d6d;
          color: white;
          padding: 12px 16px;
          border-radius: 8px;
          font-weight: 600;
          margin: 1rem auto;
          max-width: 900px;
          text-align: center;
          user-select: none;
          box-shadow: 0 0 10px #ff4d6daa;
        }

        .container-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 1.25rem;
          margin-top: 1rem;
        }

        .card {
          background-color: #122244;
          border-radius: 14px;
          box-shadow: 0 4px 12px rgb(0 170 255 / 0.2);
          padding: 1.25rem 1.5rem;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          transition: box-shadow 0.3s ease;
          cursor: default;
        }
        .card:hover {
          box-shadow: 0 6px 20px rgb(0 170 255 / 0.5);
        }

        .container-name {
          font-size: 1.4rem;
          font-weight: 700;
          color: #00aaff;
          margin-bottom: 8px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          user-select: text;
        }

        .status-badge {
          align-self: flex-start;
          background-color: #001a3d;
          color: #00aaff;
          font-weight: 600;
          font-size: 0.85rem;
          padding: 4px 14px;
          border-radius: 16px;
          border: 1.5px solid #00aaff;
          box-shadow: 0 0 8px #00aaffaa;
          user-select: none;
          white-space: nowrap;
          text-transform: uppercase;
        }

        .button-group {
          margin-top: 16px;
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
        }

        button {
          flex: 1;
          min-width: 70px;
          background: none;
          border: 2px solid #00aaff;
          color: #00aaff;
          padding: 10px 0;
          font-weight: 600;
          font-size: 0.9rem;
          border-radius: 8px;
          cursor: pointer;
          transition: background-color 0.3s ease, color 0.3s ease, box-shadow 0.3s ease;
          user-select: none;
        }
        button:hover:not(:disabled) {
          background-color: #00aaff;
          color: #0a1128;
          box-shadow: 0 0 10px #00aaffaa;
        }
        button:disabled {
          opacity: 0.4;
          cursor: not-allowed;
          box-shadow: none;
          background: none;
          color: #555;
        }

        button.btn-danger {
          border-color: #ff4d6d;
          color: #ff4d6d;
        }
        button.btn-danger:hover:not(:disabled) {
          background-color: #ff4d6d;
          color: #fff;
          box-shadow: 0 0 10px #ff4d6dcc;
        }

        .logs-panel {
          background-color: #122244;
          box-shadow: 0 0 25px #00aaffcc;
          max-width: 900px;
          margin: 2rem auto 4rem auto;
          border-radius: 14px;
          padding: 1.5rem 2rem;
          font-family: monospace;
          color: #d0eaff;
          max-height: 380px;
          overflow-y: auto;
          user-select: text;
          white-space: pre-wrap;
        }

        .logs-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-weight: 700;
          color: #00aaff;
          margin-bottom: 1rem;
          user-select: none;
        }

        .close-logs-btn {
          background: none;
          border: none;
          font-size: 1.4rem;
          color: #ff4d6d;
          cursor: pointer;
          padding: 0 6px;
          transition: color 0.2s ease;
        }
        .close-logs-btn:hover {
          color: #ff758e;
        }

        .loading,
        .no-containers {
          text-align: center;
          margin-top: 3rem;
          font-weight: 600;
          color: #6792c0;
          user-select: none;
        }
      `}</style>

      <header>
        <div className="logo">Docker Manager</div>
        <button
          onClick={fetchContainers}
          className="refresh-btn"
          disabled={loading}
          aria-label="Refresh container list"
        >
          {loading ? "Refreshing..." : "Refresh"}
        </button>
      </header>

      {error && <div className="error" role="alert">{error}</div>}

      <main>
        {loading && !containers.length ? (
          <div className="loading" aria-live="polite">Loading containers...</div>
        ) : containers.length === 0 ? (
          <div className="no-containers">No containers found.</div>
        ) : (
          <div className="container-grid" role="list">
            {containers.map((c) => {
              const name = cleanName(c.Names?.[0] || "Unknown");
              const statusColor = getStatusColor(c.Status);
              const isRunning = c.State === "running";
              return (
                <article
                  key={c.Id}
                  className="card"
                  role="listitem"
                  tabIndex={0}
                  aria-label={`${name} container, status: ${c.Status}`}
                >
                  <div className="container-name" style={{ color: statusColor }}>
                    {name}
                  </div>
                  <span
                    className="status-badge"
                    style={{ color: statusColor, borderColor: statusColor }}
                    title={c.Status}
                    aria-live="polite"
                  >
                    {c.Status.toUpperCase()}
                  </span>

                  <div className="button-group" aria-label={`Actions for container ${name}`}>
                    <button
                      onClick={() => startContainer(c.Id)}
                      disabled={isRunning}
                      title={isRunning ? "Container already running" : "Start container"}
                    >
                      Start
                    </button>
                    <button
                      onClick={() => stopContainer(c.Id)}
                      disabled={!isRunning}
                      title={!isRunning ? "Container not running" : "Stop container"}
                    >
                      Stop
                    </button>
                    <button
                      onClick={() => removeContainer(c.Id)}
                      disabled={removingId === c.Id}
                      className="btn-danger"
                      title="Remove container"
                    >
                      {removingId === c.Id ? "Removing..." : "Remove"}
                    </button>
                    <button
                      onClick={() => fetchLogs(c.Id)}
                      disabled={loadingLogsId === c.Id}
                      title="View logs"
                    >
                      {loadingLogsId === c.Id ? "Loading..." : "Logs"}
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </main>

      {selectedId && (
        <section className="logs-panel" aria-live="polite" aria-label={`Logs panel for ${selectedName}`}>
          <div className="logs-header">
            Logs for {selectedName}
            <button
              onClick={() => setSelectedId(null)}
              className="close-logs-btn"
              aria-label="Close logs panel"
            >
              ✖
            </button>
          </div>
          <pre className="logs">{logs}</pre>
        </section>
      )}
    </>
  );
}
