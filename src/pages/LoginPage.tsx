import LoginForm from "@/components/auth/LoginForm";
import SpinnerFullScreen from "@/components/ui/spinnerFullScreen";
import { UseUserStore } from "@/store/userStore";

export default function LoginPage() {
  const user = UseUserStore((state) => state.user);
  if (user) {
    window.location.href = "/";
  }

  return (
    <div className="flex flex-col h-screen items-center justify-center w-full">
      <h1 className="text-2xl font-bold text-slate-800 mb-4">Login Page - YT Converter Client</h1>
      <div className="max-w-lg lg:min-w-lg">
        <LoginForm />
      </div>
    { user && <SpinnerFullScreen/>}
    </div>
  )
}