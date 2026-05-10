import { useState } from "react";
import { useAuth } from "../context/auth";
import { Navigate, Outlet } from "react-router-dom";
import { Navbar } from "../components/Navbar";
import Footer from "../components/Footer";
import Sidebar from "../components/Sidebar";

const ProtectedLayout = () => {
    const { accessToken } = useAuth();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    if (!accessToken) {
        return <Navigate to={"/login"} replace />;
    }

    return (
        <div className="min-h-dvh bg-black">
            <Navbar onToggleSidebar={() => setIsSidebarOpen((prev) => !prev)} />
            <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
            <main className="min-h-dvh pt-16 md:pl-40">
                <Outlet />
            </main>
            <Footer />
        </div>
    );
};

export default ProtectedLayout;
