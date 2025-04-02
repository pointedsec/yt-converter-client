import { getStorage, setStorage } from "@/lib/storage";
import Navbar from "../components/global/Navbar";
import { useEffect } from "react";
import Footer from "@/components/global/Footer";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const theme = getStorage("theme")
    if (!theme){
        setStorage("theme", "light")
    }
  }, [])
    return (
    <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white transition-all">
      <Navbar />
      <main className="p-6 w-full h-screen">{children}</main>
      <Footer />
    </div>
  );
}
