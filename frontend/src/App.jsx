import { Routes, Route } from "react-router-dom";
import { UserProvider } from "./context/UserContext";
import Home from "./pages/Home";
import Scan from "./pages/Scan";
import CuisineSelect from "./pages/CuisineSelect";
import WeightPlan from "./pages/WeightPlan";
import Favourites from "./pages/Favourites";
import Search from "./pages/Search";
import Profile from "./pages/Profile";
import History from "./pages/History";

export default function App() {
  return (
    <UserProvider>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/scan" element={<Scan />} />
        <Route path="/cuisine" element={<CuisineSelect />} />
        <Route path="/weight" element={<WeightPlan />} />
        <Route path="/favourites" element={<Favourites />} />
        <Route path="/search" element={<Search />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/history" element={<History />} />
      </Routes>
    </UserProvider>
  );
}
