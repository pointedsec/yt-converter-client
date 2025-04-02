import { UseUserStore } from "@/store/userStore"
import { GetUser } from "@/utils/api"

export default function MainPage() {
  const user = UseUserStore((state) => state.user);
  const getUserInfo = async () => {
    const user = await GetUser()
    console.log(user)
  }
  const getUserInfoFromStore = () => {
    console.log(user)
  }
  return (
    <div>
      <h1 className="text-3xl font-bold underline">
        Main Page
      </h1>
      <button onClick={getUserInfo}>
        Click me to get user info
      </button>
      <button onClick={getUserInfoFromStore}>
      Click me to get user info from store
      </button>
    </div>
  )
}