import { useState } from "react";
import { Search, X } from "lucide-react";

export default function SearchBar({ onSearch, placeholder }) {
  const [query, setQuery] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim() && onSearch) {
      onSearch(query.trim());
    }
  };

  const clear = () => {
    setQuery("");
    if (onSearch) onSearch("");
  };

  return (
    <form onSubmit={handleSubmit} className="relative">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder || "Search recipes..."}
        className="w-full pl-10 pr-10 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
      />
      <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
      {query && (
        <button type="button" onClick={clear} className="absolute right-3 top-1/2 -translate-y-1/2">
          <X size={18} className="text-gray-400 hover:text-gray-600" />
        </button>
      )}
    </form>
  );
}
