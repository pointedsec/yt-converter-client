import { getStorage, setStorage } from "@/lib/storage";
import Navbar from "../components/global/Navbar";
import { useEffect, useState } from "react";
import Footer from "@/components/global/Footer";
import { Toaster } from "@/components/ui/sonner"
import { CheckApiStatus } from "@/utils/api";
import { ErrorType } from "@/types/Error";
import ErrorAlert from "../components/global/ErrorAlert"

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const [error, setError] = useState<ErrorType | null>(null)
  useEffect(() => {
    const theme = getStorage("theme")
    if (!theme){
        setStorage("theme", "light")
    }
    async function checkApi() {
      const response = await CheckApiStatus()
      if (!response.active) {
        setError({error: "API is not available: " + response.error as string, statusCode: 500})
      }
    }
    checkApi()
  }, [])
    return (
    <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white transition-all flex flex-col">
      <Navbar />
      {error!== null && <div className="mb-5"><ErrorAlert message={error.error} /></div>}
      <main className="flex-1 p-6 w-full">{children}</main>
      <Toaster/>
      <Footer />
    </div>
  );
}
