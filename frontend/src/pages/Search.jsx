import { useState } from "react";
import { useNavigate } from "react-router-dom";
import SearchBar from "../components/SearchBar";
import { searchRecipes, searchByIngredients } from "../services/api";
import { ArrowLeft, Loader2, Search as SearchIcon, Utensils, Package } from "lucide-react";

export default function Search() {
  const navigate = useNavigate();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState("name");
  const [query, setQuery] = useState("");

  const handleSearch = async (q) => {
    setQuery(q);
    if (!q) { setResults([]); return; }
    setLoading(true);
    try {
      if (mode === "name") {
        const data = await searchRecipes(q);
        setResults(data.recipes || []);
      } else {
        const data = await searchByIngredients(q);
        setResults(data.recipes || []);
      }
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-lg mx-auto px-4 py-6">
        <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-gray-600 mb-4">
          <ArrowLeft size={18} /> Back
        </button>

        <h1 className="text-2xl font-bold text-gray-800 mb-4">Search</h1>

        <div className="flex gap-2 mb-4">
          <button
            onClick={() => { setMode("name"); setResults([]); }}
            className={`flex items-center gap-1 px-4 py-2 rounded-lg text-sm ${mode === "name" ? "bg-green-600 text-white" : "bg-gray-200 text-gray-600"}`}
          >
            <SearchIcon size={16} /> By Name
          </button>
          <button
            onClick={() => { setMode("ingredients"); setResults([]); }}
            className={`flex items-center gap-1 px-4 py-2 rounded-lg text-sm ${mode === "ingredients" ? "bg-green-600 text-white" : "bg-gray-200 text-gray-600"}`}
          >
            <Package size={16} /> By Ingredients
          </button>
        </div>

        {mode === "ingredients" && (
          <p className="text-xs text-gray-500 mb-2">Enter comma-separated ingredients (e.g., tomato, onion, garlic)</p>
        )}

        <SearchBar
          onSearch={handleSearch}
          placeholder={mode === "name" ? "Search recipes..." : "Search by ingredients..."}
        />

        {loading && (
          <div className="flex justify-center py-8">
            <Loader2 size={24} className="animate-spin text-green-600" />
          </div>
        )}

        {!loading && results.length > 0 && (
          <div className="mt-4 space-y-2">
            <p className="text-sm text-gray-500">{results.length} results</p>
            {results.map((recipe, i) => (
              <div key={i} className="bg-white border rounded-xl p-4 hover:shadow-sm transition">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-semibold">{recipe.name}</h4>
                    <div className="flex gap-2 mt-1 text-xs text-gray-500">
                      <span className="capitalize">{recipe.difficulty}</span>
                      {recipe.cuisine && <span>| {recipe.cuisine}</span>}
                      {recipe.calories_per_serving && <span>| {recipe.calories_per_serving} cal</span>}
                    </div>
                  </div>
                  <Utensils size={16} className="text-gray-400" />
                </div>
                {recipe.missing_ingredients?.length > 0 && (
                  <div className="mt-2">
                    <p className="text-xs text-orange-600">
                      Missing ingredients ({recipe.total_missing}): {recipe.missing_ingredients.join(", ")}
                    </p>
                  </div>
                )}
                {recipe.has_all_ingredients && (
                  <p className="text-xs text-green-600 mt-1">You have all ingredients!</p>
                )}
              </div>
            ))}
          </div>
        )}

        {!loading && query && results.length === 0 && (
          <div className="text-center py-8 text-gray-500">No recipes found</div>
        )}
      </div>
    </div>
  );
}
