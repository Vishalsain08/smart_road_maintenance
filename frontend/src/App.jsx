import { Route, Routes } from "react-router-dom";
import PublicLayout from "./layouts/PublicLayout.jsx";
import AdminDashboard from "./pages/admin/AdminDashboard.jsx";
import MapOverview from "./pages/admin/MapOverview.jsx";
import ComplaintDetails from "./pages/citizen/ComplaintDetails.jsx";
import CreateComplaint from "./pages/citizen/CreateComplaint.jsx";
import CitizenDashboard from "./pages/citizen/CitizenDashboard.jsx";
import MyComplaints from "./pages/citizen/MyComplaints.jsx";
import LandingPage from "./pages/public/LandingPage.jsx";
import Login from "./pages/public/Login.jsx";
import Register from "./pages/public/Register.jsx";
import ProtectedRoute from "./routes/ProtectedRoute.jsx";

function App() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route element={<ProtectedRoute allowedRoles={["citizen"]} />}>
          <Route path="/citizen" element={<CitizenDashboard />} />
          <Route path="/citizen/create" element={<CreateComplaint />} />
          <Route path="/citizen/complaints" element={<MyComplaints />} />
          <Route path="/citizen/complaints/:id" element={<ComplaintDetails />} />
        </Route>

        <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/map" element={<MapOverview />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
