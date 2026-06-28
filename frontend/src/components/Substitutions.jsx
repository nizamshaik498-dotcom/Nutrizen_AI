export default function Substitutions({ substitutions }) {
  if (!substitutions?.length) return null;

  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold">Smart Substitutions</h3>
      {substitutions.map((sub, i) => (
        <div key={i} className="bg-amber-50 border border-amber-200 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-red-100 text-red-700 text-xs px-2 py-0.5 rounded-full">
              {sub.original_vegetable_name}
            </span>
            <span className="text-gray-400">→</span>
            <span className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full">
              {sub.substitute_vegetable}
            </span>
          </div>
          <p className="text-sm text-gray-600">Risk: {sub.risk_reason}</p>
          <p className="text-sm text-gray-600">Affects: {sub.affected_groups?.join(", ")}</p>
          <p className="text-sm text-green-700 mt-1">Why safer: {sub.why_safer}</p>
          {sub.nutritional_equivalence && (
            <p className="text-xs text-gray-500 mt-1">{sub.nutritional_equivalence}</p>
          )}
          {sub.recipe_update && (
            <div className="mt-2 bg-white rounded p-2 text-sm">
              <p className="font-medium">Recipe Update:</p>
              <p>Replace in: {sub.recipe_update.replaces_in_recipe}</p>
              <p className="text-green-700">→ {sub.recipe_update.updated_ingredient_line}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
