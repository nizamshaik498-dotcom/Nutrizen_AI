import { createContext, useContext, useState, useEffect } from "react";

const UserContext = createContext(null);

const STORAGE_KEY = "nutrizen_user";

export function UserProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const [scanResults, setScanResults] = useState(() => {
    try {
      const stored = localStorage.getItem("nutrizen_scan_results");
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [user]);

  useEffect(() => {
    localStorage.setItem("nutrizen_scan_results", JSON.stringify(scanResults));
  }, [scanResults]);

  const login = (userData) => {
    setUser(userData);
  };

  const logout = () => {
    setUser(null);
    setScanResults([]);
  };

  const updateProfile = (updates) => {
    setUser((prev) => ({ ...prev, ...updates }));
  };

  const addScanResult = (result) => {
    setScanResults((prev) => [result, ...prev]);
  };

  const value = {
    user,
    setUser,
    login,
    logout,
    updateProfile,
    scanResults,
    addScanResult,
    isLoggedIn: !!user,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}
