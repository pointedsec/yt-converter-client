import { getStorageTheme, setStorage } from "@/lib/storage";
import { useEffect, useState } from "react";
import { HiMoon, HiSun } from "react-icons/hi";

export default function ChangeThemeButton({callback}: {callback?: (str: "light"|"dark") => void}) {
    const [theme, setTheme] = useState<"light" | "dark">(getStorageTheme() || "light");
    useEffect(() => {
        setStorage("theme", theme);
        callback?.(theme);
        document.documentElement.classList.toggle("dark", theme === "dark");
    }, [theme, callback]);
    return (
        <button
        onClick={() => setTheme(theme === "light" ? "dark" : "light")}
        className="p-2 rounded-lg bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200 transition-all hover:bg-gray-300 dark:hover:bg-gray-700"
    >
        {theme === "light" ? <HiSun size={24} /> : <HiMoon size={24} />}
    </button> 
    )

}