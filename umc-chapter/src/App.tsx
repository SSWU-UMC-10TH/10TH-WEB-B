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
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'


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


export const queryClient = new QueryClient();

function App() {
  
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
      {import .meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} />}
    </QueryClientProvider>
  )
}

export default App
