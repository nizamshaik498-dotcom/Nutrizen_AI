import { useState } from "react";
import { Scale, Target, Flame } from "lucide-react";

export default function WeightPlanner({ onSave }) {
  const [form, setForm] = useState({
    weight_kg: "",
    height_cm: "",
    age: "",
    gender: "male",
    fitness_goal: "maintain",
  });

  const [results, setResults] = useState(null);

  const calculate = () => {
    const w = parseFloat(form.weight_kg);
    const h = parseFloat(form.height_cm);
    const a = parseInt(form.age);

    if (!w || !h || !a) return;

    let bmr = 10 * w + 6.25 * h - 5 * a;
    bmr += form.gender === "male" ? 5 : -161;

    const tdee = bmr * 1.55;
    let calories = tdee;
    if (form.fitness_goal === "lose_weight") calories = tdee - 500;
    else if (form.fitness_goal === "gain_weight") calories = tdee + 300;

    const protein = Math.round((calories * 0.3) / 4);
    const carbs = Math.round((calories * 0.4) / 4);
    const fat = Math.round((calories * 0.3) / 9);

    const plan = {
      daily_calorie_target: Math.round(calories),
      protein_g: protein,
      carbs_g: carbs,
      fat_g: fat,
      ...form,
    };

    setResults(plan);
    if (onSave) onSave(plan);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Scale size={20} className="text-blue-600" />
        <h3 className="text-lg font-semibold">Weight Planner</h3>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-sm text-gray-600">Weight (kg)</label>
          <input type="number" value={form.weight_kg} onChange={(e) => setForm({ ...form, weight_kg: e.target.value })}
            className="w-full px-3 py-2 border rounded-lg text-sm" />
        </div>
        <div>
          <label className="text-sm text-gray-600">Height (cm)</label>
          <input type="number" value={form.height_cm} onChange={(e) => setForm({ ...form, height_cm: e.target.value })}
            className="w-full px-3 py-2 border rounded-lg text-sm" />
        </div>
        <div>
          <label className="text-sm text-gray-600">Age</label>
          <input type="number" value={form.age} onChange={(e) => setForm({ ...form, age: e.target.value })}
            className="w-full px-3 py-2 border rounded-lg text-sm" />
        </div>
        <div>
          <label className="text-sm text-gray-600">Gender</label>
          <select value={form.gender} onChange={(e) => setForm({ ...form, gender: e.target.value })}
            className="w-full px-3 py-2 border rounded-lg text-sm">
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </div>
      </div>

      <div>
        <label className="text-sm text-gray-600">Goal</label>
        <div className="flex gap-2 mt-1">
          {[
            { value: "lose_weight", label: "Lose Weight", icon: Flame },
            { value: "maintain", label: "Maintain", icon: Target },
            { value: "gain_weight", label: "Gain Weight", icon: Scale },
          ].map((g) => (
            <button
              key={g.value}
              onClick={() => setForm({ ...form, fitness_goal: g.value })}
              className={`flex-1 flex items-center justify-center gap-1 py-2 rounded-lg text-sm transition ${
                form.fitness_goal === g.value
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              <g.icon size={16} /> {g.label}
            </button>
          ))}
        </div>
      </div>

      <button onClick={calculate} className="w-full py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
        Calculate
      </button>

      {results && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 space-y-2">
          <div className="flex items-center gap-2">
            <Flame size={18} className="text-orange-500" />
            <span className="font-bold">{results.daily_calorie_target} kcal/day</span>
          </div>
          <div className="flex gap-2 text-sm">
            <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded">Protein: {results.protein_g}g</span>
            <span className="bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded">Carbs: {results.carbs_g}g</span>
            <span className="bg-orange-100 text-orange-700 px-2 py-0.5 rounded">Fat: {results.fat_g}g</span>
          </div>
        </div>
      )}
    </div>
  );
}
