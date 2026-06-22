import React, { useState } from "react";
import axios from "axios";

export default function Grading() {
  const [dashboard, setDashboard] = useState({
    lotId: "",
    defects: { insect: 0, broken: 0, unripe: 0 },
    moistureContent: 0,
    cuppingScore: {
      flavour: 0,
      acidity: 0,
      aroma: 0,
      body: 0,
      aftertaste: 0,
      total: 0,
    },
    date: new Date().toISOString().slice(0, 10),
  });

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [toast, setToast] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name.startsWith("defects.")) {
      const key = name.split(".")[1];
      setDashboard((prev) => ({
        ...prev,
        defects: { ...prev.defects, [key]: Number(value) },
      }));
    } else if (name.startsWith("cuppingScore.")) {
      const key = name.split(".")[1];
      setDashboard((prev) => ({
        ...prev,
        cuppingScore: { ...prev.cuppingScore, [key]: Number(value) },
      }));
    } else {
      setDashboard((prev) => ({ ...prev, [name]: value }));
    }
  };

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setShowResult(false);
    try {
      const res = await axios.post("http://localhost:5000/api/grading/grade", dashboard);
      console.log("📦 Grading submission response:", res.data);

      setResult(res.data.delivery);
      showToast("✅ Grading saved successfully!");
      setDashboard({
        lotId: "",
        defects: { insect: 0, broken: 0, unripe: 0 },
        moistureContent: 0,
        cuppingScore: {
          flavour: 0,
          acidity: 0,
          aroma: 0,
          body: 0,
          aftertaste: 0,
          total: 0,
        },
        date: new Date().toISOString().slice(0, 10),
      });

      setTimeout(() => setShowResult(true), 200);
    } catch (err) {
      console.error("🚨 Grading submission error:", err);
      showToast("❌ Error submitting grading", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        background: "linear-gradient(to bottom right, #e8f5e9, #ffffff)",
        minHeight: "100vh",
        padding: "40px",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        position: "relative",
      }}
    >
      {/* Toast Notification */}
      {toast && (
        <div
          style={{
            position: "fixed",
            top: "20px",
            right: "20px",
            background: toast.type === "success" ? "#43a047" : "#e53935",
            color: "white",
            padding: "12px 20px",
            borderRadius: "8px",
            boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
            opacity: toast ? 1 : 0,
            transition: "opacity 0.3s ease",
            zIndex: 1000,
          }}
        >
          {toast.message}
        </div>
      )}

      <div
        style={{
          background: "#fff",
          borderRadius: "12px",
          padding: "30px",
          maxWidth: "600px",
          margin: "0 auto",
          boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
        }}
      >
        <h2 style={{ textAlign: "center", color: "#2e7d32", marginBottom: "20px" }}>
          ☕ Coffee Grading Form
        </h2>

        <form onSubmit={handleSubmit}>
          <label>Lot ID</label>
          <input
            type="text"
            name="lotId"
            placeholder="Enter Lot ID"
            value={dashboard.lotId}
            onChange={handleChange}
            required
            style={inputStyle}
          />

          <label>Moisture Content (%)</label>
          <input
            type="number"
            name="moistureContent"
            placeholder="Moisture Content (%)"
            value={dashboard.moistureContent}
            onChange={handleChange}
            required
            style={inputStyle}
          />

          <label>Date</label>
          <input
            type="date"
            name="date"
            value={dashboard.date}
            onChange={handleChange}
            required
            style={inputStyle}
          />

          <h3 style={{ color: "#1b5e20", marginTop: "25px" }}>Defects</h3>
          {["insect", "broken", "unripe"].map((defect) => (
            <input
              key={defect}
              type="number"
              name={`defects.${defect}`}
              placeholder={`${defect.charAt(0).toUpperCase() + defect.slice(1)} defects`}
              value={dashboard.defects[defect]}
              onChange={handleChange}
              required
              style={inputStyle}
            />
          ))}

          <h3 style={{ color: "#1b5e20", marginTop: "25px" }}>Cupping Scores</h3>
          {["flavour", "acidity", "aroma", "body", "aftertaste", "total"].map((field) => (
            <input
              key={field}
              type="number"
              name={`cuppingScore.${field}`}
              placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
              value={dashboard.cuppingScore[field]}
              onChange={handleChange}
              required
              style={inputStyle}
            />
          ))}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              backgroundColor: loading ? "#a5d6a7" : "#43a047",
              color: "white",
              border: "none",
              padding: "12px",
              borderRadius: "8px",
              marginTop: "20px",
              cursor: loading ? "not-allowed" : "pointer",
              transition: "background 0.3s",
            }}
          >
            {loading ? "Submitting..." : "Submit Grading"}
          </button>
        </form>

        {result && (
          <div
            style={{
              marginTop: "25px",
              padding: "20px",
              border: "1px solid #a5d6a7",
              borderRadius: "10px",
              background: "#f1f8e9",
              color: "#2e7d32",
              transform: showResult ? "translateY(0)" : "translateY(30px)",
              opacity: showResult ? 1 : 0,
              transition: "all 0.6s ease",
            }}
          >
            <h3>✅ Grading Recorded</h3>
            <p>
              <b>Lot:</b> {result.lotId}
            </p>
            <p>
              <b>Grade:</b> {result.grade}
            </p>
            <p>
              <b>Cupping Score:</b> {result.cuppingScore?.total}
            </p>
            <p>
              <b>Total Payout:</b> KSh {result.totalPayout}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

const inputStyle = {
  width: "100%",
  padding: "10px",
  margin: "8px 0",
  borderRadius: "6px",
  border: "1px solid #ccc",
  fontSize: "14px",
};
