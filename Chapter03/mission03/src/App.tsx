import "./App.css";
import HomePage from "./pages/HomePage";
import MoviePage from "./pages/MoviePage.tsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import NotFoundPage from "./pages/NotFoundPage.tsx";
import MovieDetailPage from "./pages/MovieDetailPage.tsx";

const router = createBrowserRouter([
    {
        path: "/",
        element: <HomePage />,
        errorElement: <NotFoundPage />,
        children: [
            {
                path: "movies/:category",
                element: <MoviePage />,
            },
            {
                path: "movie/:movieId",
                element: <MovieDetailPage />,
            },
        ],
    },
]);

function App() {
    return <RouterProvider router={router} />;
}

export default App;
