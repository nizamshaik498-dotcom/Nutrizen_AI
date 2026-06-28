export default function FreshnessReport({ freshnessReport }) {
  if (!freshnessReport?.items?.length) return null;

  const statusColor = (status) => {
    const s = (status || "").toLowerCase();
    if (s.includes("fresh")) return "bg-green-100 border-green-400 text-green-800";
    if (s.includes("aged") || s.includes("slightly")) return "bg-yellow-100 border-yellow-400 text-yellow-800";
    if (s.includes("use") || s.includes("immediately")) return "bg-orange-100 border-orange-400 text-orange-800";
    if (s.includes("unsafe") || s.includes("spoiled")) return "bg-red-100 border-red-400 text-red-800";
    return "bg-gray-100 border-gray-400 text-gray-800";
  };

  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold">Freshness Report</h3>
      {freshnessReport.items.map((item, i) => (
        <div key={i} className={`border-l-4 p-4 rounded-r-lg ${statusColor(item.freshness_status)}`}>
          <p className="font-medium">{item.vegetable_name}</p>
          <p className="text-sm">Status: {item.freshness_status}</p>
          {item.color_analysis && <p className="text-sm">Color: {item.color_analysis}</p>}
          {item.spoilage_detected && (
            <p className="text-sm text-red-600">
              Spoilage: {item.spoilage_details || "Detected"}
            </p>
          )}
          {item.recommended_action && (
            <p className="text-sm mt-1">Action: {item.recommended_action}</p>
          )}
          {item.best_recipe_for_this_freshness && (
            <p className="text-sm mt-1">Best for: {item.best_recipe_for_this_freshness}</p>
          )}
        </div>
      ))}
    </div>
  );
}
