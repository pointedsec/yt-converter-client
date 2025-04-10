import { getStorageTheme, setStorage } from "@/lib/storage";
import { UseUserStore } from "@/store/userStore";
import { useState, useEffect } from "react";
import { HiSun, HiMoon } from "react-icons/hi";
import AdminButtons from "../navbar/AdminButtons";
import GuestButtons from "../navbar/GuestButtons";
import { Link } from "react-router-dom";
import ProfileButton from "../navbar/ProfileButton";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";

export default function Navbar() {
    const [theme, setTheme] = useState<"light" | "dark">(getStorageTheme() || "light");
    const [isOpen, setIsOpen] = useState(false);
    const user = UseUserStore((state) => state.user);

    useEffect(() => {
        setStorage("theme", theme);
        document.documentElement.classList.toggle("dark", theme === "dark");
    }, [theme]);

    return (
        <nav className="flex items-center justify-between px-6 py-4 shadow-md sticky top-0 bg-background z-50">
            <Link to="/">
                <h1 className="text-xl font-bold cursor-pointer">
                    YT Converter
                </h1>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex gap-2">
                {user && user.role === "admin" && (
                    <>
                        <AdminButtons />
                        <GuestButtons />
                    </>
                )}
                {user && user.role === "guest" && <GuestButtons />}
            </div>

            <div className="hidden lg:flex items-center justify-center gap-4">
                <button
                    onClick={() => setTheme(theme === "light" ? "dark" : "light")}
                    className="p-2 rounded-lg bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200 transition-all hover:bg-gray-300 dark:hover:bg-gray-700"
                >
                    {theme === "light" ? <HiSun size={24} /> : <HiMoon size={24} />}
                </button>
                <ProfileButton user={user}/>
            </div>

            {/* Mobile Navigation */}
            <div className="lg:hidden flex items-center gap-2">
                <button
                    onClick={() => setTheme(theme === "light" ? "dark" : "light")}
                    className="p-2 rounded-lg bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200 transition-all hover:bg-gray-300 dark:hover:bg-gray-700"
                >
                    {theme === "light" ? <HiSun size={20} /> : <HiMoon size={20} />}
                </button>
                <Sheet open={isOpen} onOpenChange={setIsOpen}>
                    <SheetTrigger asChild>
                        <Button variant="outline" size="icon">
                            <Menu className="h-5 w-5" />
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="right" className="w-[300px] sm:w-[400px] flex flex-col">
                        <div className="flex flex-col h-full">
                            <div className="space-y-4 flex-1">
                                <div className="px-2 py-6 border-b">
                                    <h2 className="text-lg font-semibold mb-1">Menu</h2>
                                    <p className="text-sm text-muted-foreground">
                                        Welcome, {user?.username || 'Guest'}
                                    </p>
                                </div>

                                <div className="px-2 space-y-4">
                                    {user && user.role === "admin" && (
                                        <>
                                            <div className="space-y-2">
                                                <h3 className="text-sm font-medium text-muted-foreground mb-2">
                                                    Admin Controls
                                                </h3>
                                                <div className="grid gap-2">
                                                    <AdminButtons />
                                                </div>
                                            </div>
                                            <div className="pt-2 border-t space-y-2">
                                                <h3 className="text-sm font-medium text-muted-foreground mb-2">
                                                    Video Management
                                                </h3>
                                                <div className="grid gap-2">
                                                    <GuestButtons />
                                                </div>
                                            </div>
                                        </>
                                    )}
                                    {user && user.role === "guest" && (
                                        <div className="space-y-2">
                                            <h3 className="text-sm font-medium text-muted-foreground mb-2">
                                                Video Management
                                            </h3>
                                            <div className="grid gap-2">
                                                <GuestButtons />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="border-t p-4 mt-auto">
                                <div className="flex items-center justify-between">
                                    <ProfileButton user={user} />
                                </div>
                            </div>
                        </div>
                    </SheetContent>
                </Sheet>
            </div>
        </nav>
    );
}
