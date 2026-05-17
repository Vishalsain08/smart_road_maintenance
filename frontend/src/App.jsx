import { Route, Routes } from "react-router-dom";
import AdminLayout from "./layouts/AdminLayout.jsx";
import CitizenLayout from "./layouts/CitizenLayout.jsx";
import EngineerLayout from "./layouts/EngineerLayout.jsx";
import PublicLayout from "./layouts/PublicLayout.jsx";
import AdminDashboard from "./pages/admin/AdminDashboard.jsx";
import Analytics from "./pages/admin/Analytics.jsx";
import Engineers from "./pages/admin/Engineers.jsx";
import ManageComplaints from "./pages/admin/ManageComplaints.jsx";
import MapOverview from "./pages/admin/MapOverview.jsx";
import ComplaintDetails from "./pages/citizen/ComplaintDetails.jsx";
import CreateComplaint from "./pages/citizen/CreateComplaint.jsx";
import CitizenDashboard from "./pages/citizen/CitizenDashboard.jsx";
import MyComplaints from "./pages/citizen/MyComplaints.jsx";
import AssignedComplaints from "./pages/engineer/AssignedComplaints.jsx";
import EngineerComplaintDetails from "./pages/engineer/EngineerComplaintDetails.jsx";
import EngineerDashboard from "./pages/engineer/EngineerDashboard.jsx";
import ResolvedComplaints from "./pages/engineer/ResolvedComplaints.jsx";
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
      </Route>

      <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="complaints" element={<ManageComplaints />} />
          <Route path="engineers" element={<Engineers />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="map" element={<MapOverview />} />
        </Route>
      </Route>

      <Route element={<ProtectedRoute allowedRoles={["citizen"]} />}>
        <Route path="/citizen" element={<CitizenLayout />}>
          <Route index element={<CitizenDashboard />} />
          <Route path="create" element={<CreateComplaint />} />
          <Route path="complaints" element={<MyComplaints />} />
          <Route path="complaints/:id" element={<ComplaintDetails />} />
        </Route>
      </Route>

      <Route element={<ProtectedRoute allowedRoles={["engineer"]} />}>
        <Route path="/engineer" element={<EngineerLayout />}>
          <Route index element={<EngineerDashboard />} />
          <Route path="complaints" element={<AssignedComplaints />} />
          <Route path="complaints/:id" element={<EngineerComplaintDetails />} />
          <Route path="resolved" element={<ResolvedComplaints />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
