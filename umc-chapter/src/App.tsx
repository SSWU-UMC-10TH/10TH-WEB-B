import { createBrowserRouter, RouterProvider, type RouteObject } from 'react-router-dom'
import './App.css'
import HomePage from './pages/HomePage'
import NotFoundPage from './pages/NotFoundPage'
import LoginPage from './pages/LoginPage'
import HomeLayout from './layouts/HomeLayout.tsx'
import SignupPage from './pages/SignupPage'
import MyPage from './pages/MyPage'
import { AuthProvider } from './contexts/AuthContext'
import {ProtectedLayout} from './layouts/ProtectedLayout.tsx'
import GoogleLoginRedirectPage from './pages/GoogleLoginRedirectPage.tsx'


const router = createBrowserRouter([
  {
    path: "/",
    element: <HomeLayout/>,
    errorElement: <NotFoundPage/>,
    children: [
      {index: true, element: <HomePage/>},
      {path: 'login', element: <LoginPage/>},
      {path: 'signup', element: <SignupPage/>},
      {path: "/api/auth/google/callback", element: <GoogleLoginRedirectPage/>},
      {
        element: <ProtectedLayout/>,
        children: [
          {path: 'me', element: <MyPage/>}
        ]
      }
    ],
  },
]);

function App() {
  
  return (
  <AuthProvider>
     <RouterProvider router={router} />
  </AuthProvider>
 )

}

export default App
