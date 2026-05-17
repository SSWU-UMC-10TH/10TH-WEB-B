import { Outlet, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useState } from "react";
import { Sidebar } from "../components/Sidebar";
import { useSidebar } from "../hooks/useSidebar";

const HomeLayout = () => {
  const { isOpen, toggle, close } = useSidebar();

  return (
    <div className="h-screen flex flex-col bg-black text-white">
      <Navbar isOpen={isOpen} toggleSidebar={toggle} />
      <div className="flex flex-1 overflow-hidden relative">
        <Sidebar isOpen={isOpen} onClose={close} />

        <main
          className={`flex-1 transition-all duration-300 ease-in-out ${
            isOpen ? "overflow-hidden" : "overflow-y-auto"
          }`}
        >
          <div className="p-6">
            <Outlet />
          </div>
          <Footer />
        </main>
      </div>
    </div>
  );
};

export default HomeLayout;
