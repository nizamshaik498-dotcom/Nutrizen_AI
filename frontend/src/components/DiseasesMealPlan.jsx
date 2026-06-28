import { useState } from "react";
import { HeartPulse } from "lucide-react";

export default function DiseasesMealPlan({ diseaseMealPlan }) {
  const [activeMeal, setActiveMeal] = useState("breakfast");

  if (!diseaseMealPlan) return null;

  const daily = diseaseMealPlan.daily_plan;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <HeartPulse size={20} className="text-red-500" />
        <h3 className="text-lg font-semibold">Disease-Specific Meal Plan</h3>
      </div>

      <div className="bg-white border rounded-xl p-4">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-sm bg-red-100 text-red-700 px-2 py-0.5 rounded-full font-medium">
            {diseaseMealPlan.condition}
          </span>
          <span className="text-xs text-gray-500">{diseaseMealPlan.plan_type}</span>
        </div>

        {daily && (
          <>
            <div className="flex gap-1 mb-3">
              {["breakfast", "lunch", "dinner", "snacks"].filter(m => daily[m]).map((meal) => (
                <button
                  key={meal}
                  onClick={() => setActiveMeal(meal)}
                  className={`flex-1 py-1 text-xs rounded font-medium capitalize transition ${
                    activeMeal === meal
                      ? "bg-red-100 text-red-700"
                      : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                  }`}
                >
                  {meal}
                </button>
              ))}
            </div>

            {daily[activeMeal] && (
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="font-semibold">{daily[activeMeal].meal}</p>
                <p className="text-sm text-gray-600">
                  {daily[activeMeal].calories} kcal
                </p>
                {daily[activeMeal].key_nutrients && (
                  <p className="text-xs text-gray-500">
                    Key nutrients: {daily[activeMeal].key_nutrients}
                  </p>
                )}
                {daily[activeMeal].avoid && (
                  <p className="text-xs text-red-600">Avoid: {daily[activeMeal].avoid}</p>
                )}
                {daily[activeMeal].recipe_steps?.length > 0 && (
                  <ol className="mt-2 text-xs text-gray-600 list-decimal list-inside space-y-1">
                    {daily[activeMeal].recipe_steps.map((step, i) => (
                      <li key={i}>{step}</li>
                    ))}
                  </ol>
                )}
              </div>
            )}
          </>
        )}

        {diseaseMealPlan.foods_to_always_avoid?.length > 0 && (
          <div className="mt-3">
            <p className="text-sm font-medium text-red-700">Always Avoid:</p>
            <div className="flex flex-wrap gap-1 mt-1">
              {diseaseMealPlan.foods_to_always_avoid.map((f, i) => (
                <span key={i} className="bg-red-100 text-red-700 text-xs px-2 py-0.5 rounded">{f}</span>
              ))}
            </div>
          </div>
        )}

        {diseaseMealPlan.foods_to_always_include?.length > 0 && (
          <div className="mt-2">
            <p className="text-sm font-medium text-green-700">Always Include:</p>
            <div className="flex flex-wrap gap-1 mt-1">
              {diseaseMealPlan.foods_to_always_include.map((f, i) => (
                <span key={i} className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded">{f}</span>
              ))}
            </div>
          </div>
        )}

        {diseaseMealPlan.weekly_variation_tip && (
          <p className="text-xs text-gray-500 mt-2 italic">{diseaseMealPlan.weekly_variation_tip}</p>
        )}

        {diseaseMealPlan.medical_disclaimer && (
          <p className="text-xs text-gray-400 mt-3 border-t pt-2 italic">{diseaseMealPlan.medical_disclaimer}</p>
        )}
      </div>
    </div>
  );
}
