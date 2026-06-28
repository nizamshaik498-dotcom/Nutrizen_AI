export default function AlternativeDishes({ alternatives }) {
  if (!alternatives?.length) return null;

  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold">Alternative Dishes</h3>
      {alternatives.map((dish, i) => (
        <div key={i} className="bg-purple-50 border border-purple-200 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-purple-900">{dish.dish_name}</h4>
            <span className="text-xs bg-purple-200 text-purple-700 px-2 py-0.5 rounded-full">
              {dish.cuisine_style}
            </span>
          </div>
          <p className="text-sm text-purple-700 mt-1">{dish.why_alternative}</p>
          <div className="flex flex-wrap gap-2 mt-2 text-xs text-gray-600">
            {dish.total_time_minutes && <span>⏱ {dish.total_time_minutes}min</span>}
            {dish.calories_per_serving && <span>🔥 {dish.calories_per_serving} cal</span>}
          </div>
          {dish.key_technique && (
            <p className="text-sm mt-1">Technique: {dish.key_technique}</p>
          )}
          {dish.health_benefit_over_main_recipe && (
            <p className="text-sm text-green-700 mt-1">Benefit: {dish.health_benefit_over_main_recipe}</p>
          )}
          {dish.missing_ingredients?.length > 0 && (
            <p className="text-sm text-orange-600 mt-1">
              Missing: {dish.missing_ingredients.join(", ")}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}
