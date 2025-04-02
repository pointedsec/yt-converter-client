import LoginForm from "@/components/auth/LoginForm";

export default function LoginPage() {
  return (
    <div className="flex flex-col h-screen items-center justify-center w-full">
      <div className="max-w-lg min-w-lg">
        <LoginForm />
      </div>
    </div>
  )
}