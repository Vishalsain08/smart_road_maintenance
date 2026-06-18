import { Outlet } from "react-router-dom";
import Footer from "../components/common/Footer.jsx";
import Navbar from "../components/common/Navbar.jsx";

function PublicLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-[#0F172A] text-[#F8FAFC]">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default PublicLayout;
