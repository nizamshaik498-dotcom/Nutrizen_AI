export default function AllergyReport({ allergyReport }) {
  if (!allergyReport?.length) return null;

  const severityStyle = (severity) => {
    switch (severity) {
      case "SAFE": return "bg-green-100 text-green-700 border-green-300";
      case "CAUTION": return "bg-yellow-100 text-yellow-700 border-yellow-300";
      case "AVOID": return "bg-red-100 text-red-700 border-red-300";
      default: return "bg-gray-100 text-gray-700 border-gray-300";
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Allergy & Medical Risk Report</h3>
      {allergyReport.map((veg, i) => (
        <div key={i} className="bg-white border rounded-xl overflow-hidden">
          <div className="bg-gray-50 px-4 py-2 border-b font-semibold">
            {veg.vegetable_name}
          </div>
          <div className="p-4 space-y-2">
            {veg.risk_groups?.map((rg, j) => (
              <div key={j} className={`border rounded-lg p-3 ${severityStyle(rg.severity)}`}>
                <div className="flex items-center justify-between">
                  <span className="font-medium">{rg.group}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                    rg.severity === "AVOID" ? "bg-red-200 text-red-800" :
                    rg.severity === "CAUTION" ? "bg-yellow-200 text-yellow-800" :
                    "bg-green-200 text-green-800"
                  }`}>
                    {rg.severity}
                  </span>
                </div>
                <p className="text-sm mt-1">{rg.reason}</p>
                <p className="text-xs mt-1 opacity-75">{rg.recommendation}</p>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
