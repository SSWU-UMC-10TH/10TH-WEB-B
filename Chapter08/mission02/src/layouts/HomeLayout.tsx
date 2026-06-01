import { Outlet } from "react-router-dom";
import { Navbar } from "../components/Navbar";
import Footer from "../components/Footer";
import Sidebar from "../components/Sidebar";
import FloatingCreateLpButton from "../components/FloatingCreateLpButton";
import useSidebar from "../hooks/useSidebar";

const HomeLayout = () => {
    const { isOpen, toggle, close } = useSidebar();

    return (
        <div className="min-h-dvh bg-black">
            <Navbar onToggleSidebar={toggle} />
            <Sidebar isOpen={isOpen} onClose={close} />
            <main className="min-h-dvh pt-16 md:pl-40">
                <Outlet />
            </main>
            <FloatingCreateLpButton />
            <Footer />
        </div>
    );
};

export default HomeLayout;
