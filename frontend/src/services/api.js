import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

const api = axios.create({
  baseURL: API_URL,
  timeout: 120000,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  const stored = localStorage.getItem("nutrizen_user");
  if (stored) {
    try {
      const user = JSON.parse(stored);
      if (user.token) {
        config.headers.Authorization = `Bearer ${user.token}`;
      }
    } catch {}
  }
  return config;
});

export async function scanVegetables(imageFile, userId) {
  const form = new FormData();
  form.append("image", imageFile);
  form.append("user_id", String(userId));
  const res = await api.post("/api/scan", form, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
}

export async function getScanHistory(userId) {
  const res = await api.get(`/api/scan/history/${userId}`);
  return res.data;
}

export async function getScanResult(scanId) {
  const res = await api.get(`/api/scan/${scanId}`);
  return res.data;
}

export async function register(userData) {
  const res = await api.post("/api/auth/register", userData);
  return res.data;
}

export async function login(email, password) {
  const res = await api.post("/api/auth/login", { email, password });
  return res.data;
}

export async function getProfile(userId) {
  const res = await api.get(`/api/auth/profile/${userId}`);
  return res.data;
}

export async function updateProfile(userId, data) {
  const res = await api.put(`/api/auth/profile/${userId}`, data);
  return res.data;
}

export async function getFavourites(userId) {
  const res = await api.get(`/api/favourites/${userId}`);
  return res.data;
}

export async function saveFavourite(userId, recipeId) {
  const res = await api.post("/api/favourites", { user_id: userId, recipe_id: recipeId });
  return res.data;
}

export async function removeFavourite(userId, recipeId) {
  const res = await api.delete(`/api/favourites/${userId}/${recipeId}`);
  return res.data;
}

export async function getPantry(userId) {
  const res = await api.get(`/api/pantry/${userId}`);
  return res.data;
}

export async function addToPantry(userId, item) {
  const res = await api.post(`/api/pantry/${userId}`, item);
  return res.data;
}

export async function removeFromPantry(userId, itemId) {
  const res = await api.delete(`/api/pantry/${userId}/${itemId}`);
  return res.data;
}

export async function searchRecipes(query) {
  const res = await api.get(`/api/search?q=${encodeURIComponent(query)}`);
  return res.data;
}

export async function searchByIngredients(ingredients) {
  const res = await api.get(`/api/search/ingredients?items=${encodeURIComponent(ingredients)}`);
  return res.data;
}

export default api;
