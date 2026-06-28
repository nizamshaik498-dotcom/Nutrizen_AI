import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";
import CuisineSelector from "../components/CuisineSelector";
import { ArrowLeft, Check } from "lucide-react";
import { useState } from "react";

export default function CuisineSelect() {
  const navigate = useNavigate();
  const { user, updateProfile } = useUser();
  const [selected, setSelected] = useState(user?.preferred_cuisine || "");
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    if (selected) {
      updateProfile({ preferred_cuisine: selected });
      setSaved(true);
      setTimeout(() => navigate("/scan"), 1000);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-lg mx-auto px-4 py-6">
        <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-gray-600 mb-4">
          <ArrowLeft size={18} /> Back
        </button>

        <h1 className="text-2xl font-bold text-gray-800 mb-2">Choose Your Cuisine</h1>
        <p className="text-gray-500 text-sm mb-6">
          Recipes will be tailored to your preferred cuisine style.
        </p>

        <CuisineSelector selected={selected} onSelect={setSelected} />

        <button
          onClick={handleSave}
          disabled={!selected || saved}
          className="w-full mt-6 flex items-center justify-center gap-2 bg-green-600 text-white py-3 rounded-xl font-medium hover:bg-green-700 disabled:opacity-50"
        >
          {saved ? <><Check size={18} /> Saved!</> : "Save & Continue"}
        </button>
      </div>
    </div>
  );
}
