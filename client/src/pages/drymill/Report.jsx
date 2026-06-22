import React, { useState, useEffect } from "react";
import { Download, BarChart3, FileText, Calendar } from "lucide-react";

export default function Reportss() {
  const [reportType, setReportType] = useState("monthly");
  const [reports, setReports] = useState([]);

  useEffect(() => {
    // Simulate fetching reports
    setTimeout(() => {
      setReports([
        { id: 1, title: "September 2025 Report", date: "2025-09-30", status: "Completed" },
        { id: 2, title: "August 2025 Report", date: "2025-08-31", status: "Completed" },
        { id: 3, title: "July 2025 Report", date: "2025-07-31", status: "Completed" },
      ]);
    }, 500);
  }, [reportType]);

  const handleDownload = (id) => {
    alert(`Downloading report ${id}`);
  };

  return (
    <div className="p-6 animate-fadeIn">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-green-800 flex items-center gap-2">
          <BarChart3 className="text-green-600" /> Reports Overview
        </h1>
        <select
          value={reportType}
          onChange={(e) => setReportType(e.target.value)}
          className="border border-green-300 rounded-lg px-3 py-2 text-green-800 bg-white shadow-sm hover:shadow-md transition-all"
        >
          <option value="monthly">Monthly Reports</option>
          <option value="weekly">Weekly Reports</option>
          <option value="custom">Custom Reports</option>
        </select>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-md border border-green-100 transition hover:shadow-lg">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-green-200 text-green-700">
              <th className="py-3">#</th>
              <th className="py-3">Report Name</th>
              <th className="py-3">Date</th>
              <th className="py-3">Status</th>
              <th className="py-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {reports.map((r, i) => (
              <tr
                key={r.id}
                className="border-b border-green-100 hover:bg-green-50 transition-all"
              >
                <td className="py-3">{i + 1}</td>
                <td className="py-3 font-medium text-green-800 flex items-center gap-2">
                  <FileText className="text-green-500" /> {r.title}
                </td>
                <td className="py-3 flex items-center gap-2">
                  <Calendar className="text-green-400" size={16} /> {r.date}
                </td>
                <td className="py-3">
                  <span
                    className={`px-3 py-1 rounded-full text-sm ${
                      r.status === "Completed"
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {r.status}
                  </span>
                </td>
                <td className="py-3 text-right">
                  <button
                    onClick={() => handleDownload(r.id)}
                    className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
                  >
                    <Download size={16} /> Download
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
