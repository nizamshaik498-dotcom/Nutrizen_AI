import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";
import { register, login as apiLogin, updateProfile as apiUpdateProfile } from "../services/api";
import { ArrowLeft, User, Mail, Lock, Save, LogOut, Loader2 } from "lucide-react";

export default function Profile() {
  const navigate = useNavigate();
  const { user, login, logout, updateProfile } = useUser();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [form, setForm] = useState({
    name: "", email: "", password: "", weight_kg: "", height_cm: "", age: "",
    gender: "male", fitness_goal: "maintain", preferred_cuisine: "Indian", language: "English",
  });

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name || "",
        email: user.email || "",
        password: "",
        weight_kg: user.weight_kg || "",
        height_cm: user.height_cm || "",
        age: user.age || "",
        gender: user.gender || "male",
        fitness_goal: user.fitness_goal || "maintain",
        preferred_cuisine: user.preferred_cuisine || "Indian",
        language: user.language || "English",
      });
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      if (user) {
        const data = await apiUpdateProfile(user.id, {
          name: form.name, weight_kg: parseFloat(form.weight_kg) || null,
          height_cm: parseFloat(form.height_cm) || null, age: parseInt(form.age) || null,
          gender: form.gender, fitness_goal: form.fitness_goal,
          preferred_cuisine: form.preferred_cuisine, language: form.language,
        });
        updateProfile(data.user);
      } else if (isLogin) {
        const data = await apiLogin(form.email, form.password);
        login({ ...data.user, token: data.token });
      } else {
        const data = await register({
          ...form, weight_kg: parseFloat(form.weight_kg) || null,
          height_cm: parseFloat(form.height_cm) || null, age: parseInt(form.age) || null,
        });
        login({ ...data.user, token: data.token });
      }
    } catch (err) {
      setError(err.response?.data?.detail || err.message || "Operation failed");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-lg mx-auto px-4 py-6">
        <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-gray-600 mb-4">
          <ArrowLeft size={18} /> Back
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="bg-green-100 p-3 rounded-full">
            <User size={24} className="text-green-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">{user ? "Profile" : "Account"}</h1>
            <p className="text-sm text-gray-500">
              {user ? "Manage your preferences" : "Sign in to get started"}
            </p>
          </div>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-300 text-red-700 p-3 rounded-xl mb-4 text-sm">{error}</div>
        )}

        {!user && !isLogin && (
          <div className="flex gap-2 mb-4">
            <button onClick={() => setIsLogin(true)} className="flex-1 py-2 bg-green-600 text-white rounded-lg text-sm">Sign In</button>
            <button onClick={() => setIsLogin(false)} className="flex-1 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm">Register</button>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3">
          {(!user || !isLogin) && (
            <>
              {!isLogin && (
                <div>
                  <label className="text-sm text-gray-600">Name</label>
                  <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg text-sm" required />
                </div>
              )}
              <div>
                <label className="text-sm text-gray-600">Email</label>
                <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg text-sm" required />
              </div>
              <div>
                <label className="text-sm text-gray-600">Password</label>
                <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg text-sm" required={!user} />
              </div>
            </>
          )}

          {user && (
            <>
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
                <label className="text-sm text-gray-600">Fitness Goal</label>
                <select value={form.fitness_goal} onChange={(e) => setForm({ ...form, fitness_goal: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg text-sm">
                  <option value="lose_weight">Lose Weight</option>
                  <option value="maintain">Maintain</option>
                  <option value="gain_weight">Gain Weight</option>
                </select>
              </div>

              <div>
                <label className="text-sm text-gray-600">Preferred Cuisine</label>
                <input type="text" value={form.preferred_cuisine} onChange={(e) => setForm({ ...form, preferred_cuisine: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg text-sm" />
              </div>

              <div>
                <label className="text-sm text-gray-600">Language</label>
                <select value={form.language} onChange={(e) => setForm({ ...form, language: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg text-sm">
                  <option value="English">English</option>
                  <option value="Hindi">Hindi</option>
                  <option value="Telugu">Telugu</option>
                  <option value="Tamil">Tamil</option>
                  <option value="Spanish">Spanish</option>
                  <option value="French">French</option>
                </select>
              </div>
            </>
          )}

          <button type="submit" disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-green-600 text-white py-3 rounded-xl font-medium hover:bg-green-700 disabled:opacity-50">
            {loading ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
            {user ? "Update Profile" : isLogin ? "Sign In" : "Register"}
          </button>
        </form>

        {user && (
          <button onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 mt-3 bg-red-50 text-red-600 py-3 rounded-xl font-medium hover:bg-red-100">
            <LogOut size={18} /> Log Out
          </button>
        )}
      </div>
    </div>
  );
}
