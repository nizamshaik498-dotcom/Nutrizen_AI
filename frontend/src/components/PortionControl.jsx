export default function PortionControl({ portionControl }) {
  if (!portionControl) return null;

  const plate = portionControl.plate_diagram;

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Portion Control</h3>

      <div className="bg-white border rounded-xl p-4">
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div>Weight: {portionControl.user_weight_kg}kg</div>
          <div>Goal: {portionControl.fitness_goal}</div>
          <div>Daily target: {portionControl.daily_calorie_target} kcal</div>
        </div>
      </div>

      {portionControl.per_meal_targets && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {Object.entries(portionControl.per_meal_targets).map(([meal, cal]) => (
            <div key={meal} className="bg-white border rounded-lg p-3 text-center">
              <p className="text-xs text-gray-500 capitalize">{meal}</p>
              <p className="text-lg font-bold">{cal}</p>
              <p className="text-xs text-gray-400">kcal</p>
            </div>
          ))}
        </div>
      )}

      {plate && (
        <div className="bg-white border rounded-xl p-4">
          <p className="text-sm font-medium mb-2">Plate Diagram</p>
          <div className="flex gap-1 h-6 rounded-full overflow-hidden">
            <div style={{ width: `${plate.vegetables || 0}%` }} className="bg-green-500" title="Vegetables" />
            <div style={{ width: `${plate.protein || 0}%` }} className="bg-red-400" title="Protein" />
            <div style={{ width: `${plate.carbs || 0}%` }} className="bg-yellow-400" title="Carbs" />
            <div style={{ width: `${plate.healthy_fats || 0}%` }} className="bg-blue-400" title="Healthy Fats" />
          </div>
          <div className="flex flex-wrap gap-3 mt-2 text-xs">
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-500" /> Veg {plate.vegetables}%</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-400" /> Protein {plate.protein}%</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-yellow-400" /> Carbs {plate.carbs}%</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-400" /> Fats {plate.healthy_fats}%</span>
          </div>
        </div>
      )}

      {portionControl.per_vegetable_portions?.length > 0 && (
        <div className="space-y-2">
          {portionControl.per_vegetable_portions.map((pv, i) => (
            <div key={i} className="bg-green-50 border border-green-200 rounded-lg p-3">
              <span className="font-medium">{pv.vegetable_name}</span>
              <span className="ml-2 text-sm text-green-700">{pv.recommended_grams_per_meal}g per meal</span>
              <p className="text-xs text-gray-500 mt-1">{pv.reason}</p>
            </div>
          ))}
        </div>
      )}

      {portionControl.portion_warning && (
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 p-3 rounded-lg text-sm">
          {portionControl.portion_warning}
        </div>
      )}
    </div>
  );
}
