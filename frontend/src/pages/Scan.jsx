import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";
import { scanVegetables } from "../services/api";
import Scanner from "../components/Scanner";
import AllergenAlert from "../components/AllergenAlert";
import FreshnessReport from "../components/FreshnessReport";
import SeasonalAlert from "../components/SeasonalAlert";
import RecipeCard from "../components/RecipeCard";
import AlternativeDishes from "../components/AlternativeDishes";
import LeftoverSuggestions from "../components/LeftoverSuggestions";
import NutritionTable from "../components/NutritionTable";
import PortionControl from "../components/PortionControl";
import AllergyReport from "../components/AllergyReport";
import DiseasesMealPlan from "../components/DiseasesMealPlan";
import Substitutions from "../components/Substitutions";
import VoiceGuide from "../components/VoiceGuide";
import SocialShare from "../components/SocialShare";
import Improvements from "../components/Improvements";
import { ArrowLeft, Loader2, ChevronDown, ChevronUp } from "lucide-react";

export default function Scan() {
  const navigate = useNavigate();
  const { user, addScanResult } = useUser();
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [expandedSections, setExpandedSections] = useState({});

  const toggleSection = (key) => {
    setExpandedSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleScan = async (imageFile) => {
    if (!user) {
      navigate("/profile");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const data = await scanVegetables(imageFile, user.id);
      setResult(data.result);
      addScanResult({ scan_id: data.scan_id, ...data.result });
    } catch (err) {
      setError(err.response?.data?.detail || err.message || "Scan failed");
    } finally {
      setLoading(false);
    }
  };

  const sections = result ? [
    { key: "scan_summary", label: "Scan Summary", component: result.scan_summary && (
      <div className="bg-white border rounded-xl p-4">
        <p className="font-semibold">{result.scan_summary.total_vegetables_detected} vegetables detected</p>
        {result.scan_summary.items?.map((item, i) => (
          <div key={i} className="flex items-center justify-between py-1 text-sm">
            <span>{item.common_name}</span>
            <span className="text-gray-500">{(item.confidence_level * 100).toFixed(0)}%</span>
          </div>
        ))}
      </div>
    )},
    { key: "freshness", label: "Freshness Report", component: <FreshnessReport freshnessReport={result.freshness_report} /> },
    { key: "seasonal", label: "Seasonal Awareness", component: <SeasonalAlert seasonalAwareness={result.seasonal_awareness} /> },
    { key: "recipes", label: `Recipes (${result.seasonal_awareness?.cuisine_selected || ""})`, component: (
      <div className="space-y-3">
        {["easy", "intermediate", "advanced"].map((level) =>
          result.recipes?.[level] ? (
            <RecipeCard key={level} recipe={result.recipes[level]} difficulty={level} />
          ) : null
        )}
      </div>
    )},
    { key: "alternatives", label: "Alternative Dishes", component: <AlternativeDishes alternatives={result.alternative_dishes} /> },
    { key: "leftovers", label: "Leftover Ideas", component: <LeftoverSuggestions suggestions={result.leftover_suggestions} /> },
    { key: "nutrition", label: "Nutrition", component: <NutritionTable nutrition={result.nutrition} /> },
    { key: "portion", label: "Portion Control", component: <PortionControl portionControl={result.portion_control} /> },
    { key: "allergy_report", label: "Allergy Report", component: <AllergyReport allergyReport={result.allergy_report} /> },
    { key: "disease_plan", label: "Meal Plans", component: <DiseasesMealPlan diseaseMealPlan={result.disease_meal_plan} /> },
    { key: "substitutions", label: "Substitutions", component: <Substitutions substitutions={result.substitutions} /> },
    { key: "voice", label: "Voice Guide", component: <VoiceGuide voiceCookingGuide={result.voice_cooking_guide} /> },
    { key: "share", label: "Share", component: <SocialShare socialShare={result.social_share} /> },
    { key: "improvements", label: "AI Recommendations", component: <Improvements improvements={result.improvements} /> },
  ] : [];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-lg mx-auto px-4 py-6">
        <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-gray-600 mb-4">
          <ArrowLeft size={18} /> Back
        </button>

        <h1 className="text-2xl font-bold text-gray-800 mb-6">Scan Vegetables</h1>

        {!user && (
          <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 p-4 rounded-xl mb-4 text-sm">
            Please set up your profile first to get personalized results.
          </div>
        )}

        <Scanner onScanComplete={handleScan} />

        {loading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 size={32} className="animate-spin text-green-600" />
            <p className="ml-3 text-gray-600">Analyzing with AI...</p>
          </div>
        )}

        {error && (
          <div className="bg-red-100 border border-red-300 text-red-700 p-4 rounded-xl mt-4">
            {error}
          </div>
        )}

        {result && (
          <div className="mt-6 space-y-3">
            <AllergenAlert allergenAlert={result.allergen_alert} />
            {sections.map((section) => (
              <div key={section.key}>
                <button
                  onClick={() => toggleSection(section.key)}
                  className="w-full flex items-center justify-between bg-white border rounded-xl px-4 py-3 hover:shadow-sm transition"
                >
                  <span className="font-medium text-gray-800">{section.label}</span>
                  {expandedSections[section.key] ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </button>
                {expandedSections[section.key] && (
                  <div className="mt-2">{section.component}</div>
                )}
              </div>
            ))}

            {result.integration_check && (
              <div className="bg-gray-50 border rounded-xl p-4">
                <h4 className="font-medium text-sm mb-2">Integration Status</h4>
                {result.integration_check.map((item, i) => (
                  <div key={i} className="flex items-center justify-between text-xs py-1">
                    <span>{item.vegetable_name}</span>
                    <span className={`px-2 py-0.5 rounded ${
                      item.overall_status === "complete" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                    }`}>
                      {item.overall_status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
