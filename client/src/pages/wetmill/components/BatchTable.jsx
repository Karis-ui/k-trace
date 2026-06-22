import FermentationTimer from "./FermentationTimer";

const BatchTable = ({ batches }) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border border-gray-200">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-2 border">Farmer ID</th>
            <th className="px-4 py-2 border">Farmer Name</th>
            <th className="px-4 py-2 border">Weight (kg)</th>
            <th className="px-4 py-2 border">Moisture (%)</th>
            <th className="px-4 py-2 border">Fermentation Time</th>
          </tr>
        </thead>
        <tbody>
          {batches.map((batch) => (
            <tr key={batch.id} className="text-center">
              <td className="px-4 py-2 border">{batch.farmerId}</td>
              <td className="px-4 py-2 border">{batch.name}</td>
              <td className="px-4 py-2 border">{batch.weight}</td>
              <td className="px-4 py-2 border">{batch.moisture}</td>
              <td className="px-4 py-2 border">
                {batch.fermentationStart ? <FermentationTimer startTime={batch.fermentationStart} /> : "Not started"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
export default BatchTable;