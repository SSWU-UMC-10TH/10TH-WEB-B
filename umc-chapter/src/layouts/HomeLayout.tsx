import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useState } from "react";
import Sidebar from "../components/Sidebar";

const HomeLayout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isLpModalOpen, setIsLpModalOpen] = useState(false);

    return (
        <div className="min-h-screen flex flex-col bg-[#121212] text-white">
            <Navbar onMenuClick={() => setIsSidebarOpen(true)} />
            
            <div className="flex flex-1 pt-16">
                <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

                <main className="flex-1 p-6 relative">
                    <Outlet context={{ isLpModalOpen, setIsLpModalOpen }} />
                    
                    <button 
                        onClick={() => setIsLpModalOpen(true)} 
                        className="fixed bottom-10 right-8 w-14 h-14 bg-[#FF1781] rounded-full flex items-center justify-center text-3xl font-bold shadow-lg hover:scale-110 transition-transform z-50 cursor-pointer"
                    >
                        +
                    </button>
                </main>
            </div>

            <Footer />
        </div>
    );
};

export default HomeLayout;