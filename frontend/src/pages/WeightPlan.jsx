import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";
import WeightPlanner from "../components/WeightPlanner";
import { ArrowLeft, Check } from "lucide-react";
import { useState } from "react";

export default function WeightPlan() {
  const navigate = useNavigate();
  const { updateProfile } = useUser();
  const [saved, setSaved] = useState(false);

  const handleSave = (plan) => {
    updateProfile(plan);
    setSaved(true);
    setTimeout(() => navigate("/scan"), 1500);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-lg mx-auto px-4 py-6">
        <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-gray-600 mb-4">
          <ArrowLeft size={18} /> Back
        </button>

        <h1 className="text-2xl font-bold text-gray-800 mb-6">Weight & Goal Planner</h1>

        <WeightPlanner onSave={handleSave} />

        {saved && (
          <div className="flex items-center justify-center gap-2 mt-4 text-green-700 bg-green-50 rounded-lg p-3">
            <Check size={18} /> Plan saved! Redirecting to scanner...
          </div>
        )}
      </div>
    </div>
  );
}
