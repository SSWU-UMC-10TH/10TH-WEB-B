import { Outlet, useLocation } from "react-router-dom";
import { Navbar } from "../components/Navbar";

const HomePage = () => {
    const location = useLocation();
    const detailNav = location.pathname.startsWith("/movie/");
    return (
        <div>
            {!detailNav && <Navbar />}
            <Outlet />
        </div>
    );
};

export default HomePage;
