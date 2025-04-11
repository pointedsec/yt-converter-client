import LoginForm from "@/components/auth/LoginForm";
import ChangeThemeButton from "@/components/ui/change-theme-button";
import SpinnerFullScreen from "@/components/ui/spinnerFullScreen";
import { getStorageTheme } from "@/lib/storage";
import { UseUserStore } from "@/store/userStore";
import { useState } from "react";

export default function LoginPage() {
  const user = UseUserStore((state) => state.user);
  const [theme, setTheme] = useState<"light" | "dark">(getStorageTheme() || "light");
  if (user) {
    window.location.href = "/";
  }

  return (
    <>
      <div className="absolute flex w-full justify-center m-4">
        <ChangeThemeButton callback={setTheme} />
      </div>
      <div className="flex flex-col h-screen items-center justify-center w-full">
        <div className="relative">
          <img 
            src="/logo.png" 
            alt="MediaFlow Logo" 
            className={`max-w-[200px] max-h-[100px] md:max-w-[300px] md:max-h-[150px] transition-opacity duration-200 ${theme === 'light' ? 'opacity-100' : 'opacity-0 absolute'}`} 
          />
          <img 
            src="/logo_dark.png" 
            alt="MediaFlow Logo" 
            className={`max-w-[200px] max-h-[100px] md:max-w-[300px] md:max-h-[150px] transition-opacity duration-200 ${theme === 'dark' ? 'opacity-100' : 'opacity-0 absolute'}`} 
          />
        </div>
        <div className="max-w-lg lg:min-w-lg">
          <LoginForm />
        </div>
        {user && <SpinnerFullScreen />}
      </div>
    </>
  )
}