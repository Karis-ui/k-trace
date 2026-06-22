import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Papa from "papaparse";
import { toast } from "react-toastify";

export default function IntakeEntry() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const farmerIdFromQuery = searchParams.get("farmerId");

  const [manualData, setManualData] = useState({
    farmerIdNumber: farmerIdFromQuery || "",
    weightKg: "",
    moisture: "",
    fermentationTime: "",
  });
  const [farmerName, setFarmerName] = useState("");
  const [csvFile, setCsvFile] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch farmer details if farmerId comes from query
  useEffect(() => {
    if (farmerIdFromQuery) {
      axios
        .get(`http://localhost:5000/api/farmers/${farmerIdFromQuery}`)
        .then((res) => {
          if (res.data.farmer) {
            setFarmerName(res.data.farmer.username);
            toast.info(
              `Please enter ${res.data.farmer.username}'s intake data carefully.`
            );
          }
        })
        .catch(() => {
          setFarmerName("");
          toast.error("⚠️ Failed to fetch farmer details.");
        });
    }
  }, [farmerIdFromQuery]);

  const handleManualChange = (e) => {
    setManualData({
      ...manualData,
      [e.target.name]: e.target.value,
    });
  };

  const handleManualSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        farmerId: Number(manualData.farmerIdNumber),
        wetmillId: "YOUR_WETMILL_UUID",
        weightKg: Number(manualData.weightKg),
        moisture: Number(manualData.moisture),
        notes: manualData.fermentationTime
          ? `Fermentation Time: ${manualData.fermentationTime} hrs`
          : "",
      };

      const res = await axios.post(
        "http://localhost:5000/api/intake/manual",
        payload
      );

      if (res.data.success) {
        const farmerDisplay =
          res.data.farmer?.username || res.data.farmer?.name || "Farmer";

        toast.success(
          `✅ Intake recorded for ${farmerDisplay}. Lot ID: ${
            res.data.intakeHistory?.slice(-1)[0]?.lotId
          }. SMS queued.`
        );

        navigate(`/farmers/${manualData.farmerIdNumber}`, {
          state: {
            farmer: res.data.farmer,
            intakeHistory: res.data.intakeHistory,
          },
        });
      } else {
        toast.error("❌ Failed to record manual intake.");
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.error || "⚠️ Server error during manual entry.");
    } finally {
      setLoading(false);
    }
  };

  const handleCsvChange = (e) => {
    setCsvFile(e.target.files[0]);
  };

  const handleCsvUpload = () => {
    if (!csvFile) return toast.warning("Please select a CSV file first.");
    setLoading(true);

    Papa.parse(csvFile, {
      header: true,
      skipEmptyLines: true,
      complete: async (results) => {
        const rows = results.data;
        const successRows = [];
        const failedRows = [];

        for (let row of rows) {
          try {
            const payload = {
              farmerId: Number(row.farmerIdNumber),
              wetmillId: "YOUR_WETMILL_UUID",
              weightKg: Number(row.weightKg),
              moisture: Number(row.moisture),
              notes: row.fermentationTime
                ? `Fermentation Time: ${row.fermentationTime} hrs`
                : "",
            };
            const res = await axios.post(
              "http://localhost:5000/api/intake/manual",
              payload
            );
            if (res.data.success) successRows.push(row.farmerIdNumber);
            else failedRows.push(row.farmerIdNumber);
          } catch {
            failedRows.push(row.farmerIdNumber);
          }
        }

        toast.info(
          `📊 CSV Upload complete. Success: ${successRows.length}, Failed: ${failedRows.length}`
        );
        setLoading(false);
        setCsvFile(null);
      },
    });
  };

  return (
    <div className="p-6 max-w-md mx-auto text-[#6B3E26]">
      <h2 className="text-2xl font-bold mb-4">
        Manual Data Entry {farmerName && `for ${farmerName}`}
      </h2>

      <form onSubmit={handleManualSubmit} className="space-y-4 mb-6">
        <div>
          <label>Farmer ID Number</label>
          <input
            type="number"
            name="farmerIdNumber"
            value={manualData.farmerIdNumber}
            onChange={handleManualChange}
            className="border rounded p-2 w-full"
            required
            readOnly={!!farmerIdFromQuery}
          />
        </div>
        <div>
          <label>Weight (kg)</label>
          <input
            type="number"
            name="weightKg"
            value={manualData.weightKg}
            onChange={handleManualChange}
            className="border rounded p-2 w-full"
            required
          />
        </div>
        <div>
          <label>Moisture (%)</label>
          <input
            type="number"
            name="moisture"
            value={manualData.moisture}
            onChange={handleManualChange}
            className="border rounded p-2 w-full"
            required
          />
        </div>
        <div>
          <label>Fermentation Time (hrs)</label>
          <input
            type="number"
            name="fermentationTime"
            value={manualData.fermentationTime}
            onChange={handleManualChange}
            className="border rounded p-2 w-full"
          />
        </div>
        <button
          type="submit"
          className="bg-[#6B3E26] text-white px-4 py-2 rounded"
          disabled={loading}
        >
          {loading ? "Submitting..." : "Submit"}
        </button>
      </form>

      <h2 className="text-2xl font-bold mb-4">CSV Upload</h2>
      <input
        type="file"
        accept=".csv"
        onChange={handleCsvChange}
        className="mb-4"
      />
      <button
        onClick={handleCsvUpload}
        className="bg-[#6B3E26] text-white px-4 py-2 rounded"
        disabled={loading}
      >
        {loading ? "Uploading..." : "Upload CSV"}
      </button>
    </div>
  );
}
