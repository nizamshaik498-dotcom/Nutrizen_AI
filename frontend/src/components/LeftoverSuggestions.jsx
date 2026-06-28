import { useState } from "react";
import { Recycle } from "lucide-react";

export default function LeftoverSuggestions({ suggestions }) {
  const [expanded, setExpanded] = useState(null);

  if (!suggestions?.length) return null;

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Recycle size={20} className="text-green-600" />
        <h3 className="text-lg font-semibold">Leftover Ideas</h3>
      </div>
      {suggestions.map((s, i) => (
        <div key={i} className="bg-teal-50 border border-teal-200 rounded-xl p-4">
          <button
            onClick={() => setExpanded(expanded === i ? null : i)}
            className="w-full text-left"
          >
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-teal-900">{s.dish_name}</h4>
              <span className="text-xs bg-teal-200 text-teal-700 px-2 py-0.5 rounded-full">
                {s.cuisine_style}
              </span>
            </div>
            <p className="text-sm text-teal-700 mt-1">Uses: {s.uses_ingredients?.join(", ")}</p>
            <div className="flex items-center gap-3 mt-1 text-xs text-gray-600">
              {s.total_time_minutes && <span>⏱ {s.total_time_minutes}min</span>}
              <span className="flex items-center gap-1">♻️ {s.waste_reduced || "Reduces waste"}</span>
            </div>
            {s.missing_ingredients?.length > 0 && (
              <p className="text-sm text-orange-600 mt-1">
                Need: {s.missing_ingredients.join(", ")}
              </p>
            )}
          </button>
          {expanded === i && s.steps?.length > 0 && (
            <ol className="mt-3 space-y-1 text-sm text-gray-700 list-decimal list-inside">
              {s.steps.map((step, j) => (
                <li key={j}>{step}</li>
              ))}
            </ol>
          )}
        </div>
      ))}
    </div>
  );
}
