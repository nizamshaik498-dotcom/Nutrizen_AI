export default function Improvements({ improvements }) {
  if (!improvements) return null;

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">AI Recommendations</h3>

      {improvements.meal_balance_score_out_of_10 && (
        <div className="bg-white border rounded-xl p-4 text-center">
          <p className="text-sm text-gray-500">Meal Balance Score</p>
          <p className="text-3xl font-bold text-green-600">
            {improvements.meal_balance_score_out_of_10}/10
          </p>
          {improvements.meal_balance_justification && (
            <p className="text-xs text-gray-500 mt-1">{improvements.meal_balance_justification}</p>
          )}
        </div>
      )}

      {improvements.nutritional_gaps && (
        <div className="bg-orange-50 border border-orange-200 rounded-xl p-4">
          <p className="font-medium text-orange-800">Nutritional Gaps</p>
          <p className="text-sm text-orange-700">{improvements.nutritional_gaps}</p>
        </div>
      )}

      {improvements.suggested_add_ons?.length > 0 && (
        <div className="space-y-2">
          <p className="font-medium text-sm">Suggested Add-ons</p>
          {improvements.suggested_add_ons.map((addon, i) => (
            <div key={i} className="bg-green-50 border border-green-200 rounded-lg p-3">
              <p className="font-medium text-green-800">{addon.ingredient}</p>
              <p className="text-xs text-green-700">{addon.reason}</p>
              <div className="flex gap-2 mt-1 text-xs">
                <span className="bg-green-100 px-2 py-0.5 rounded">{addon.nutrient_it_adds}</span>
                {addon.makes_it_tastier && (
                  <span className="bg-green-100 px-2 py-0.5 rounded">Tastier: {addon.makes_it_tastier}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {improvements.cooking_technique_upgrades && (
        <div className="space-y-2">
          <p className="font-medium text-sm">Technique Upgrades</p>
          {Object.entries(improvements.cooking_technique_upgrades).map(([level, tip]) => (
            tip && (
              <div key={level} className="bg-purple-50 border border-purple-200 rounded-lg p-3">
                <span className="text-xs bg-purple-200 text-purple-700 px-2 py-0.5 rounded-full capitalize">{level}</span>
                <p className="text-sm text-purple-800 mt-1">{tip}</p>
              </div>
            )
          ))}
        </div>
      )}

      {improvements.next_scan_suggestion && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <p className="font-medium text-blue-800">Next Scan Suggestion</p>
          <p className="text-sm text-blue-700">{improvements.next_scan_suggestion}</p>
        </div>
      )}

      {improvements.overall_verdict && (
        <div className="bg-gray-50 border rounded-xl p-4">
          <p className="font-medium">Overall Verdict</p>
          <p className="text-sm text-gray-700 mt-1">{improvements.overall_verdict}</p>
        </div>
      )}
    </div>
  );
}
