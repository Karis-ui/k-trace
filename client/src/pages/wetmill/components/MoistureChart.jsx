import React from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

const MoistureChart = ({ batches }) => {
  // Prepare data for chart
  const data = batches.map(batch => ({
    name: batch.farmerId,
    Moisture: batch.moisture
  }));

  return (
    <div style={{ width: "100%", height: 300 }}>
      <ResponsiveContainer>
        <LineChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis domain={[0, 20]} />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="Moisture" stroke="#8884d8" activeDot={{ r: 8 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MoistureChart;
