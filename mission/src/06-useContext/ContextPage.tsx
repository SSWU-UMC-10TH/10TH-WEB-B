import { useState } from "react";
import Navbar from "./Navbar";
import ThemeContent from "./ThemeContent";
import { ThemeProvider } from "./context/ThemeProvider";

export default function ContextPage() {
    const  [isDark, setIsDark] = useState(false);

    return(
        <ThemeProvider>
            <div className="flex flex-col min-h-screen">
                <Navbar />
                <main className="flex-1 flex w-full">
                <ThemeContent/>
                </main>
            </div>
        </ThemeProvider>
    )
}