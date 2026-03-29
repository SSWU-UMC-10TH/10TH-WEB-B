import './App.css'
import { type JSX } from 'react';
import MoviePage from './03-useEffect/pages/MoviePage';
import HomePage from './03-useEffect/pages/HomePage';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import NotFoundPage from './03-useEffect/pages/NotFoundPage';
import MovieDetailPage from './03-useEffect/pages/MovieDetailPage';

const router = createBrowserRouter([
  {
    path:'/',
    element: <HomePage/>,
    errorElement: <NotFoundPage/>,
    children: [
      {
        path: 'movies/:category',
        element: <MoviePage/>,
      },
      {
        path: 'movies/detail/:movieId',
        element: <MovieDetailPage/>
      }
    ]
  }
])

function App(): JSX.Element {
  return <RouterProvider router={router} />;
};

export default App
