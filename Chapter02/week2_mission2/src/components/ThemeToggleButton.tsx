import { THEME, useTheme } from "../context/ThemeProvider";
import clsx from "clsx";

export default function ThemeToggleButton() {
    const { theme, toggleTheme } = useTheme();

    const isLightMode = theme === THEME.LIGHT;

    return (
        <button
            onClick={toggleTheme}
            className={clsx("px-4 py-2 mt-4 rounded-md transition-all", {
                "bg-white text-black": isLightMode,
                "bg-black text-white": !isLightMode,
            })}
        >
            {isLightMode ? "🌙 다크 모드" : "☀️ 라이트 모드"}
        </button>
    );
}
