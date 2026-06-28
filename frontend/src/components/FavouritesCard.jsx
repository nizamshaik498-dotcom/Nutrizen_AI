import { Heart, Trash2, Clock, Flame } from "lucide-react";

export default function FavouritesCard({ recipe, onRemove }) {
  if (!recipe) return null;

  return (
    <div className="bg-white border rounded-xl p-4 hover:shadow-md transition">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            {recipe.difficulty && (
              <span className="text-xs bg-gray-100 px-2 py-0.5 rounded-full capitalize">{recipe.difficulty}</span>
            )}
            {recipe.cuisine && <span className="text-xs text-gray-500">{recipe.cuisine}</span>}
          </div>
          <h4 className="font-bold">{recipe.name}</h4>
          <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
            {recipe.calories && <span className="flex items-center gap-1"><Flame size={12} /> {recipe.calories} cal</span>}
          </div>
          {recipe.ingredients?.length > 0 && (
            <p className="text-xs text-gray-400 mt-1 truncate">
              {recipe.ingredients.slice(0, 5).join(", ")}
              {recipe.ingredients.length > 5 && "..."}
            </p>
          )}
        </div>
        <button
          onClick={() => onRemove && onRemove(recipe.id)}
          className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
}
