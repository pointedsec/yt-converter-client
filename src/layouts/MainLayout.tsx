import { getStorage, setStorage } from "@/lib/storage";
import Navbar from "../components/global/Navbar";
import { useEffect } from "react";
import Footer from "@/components/global/Footer";
import { Toaster } from "@/components/ui/sonner"

export default function MainLayout({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const theme = getStorage("theme")
    if (!theme){
        setStorage("theme", "light")
    }
  }, [])
    return (
    <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white transition-all flex flex-col">
      <Navbar />
      <main className="flex-1 p-6 w-full">{children}</main>
      <Toaster/>
      <Footer />
    </div>
  );
}
