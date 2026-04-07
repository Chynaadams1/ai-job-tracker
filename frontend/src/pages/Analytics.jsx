import { useState, useEffect } from "react";
import axios from "axios";

const styles = {
  container: {
    padding: "32px",
    maxWidth: "900px",
    margin: "0 auto",
    fontFamily: "sans-serif",
  },
  title: {
    fontSize: "24px",
    fontWeight: "bold",
    marginBottom: "24px",
    color: "#1A3A5C",
  },
  cardRow: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: "16px",
    marginBottom: "32px",
  },
  card: {
    background: "#EBF5FB",
    borderRadius: "12px",
    padding: "20px",
    textAlign: "center",
    border: "1px solid #1A76BD",
  },
  cardNumber: {
    fontSize: "32px",
    fontWeight: "bold",
    color: "#1A3A5C",
  },
  cardLabel: {
    fontSize: "13px",
    color: "#555",
    marginTop: "6px",
  },
  section: {
    background: "#fff",
    borderRadius: "12px",
    padding: "24px",
    marginBottom: "24px",
    border: "1px solid #ddd",
  },
  sectionTitle: {
    fontSize: "16px",
    fontWeight: "bold",
    color: "#1A3A5C",
    marginBottom: "16px",
  },
  statusRow: {
    display: "flex",
    gap: "12px",
    flexWrap: "wrap",
  },
  statusBadge: {
    background: "#D6EAF8",
    borderRadius: "20px",
    padding: "6px 16px",
    fontSize: "13px",
    color: "#1A3A5C",
    fontWeight: "600",
  },
  insightBox: {
    background: "#EAFAF1",
    borderRadius: "12px",
    padding: "24px",
    marginBottom: "24px",
    border: "1px solid #1E8449",
    lineHeight: "1.8",
    color: "#1A3A1A",
    fontSize: "14px",
    whiteSpace: "pre-wrap",
  },
  button: {
    background: "#1A76BD",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    padding: "12px 24px",
    fontSize: "14px",
    fontWeight: "bold",
    cursor: "pointer",
    marginBottom: "16px",
  },
  loading: {
    color: "#888",
    fontStyle: "italic",
    padding: "16px 0",
  },
  weekRow: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  weekItem: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "8px 12px",
    background: "#F4F6F7",
    borderRadius: "8px",
    fontSize: "13px",
  },
  bar: {
    height: "10px",
    background: "#1A76BD",
    borderRadius: "4px",
    marginTop: "4px",
  },
};

export default function Analytics() {
  const [summary, setSummary]   = useState(null);
  const [insight, setInsight]   = useState("");
  const [loading, setLoading]   = useState(false);
  const [fetching, setFetching] = useState(true);

  // Load summary on page load
  useEffect(() => {
    axios
      .get("http://localhost:8000/analytics/summary")
      .then((res) => {
        setSummary(res.data);
        setFetching(false);
      })
      .catch((err) => {
        console.error(err);
        setFetching(false);
      });
  }, []);

  // Generate AI insight on button click
  const generateInsight = () => {
    setLoading(true);
    setInsight("");
    axios
      .post("http://localhost:8000/analytics/insight")
      .then((res) => {
        setInsight(res.data.insight);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };

  if (fetching) return <p style={styles.loading}>Loading analytics...</p>;
  if (!summary)  return <p style={styles.loading}>No data found.</p>;

  // Find max apps in a week for bar chart scaling
  const maxWeekCount = Math.max(
    ...Object.values(summary.applications_by_week)
  );

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Job Search Analytics</h2>

      {/* Stat Cards */}
      <div style={styles.cardRow}>
        <div style={styles.card}>
          <div style={styles.cardNumber}>
            {summary.total_applications}
          </div>
          <div style={styles.cardLabel}>Total Applications</div>
        </div>
        <div style={styles.card}>
          <div style={styles.cardNumber}>
            {summary.response_rate_pct}%
          </div>
          <div style={styles.cardLabel}>Response Rate</div>
        </div>
        <div style={styles.card}>
          <div style={styles.cardNumber}>
            {summary.avg_ai_match_score ?? "N/A"}
          </div>
          <div style={styles.cardLabel}>Avg Match Score</div>
        </div>
        <div style={styles.card}>
          <div style={styles.cardNumber}>
            {summary.application_trend}
          </div>
          <div style={styles.cardLabel}>Trend</div>
        </div>
      </div>

      {/* Status Breakdown */}
      <div style={styles.section}>
        <div style={styles.sectionTitle}>Status Breakdown</div>
        <div style={styles.statusRow}>
          {Object.entries(summary.status_breakdown).map(
            ([status, count]) => (
              <div key={status} style={styles.statusBadge}>
                {status}: {count}
              </div>
            )
          )}
        </div>
      </div>

      {/* Applications by Week */}
      <div style={styles.section}>
        <div style={styles.sectionTitle}>Applications by Week</div>
        <div style={styles.weekRow}>
          {Object.entries(summary.applications_by_week).map(
            ([week, count]) => (
              <div key={week}>
                <div style={styles.weekItem}>
                  <span>{week}</span>
                  <span>{count} apps</span>
                </div>
                <div
                  style={{
                    ...styles.bar,
                    width: `${(count / maxWeekCount) * 100}%`,
                  }}
                />
              </div>
            )
          )}
        </div>
      </div>

      {/* AI Career Coach */}
      <div style={styles.section}>
        <div style={styles.sectionTitle}>AI Career Coach Report</div>
        <button style={styles.button} onClick={generateInsight}>
          Generate Report
        </button>
        {loading && (
          <p style={styles.loading}>
            Generating your coaching report...
          </p>
        )}
        {insight && (
          <div style={styles.insightBox}>{insight}</div>
        )}
      </div>
    </div>
  );
}