import { Outlet } from "react-router-dom";
import {Navbar} from "../components/NavBar";

const HomePage = ()=> {
    return (
        <>
            <Navbar/>
            <Outlet/>
        </>
    )
}

export default HomePage;