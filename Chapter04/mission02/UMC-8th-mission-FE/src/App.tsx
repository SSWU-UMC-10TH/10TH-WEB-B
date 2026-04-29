import './App.css'
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import HomePage from './pages/HomePage';
import NotFound from './pages/NotFound';
import Login from './pages/Login';
import HomeLayout from './layouts/HomeLayout';
import Signup from './pages/Signup';
import MyPage from './pages/MyPage';
import { AuthProvider } from './context/AuthContext';
import ProtectedLayout from './layouts/ProtectedLayout';
import type { RouteObject } from 'react-router-dom';


const publicRoutes: RouteObject[] = [
  {
    path: "/",
    element: <HomeLayout />,
    errorElement: <NotFound />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "login", element: <Login /> },
      { path: "signup", element: <Signup /> },
    ],
  }
]

const protectedRoutes: RouteObject[] = [
  {
    path: "/",
    element: <ProtectedLayout />,
    errorElement: <NotFound />,
    children: [
      { path: "my", element: <MyPage /> },
    ],
  }

]


const router = createBrowserRouter([...publicRoutes, ...protectedRoutes]);

function App() {


  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>

  )
}

export default App
