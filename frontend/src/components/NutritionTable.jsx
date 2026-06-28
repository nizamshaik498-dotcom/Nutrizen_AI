export default function NutritionTable({ nutrition }) {
  if (!nutrition?.length) return null;

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Nutritional Breakdown</h3>
      {nutrition.map((item, i) => (
        <div key={i} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="bg-gray-50 px-4 py-2 border-b flex items-center justify-between">
            <span className="font-semibold">{item.vegetable_name}</span>
            {item.health_score_out_of_10 && (
              <span className="text-sm bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                Health: {item.health_score_out_of_10}/10
              </span>
            )}
          </div>
          {item.per_100g && (
            <div className="p-4 grid grid-cols-2 sm:grid-cols-3 gap-2 text-sm">
              {item.per_100g.calories_kcal !== undefined && (
                <div className="bg-blue-50 p-2 rounded"><span className="font-medium">Calories</span><br />{item.per_100g.calories_kcal} kcal</div>
              )}
              {item.per_100g.carbohydrates_g !== undefined && (
                <div className="bg-yellow-50 p-2 rounded"><span className="font-medium">Carbs</span><br />{item.per_100g.carbohydrates_g}g</div>
              )}
              {item.per_100g.dietary_fibre_g !== undefined && (
                <div className="bg-green-50 p-2 rounded"><span className="font-medium">Fiber</span><br />{item.per_100g.dietary_fibre_g}g</div>
              )}
              {item.per_100g.protein_g !== undefined && (
                <div className="bg-red-50 p-2 rounded"><span className="font-medium">Protein</span><br />{item.per_100g.protein_g}g</div>
              )}
              {item.per_100g.fat_g !== undefined && (
                <div className="bg-orange-50 p-2 rounded"><span className="font-medium">Fat</span><br />{item.per_100g.fat_g}g</div>
              )}
              {item.per_100g.vitamin_c_mg !== undefined && (
                <div className="bg-purple-50 p-2 rounded"><span className="font-medium">Vitamin C</span><br />{item.per_100g.vitamin_c_mg}mg</div>
              )}
              {item.per_100g.iron_mg !== undefined && (
                <div className="bg-indigo-50 p-2 rounded"><span className="font-medium">Iron</span><br />{item.per_100g.iron_mg}mg</div>
              )}
              {item.per_100g.potassium_mg !== undefined && (
                <div className="bg-cyan-50 p-2 rounded"><span className="font-medium">Potassium</span><br />{item.per_100g.potassium_mg}mg</div>
              )}
              {item.per_100g.calcium_mg !== undefined && (
                <div className="bg-teal-50 p-2 rounded"><span className="font-medium">Calcium</span><br />{item.per_100g.calcium_mg}mg</div>
              )}
            </div>
          )}
          <div className="px-4 pb-3 flex flex-wrap gap-2 text-xs">
            {item.glycemic_index && <span className="bg-gray-100 px-2 py-0.5 rounded">GI: {item.glycemic_index}</span>}
            {item.glycemic_load && <span className="bg-gray-100 px-2 py-0.5 rounded">GL: {item.glycemic_load}</span>}
            {item.health_score_reason && (
              <p className="w-full text-gray-500 mt-1">{item.health_score_reason}</p>
            )}
            {item.data_confidence && (
              <p className="w-full text-gray-400 italic">Data confidence: {item.data_confidence}</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
