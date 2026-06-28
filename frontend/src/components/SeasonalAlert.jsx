import { Leaf, AlertTriangle } from "lucide-react";

export default function SeasonalAlert({ seasonalAwareness }) {
  if (!seasonalAwareness) return null;

  const outOfSeason = seasonalAwareness.out_of_season_vegetables_detected;
  const inSeason = seasonalAwareness.in_season_vegetables_detected;

  if (!outOfSeason?.length && !inSeason?.length) return null;

  return (
    <div className="space-y-3 p-4 bg-green-50 rounded-xl border border-green-200">
      <div className="flex items-center gap-2">
        <Leaf size={20} className="text-green-600" />
        <h3 className="text-lg font-semibold">
          Seasonal Awareness — {seasonalAwareness.user_region}, {seasonalAwareness.current_season}
        </h3>
      </div>

      {inSeason?.length > 0 && (
        <div>
          <p className="text-sm font-medium text-green-700">In Season:</p>
          <div className="flex flex-wrap gap-2 mt-1">
            {inSeason.map((v, i) => (
              <span key={i} className="bg-green-200 text-green-800 px-3 py-1 rounded-full text-sm">
                {v}
              </span>
            ))}
          </div>
        </div>
      )}

      {outOfSeason?.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center gap-1 text-orange-600">
            <AlertTriangle size={16} />
            <p className="text-sm font-medium">Out of Season</p>
          </div>
          {outOfSeason.map((item, i) => (
            <div key={i} className="bg-orange-100 rounded-lg p-3">
              <p className="font-medium">{item.vegetable}</p>
              <p className="text-sm text-orange-700">{item.warning}</p>
              {item.in_season_alternative && (
                <p className="text-sm text-green-700">
                  Try: {item.in_season_alternative}
                </p>
              )}
            </div>
          ))}
        </div>
      )}

      {seasonalAwareness.seasonal_recipe_bonus && (
        <p className="text-sm italic text-gray-600">
          Seasonal tip: {seasonalAwareness.seasonal_recipe_bonus}
        </p>
      )}
    </div>
  );
}
