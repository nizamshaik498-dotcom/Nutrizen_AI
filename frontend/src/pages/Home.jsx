import { Link, useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";
import { Camera, BookHeart, Search, History, User, Scale, Utensils, ArrowRight } from "lucide-react";

export default function Home() {
  const { user } = useUser();
  const navigate = useNavigate();

  const quickActions = [
    { label: "Scan", icon: Camera, path: "/scan", color: "bg-green-500" },
    { label: "Cuisine", icon: Utensils, path: "/cuisine", color: "bg-orange-500" },
    { label: "Weight", icon: Scale, path: "/weight", color: "bg-blue-500" },
    { label: "Search", icon: Search, path: "/search", color: "bg-purple-500" },
    { label: "Favourites", icon: BookHeart, path: "/favourites", color: "bg-red-500" },
    { label: "History", icon: History, path: "/history", color: "bg-teal-500" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50">
      <div className="max-w-lg mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-green-800">NutriZen AI</h1>
            <p className="text-sm text-gray-500">Smart kitchen intelligence</p>
          </div>
          <Link to="/profile" className="p-2 bg-white rounded-full shadow hover:shadow-md">
            <User size={22} className="text-gray-600" />
          </Link>
        </div>

        {!user ? (
          <div className="bg-green-600 text-white rounded-2xl p-6 mb-6">
            <h2 className="text-xl font-bold mb-2">Welcome to NutriZen AI</h2>
            <p className="text-green-100 text-sm mb-4">
              Scan vegetables, get recipes, track nutrition, and manage your diet with AI.
            </p>
            <div className="flex gap-2">
              <Link to="/profile" className="bg-white text-green-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-50">
                Get Started
              </Link>
              <Link to="/scan" className="bg-green-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-400">
                Try Scanner
              </Link>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 mb-6">
            <p className="text-sm text-gray-500">Welcome back</p>
            <p className="text-xl font-bold text-gray-800">{user.name}</p>
            {user.daily_calorie_target && (
              <div className="flex items-center gap-2 mt-2 text-sm">
                <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded">
                  {user.daily_calorie_target} kcal
                </span>
                <span className="text-gray-400">|</span>
                <span className="capitalize text-gray-600">{user.fitness_goal?.replace("_", " ")}</span>
              </div>
            )}
          </div>
        )}

        <div className="grid grid-cols-3 gap-3 mb-6">
          {quickActions.map((action) => (
            <button
              key={action.label}
              onClick={() => navigate(action.path)}
              className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition flex flex-col items-center gap-2"
            >
              <div className={`${action.color} p-3 rounded-full text-white`}>
                <action.icon size={20} />
              </div>
              <span className="text-xs font-medium text-gray-600">{action.label}</span>
            </button>
          ))}
        </div>

        {user && (
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <h3 className="font-semibold text-gray-800 mb-3">Quick Start</h3>
            <button
              onClick={() => navigate("/scan")}
              className="w-full flex items-center justify-between bg-green-50 hover:bg-green-100 rounded-lg p-3 transition"
            >
              <div className="flex items-center gap-3">
                <Camera size={20} className="text-green-600" />
                <span className="text-sm font-medium text-gray-700">Scan a vegetable</span>
              </div>
              <ArrowRight size={18} className="text-green-600" />
            </button>
            <button
              onClick={() => navigate("/cuisine")}
              className="w-full flex items-center justify-between bg-orange-50 hover:bg-orange-100 rounded-lg p-3 mt-2 transition"
            >
              <div className="flex items-center gap-3">
                <Utensils size={20} className="text-orange-600" />
                <span className="text-sm font-medium text-gray-700">Explore cuisines</span>
              </div>
              <ArrowRight size={18} className="text-orange-600" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
