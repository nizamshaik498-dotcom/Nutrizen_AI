import { AlertTriangle, X } from "lucide-react";
import { useState } from "react";

export default function AllergenAlert({ allergenAlert, onDismiss }) {
  const [dismissed, setDismissed] = useState(false);

  if (!allergenAlert || !allergenAlert.alert_triggered || dismissed) return null;

  const severityColor =
    allergenAlert.severity === "high"
      ? "bg-red-700"
      : allergenAlert.severity === "medium"
        ? "bg-orange-600"
        : "bg-yellow-500";

  const handleDismiss = () => {
    setDismissed(true);
    if (onDismiss) onDismiss();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
      <div className={`${severityColor} text-white rounded-2xl p-6 max-w-md w-full mx-4 shadow-2xl`}>
        <div className="flex items-center gap-3 mb-4">
          <AlertTriangle size={32} className="text-white" />
          <h2 className="text-xl font-bold">Allergen Alert</h2>
        </div>
        <p className="mb-4 text-white/90">
          {allergenAlert.alert_triggered &&
            "One or more detected items may trigger your listed allergies."}
        </p>
        {allergenAlert.flagged_items?.map((item, i) => (
          <div key={i} className="bg-white/10 rounded-lg p-3 mb-3">
            <p className="font-semibold">{item.vegetable}</p>
            <p className="text-sm text-white/80">Triggers: {item.triggers_condition}</p>
            <p className="text-sm text-white/80">
              Affected: {item.affected_user_group}
            </p>
            <p className="text-sm text-white/80">Action: {item.immediate_action}</p>
            {item.safe_substitute && (
              <p className="text-sm mt-1 text-green-200">
                Safe substitute: {item.safe_substitute}
              </p>
            )}
          </div>
        ))}
        <button
          onClick={handleDismiss}
          className="w-full mt-2 bg-white text-red-700 font-semibold py-2 rounded-lg hover:bg-white/90 flex items-center justify-center gap-2"
        >
          <X size={18} /> I Understand, Proceed
        </button>
      </div>
    </div>
  );
}
