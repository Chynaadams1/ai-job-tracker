import { useState } from "react"
import Dashboard from "./pages/Dashboard"
import Analytics from "./pages/Analytics"

function App() {
  const [page, setPage] = useState("dashboard")

  return (
    <div>
      {/* Navigation */}
      <div style={{
        display: "flex",
        gap: "16px",
        padding: "16px 32px",
        background: "#1A3A5C",
        alignItems: "center",
      }}>
        <span style={{
          color: "#fff",
          fontWeight: "bold",
          fontSize: "18px",
          marginRight: "24px",
          fontFamily: "sans-serif",
        }}>
          AI Job Tracker
        </span>
        <button
          onClick={() => setPage("dashboard")}
          style={{
            background: page === "dashboard" ? "#1A76BD" : "transparent",
            color: "#fff",
            border: "1px solid #1A76BD",
            borderRadius: "8px",
            padding: "8px 20px",
            cursor: "pointer",
            fontWeight: "600",
            fontSize: "14px",
          }}
        >
          Dashboard
        </button>
        <button
          onClick={() => setPage("analytics")}
          style={{
            background: page === "analytics" ? "#1A76BD" : "transparent",
            color: "#fff",
            border: "1px solid #1A76BD",
            borderRadius: "8px",
            padding: "8px 20px",
            cursor: "pointer",
            fontWeight: "600",
            fontSize: "14px",
          }}
        >
          Analytics
        </button>
      </div>

      {/* Page Content */}
      {page === "dashboard" && <Dashboard />}
      {page === "analytics" && <Analytics />}
    </div>
  )
}

export default App