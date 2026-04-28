import { useEffect, useState } from "react";
import Home from "./Home";
import About from "./About";

const Router = () => {
  const [path, setPath] = useState(window.location.pathname);

  const navigate = (url: string) => {
    window.history.pushState({}, "", url);
    setPath(url);
  };

  useEffect(() => {
    const handlePopState = () => {
      setPath(window.location.pathname);
    };

    window.addEventListener("popstate", handlePopState);

    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const renderPage = () => {
    if (path === "/about") return <About />;
    return <Home />;
  };

  return (
    <div>
      <nav style={{ display: "flex", gap: "20px" }}>
        <a
          href="/"
          onClick={(e) => {
            e.preventDefault();
            navigate("/");
          }}
        >
          Home
        </a>

        <a
          href="/about"
          onClick={(e) => {
            e.preventDefault();
            navigate("/about");
          }}
        >
          About
        </a>
      </nav>

      <hr />

      {renderPage()}
    </div>
  );
};

export default Router;