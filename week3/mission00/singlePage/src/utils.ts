import { useState, useEffect, isValidElement } from "react";
import type { ReactNode, ReactElement } from "react";
import { Route } from "./Route";

export const getCurrentPath = () => window.location.pathname;

export const navigateTo = (to: string) => {
  window.history.pushState(null, "", to);
  window.dispatchEvent(new PopStateEvent("popstate"));
};

export const useCurrentPath = () => {
  const [path, setPath] = useState(getCurrentPath());

  useEffect(() => {
    const handleLocationChange = () => setPath(getCurrentPath());
    window.addEventListener("popstate", handleLocationChange);
    return () => window.removeEventListener("popstate", handleLocationChange);
  }, []);

  return path;
};

export const isRouteElement = (child: ReactNode): child is ReactElement => {
  return isValidElement(child) && child.type === Route;
};
