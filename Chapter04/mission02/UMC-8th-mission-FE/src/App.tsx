import './App.css'
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import HomePage from './pages/HomePage';
import NotFound from './pages/NotFound';
import Login from './pages/Login';
import HomeLayout from './layouts/HomeLayout';
import Signup from './pages/Signup';


const router = createBrowserRouter([
  {
    path: "/",
    element: <HomeLayout />,
    errorElement: <NotFound />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "login", element: <Login /> },
      { path: "signup", element: <Signup /> },
    ],
  },
]);

function App() {


  return (
    <RouterProvider router={router} />

  )
}

export default App
