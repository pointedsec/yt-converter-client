import { UseUserStore } from "@/store/userStore"
import { Button } from "../ui/button"
export default function LogoutButton() {
    const clearUser = UseUserStore((state) => state.clearUser)
    const logout = () => {
        localStorage.removeItem("token")
        clearUser()
        window.location.href = "/login"
    }
    return (
        <Button variant="destructive" className="cursor-pointer" onClick={logout}>Logout</Button>
    )
}