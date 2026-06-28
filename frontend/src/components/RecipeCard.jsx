import { Clock, Flame, ChefHat, Heart } from "lucide-react";
import { useState } from "react";

export default function RecipeCard({ recipe, difficulty, onFavourite }) {
  const [showSteps, setShowSteps] = useState(false);
  const [faved, setFaved] = useState(false);

  if (!recipe) return null;

  const diffColors = {
    easy: "bg-green-100 text-green-700",
    intermediate: "bg-yellow-100 text-yellow-700",
    advanced: "bg-red-100 text-red-700",
  };

  const handleFav = () => {
    setFaved(!faved);
    if (onFavourite) onFavourite(recipe, !faved);
  };

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
      <div className="p-5">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${diffColors[difficulty] || "bg-gray-100"}`}>
                {difficulty}
              </span>
              {recipe.cuisine_style && (
                <span className="text-xs text-gray-500">{recipe.cuisine_style}</span>
              )}
            </div>
            <h4 className="text-lg font-bold">{recipe.name}</h4>
          </div>
          <button onClick={handleFav} className="p-1">
            <Heart size={20} className={faved ? "fill-red-500 text-red-500" : "text-gray-400"} />
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-3 mt-3 text-sm text-gray-600">
          {recipe.total_time_minutes && (
            <span className="flex items-center gap-1"><Clock size={14} /> {recipe.total_time_minutes}min</span>
          )}
          {recipe.calories_per_serving && (
            <span className="flex items-center gap-1"><Flame size={14} /> {recipe.calories_per_serving} cal</span>
          )}
          {recipe.servings && <span className="flex items-center gap-1"><ChefHat size={14} /> {recipe.servings} servings</span>}
        </div>

        {recipe.macros_per_serving && (
          <div className="flex gap-2 mt-2 text-xs">
            <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded">
              P: {recipe.macros_per_serving.protein_g}g
            </span>
            <span className="bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded">
              C: {recipe.macros_per_serving.carbs_g}g
            </span>
            <span className="bg-orange-100 text-orange-700 px-2 py-0.5 rounded">
              F: {recipe.macros_per_serving.fat_g}g
            </span>
          </div>
        )}

        {recipe.missing_ingredients?.length > 0 && (
          <p className="text-sm text-orange-600 mt-2">
            Missing: {recipe.missing_ingredients.join(", ")}
          </p>
        )}

        {recipe.additional_ingredients_required?.length > 0 && (
          <div className="mt-2">
            <p className="text-sm font-medium text-gray-700">Ingredients needed:</p>
            <ul className="list-disc list-inside text-sm text-gray-600">
              {recipe.additional_ingredients_required.map((ing, i) => (
                <li key={i}>{ing}</li>
              ))}
            </ul>
          </div>
        )}

        <button
          onClick={() => setShowSteps(!showSteps)}
          className="mt-3 text-sm text-green-600 hover:text-green-700 font-medium"
        >
          {showSteps ? "Hide steps" : "Show steps"}
        </button>

        {showSteps && recipe.steps?.length > 0 && (
          <ol className="mt-3 space-y-2 text-sm text-gray-700 list-decimal list-inside">
            {recipe.steps.map((step, i) => (
              <li key={i} className="leading-relaxed">{step}</li>
            ))}
          </ol>
        )}

        {recipe.chef_tip && (
          <p className="mt-3 text-sm italic text-gray-500 bg-gray-50 p-2 rounded">
            Chef tip: {recipe.chef_tip}
          </p>
        )}

        {recipe.plating_suggestion && (
          <p className="mt-1 text-xs text-gray-400">Plating: {recipe.plating_suggestion}</p>
        )}
      </div>
    </div>
  );
}
