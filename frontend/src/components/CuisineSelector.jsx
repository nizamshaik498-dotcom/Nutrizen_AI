import { useState } from "react";
import { Check } from "lucide-react";

const CUISINES = [
  "Indian", "Italian", "Chinese", "Mexican", "Japanese",
  "Thai", "French", "Mediterranean", "Korean", "American",
  "Middle Eastern", "Vietnamese", "Spanish", "Greek", "Brazilian",
];

export default function CuisineSelector({ selected, onSelect }) {
  const [custom, setCustom] = useState("");

  return (
    <div>
      <h3 className="text-lg font-semibold mb-3">Select Cuisine</h3>
      <div className="flex flex-wrap gap-2">
        {CUISINES.map((c) => (
          <button
            key={c}
            onClick={() => onSelect(c)}
            className={`flex items-center gap-1 px-4 py-2 rounded-full text-sm transition ${
              selected === c
                ? "bg-green-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {selected === c && <Check size={14} />}
            {c}
          </button>
        ))}
      </div>
      <div className="mt-3 flex gap-2">
        <input
          type="text"
          value={custom}
          onChange={(e) => setCustom(e.target.value)}
          placeholder="Other cuisine..."
          className="flex-1 px-3 py-2 border rounded-lg text-sm"
        />
        {custom && (
          <button
            onClick={() => { onSelect(custom); setCustom(""); }}
            className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm"
          >
            Add
          </button>
        )}
      </div>
    </div>
  );
}
