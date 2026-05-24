import { useState } from "react";
import { useAuth } from "../context/auth";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { Navbar } from "../components/Navbar";
import Footer from "../components/Footer";
import Sidebar from "../components/Sidebar";
import FloatingCreateLpButton from "../components/FloatingCreateLpButton";

const ProtectedLayout = () => {
    const { accessToken } = useAuth();
    const { pathname } = useLocation();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const shouldShowCreateButton = pathname !== "/my";

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
            {shouldShowCreateButton && <FloatingCreateLpButton />}
            <Footer />
        </div>
    );
};

export default ProtectedLayout;
