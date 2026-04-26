import { BrowserRouter, Routes, Route } from "react-router-dom";
import Splash from "./pages/Splash";
import Onboarding from "./pages/Onboarding";
import Login from "./pages/Login";
import Map from "./pages/Map";
import Details from "./pages/Details";
import Scan from "./pages/Scan";
import Profile from "./pages/Profile";
import Project from "./pages/Project";
import Bottle from "./pages/Bottle";
import Alerts from "./pages/Alerts";
import OfflineMaps from "./pages/OfflineMaps";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Splash />} />
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="/login" element={<Login />} />
        <Route path="/map" element={<Map />} />
        <Route path="/details" element={<Details />} />
        <Route path="/scan" element={<Scan />} />
        <Route path="/bottle" element={<Bottle />} />
        <Route path="/alerts" element={<Alerts />} />
        <Route path="/offline-maps" element={<OfflineMaps />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/project" element={<Project />} />
      </Routes>
    </BrowserRouter>
  );
}
