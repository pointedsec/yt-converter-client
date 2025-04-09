import UserDetails from "@/components/admin/UserDetails"
import SpinnerFullScreen from "@/components/ui/spinnerFullScreen"
import { User } from "@/types/AuthTypes"
import { GetUserById } from "@/utils/api"
import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"

export default function AdminUserDetailsPage() {
    const { id } = useParams()
    const [user, setUser] = useState<User | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    if (!id) {
        return (
            <div>
                No user ID provided
            </div>
        )
    }

    const fetchUser = async () => {
        setLoading(true)
        const user = await GetUserById(id)
        if ('error' in user) {
            console.error(user.error)
            setError(user.error)
        }
        setUser(user as User)
        setLoading(false)
    }

    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(() => {
        fetchUser()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])


    return (
        <>
        {!loading && user && !error && <UserDetails user={user} updateCallback={fetchUser}/>}
        {error && <div>{error}</div>}
        {loading && <SpinnerFullScreen/>}
        </>
    )
}