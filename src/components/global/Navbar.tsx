import { getStorageTheme, setStorage } from "@/lib/storage";
import { UseUserStore } from "@/store/userStore";
import { useState, useEffect } from "react";
import { HiSun, HiMoon } from "react-icons/hi";
import AdminButtons from "../navbar/AdminButtons";
import GuestButtons from "../navbar/GuestButtons";
import { Link } from "react-router-dom";
import LogoutButton from "../auth/LogoutButton";

export default function Navbar() {
    const [theme, setTheme] = useState<"light" | "dark">(getStorageTheme() || "light");
    const user = UseUserStore((state) => state.user);

    // Change theme  when users press button (theme state changes)
    useEffect(() => {
        setStorage("theme", theme);
        document.documentElement.classList.toggle("dark", theme === "dark");
    }, [theme]);

    return (
        <nav className="flex items-center justify-between px-6 py-4 shadow-md sticky top-0 bg-background z-50">
            <Link to="/">
                <h1 className="text-xl font-bold cursor-pointer">
                    YT-API-CLIENT
                </h1>
            </Link>
            {user && user.role === "admin" && <AdminButtons />}
            {user && user.role === "guest" && <GuestButtons />}
            <div className="flex items-center justify-center gap-4">
                <button
                    onClick={() => setTheme(theme === "light" ? "dark" : "light")}
                    className="p-2 rounded-lg bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200 transition-all hover:bg-gray-300 dark:hover:bg-gray-700"
                >
                    {theme === "light" ? <HiSun size={24} /> : <HiMoon size={24} />}
                </button>
                <LogoutButton />
            </div>
        </nav>
    );
}
