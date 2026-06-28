import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";
import { getFavourites, removeFavourite } from "../services/api";
import FavouritesCard from "../components/FavouritesCard";
import { ArrowLeft, Heart, Loader2 } from "lucide-react";

export default function Favourites() {
  const navigate = useNavigate();
  const { user } = useUser();
  const [favourites, setFavourites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      getFavourites(user.id).then(setFavourites).catch(() => {}).finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [user]);

  const handleRemove = async (recipeId) => {
    try {
      await removeFavourite(user.id, recipeId);
      setFavourites((prev) => prev.filter((r) => r.id !== recipeId));
    } catch {}
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <Heart size={48} className="mx-auto text-gray-300 mb-3" />
          <p className="text-gray-500">Please log in to view favourites.</p>
          <button onClick={() => navigate("/profile")} className="mt-4 bg-green-600 text-white px-6 py-2 rounded-lg">
            Go to Profile
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-lg mx-auto px-4 py-6">
        <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-gray-600 mb-4">
          <ArrowLeft size={18} /> Back
        </button>

        <div className="flex items-center gap-2 mb-6">
          <Heart size={22} className="text-red-500" />
          <h1 className="text-2xl font-bold">Favourites</h1>
        </div>

        {loading ? (
          <div className="flex justify-center py-12"><Loader2 size={24} className="animate-spin text-gray-400" /></div>
        ) : favourites.length === 0 ? (
          <div className="text-center py-12">
            <Heart size={48} className="mx-auto text-gray-300 mb-3" />
            <p className="text-gray-500">No favourites yet. Scan some vegetables and save recipes!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {favourites.map((recipe) => (
              <FavouritesCard key={recipe.id} recipe={recipe} onRemove={handleRemove} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
