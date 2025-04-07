import { ConfirmDeleteUserModal } from "@/components/admin/ConfirmDeleteUserModal"
import { CreateUserModal } from "@/components/admin/CreateUserModal"
import { UpdateUserModal } from "@/components/admin/UpdateUserModal"
import SpinnerFullScreen from "@/components/ui/spinnerFullScreen"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { User } from "@/types/AuthTypes"
import { GetUsers } from "@/utils/api"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

export default function AdminUsersDashboardPage() {
    const [users, setUsers] = useState<User[] | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const navigate = useNavigate()

    const fetchUsers = async () => {
        try {
            const response = await GetUsers()
            if ('error' in response) {
                setError(response.error)
            } else {
                setUsers(response)
            }
        } catch (err) {
            setError('Failed to fetch users')
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchUsers()
    }, [])

    if (loading) {
        return <SpinnerFullScreen/>
    }

    if (error) {
        return <div className="container mx-auto py-8 text-red-500">Error: {error}</div>
    }

    return (
        <div className="container mx-auto py-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Admin Dashboard</h1>
                <CreateUserModal createCallback={fetchUsers}/>
            </div>

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Username</TableHead>
                            <TableHead>Role</TableHead>
                            <TableHead>Hashed Password</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {users && users.map((user: User) => (
                            <TableRow key={user.id} className="cursor-pointer">
                                <TableCell onClick={() => navigate(`/admin/user/${user.id}`)}>{user.username}</TableCell>
                                <TableCell onClick={() => navigate(`/admin/user/${user.id}`)}>{user.role}</TableCell>
                                <TableCell onClick={() => navigate(`/admin/user/${user.id}`)}>{user.password}</TableCell>
                                <TableCell onClick={() => navigate(`/admin/user/${user.id}`)}>
                                    <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                                        user.active 
                                            ? 'bg-green-100 text-green-700'
                                            : 'bg-gray-100 text-gray-700'
                                    }`}>
                                        {user.active ? 'Active' : 'Inactive'}
                                    </span>
                                </TableCell>
                                <TableCell className="text-right">
                                   <div className="flex gap-2 text-right justify-end items-end">
                                   <ConfirmDeleteUserModal user={user} deleteCallback={fetchUsers}/>
                                   <UpdateUserModal user={user} updateCallback={fetchUsers}/>
                                   </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}