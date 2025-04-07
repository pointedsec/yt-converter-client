import { Button } from "@/components/ui/button"
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
import { PlusCircle } from "lucide-react"
import { useEffect, useState } from "react"

export default function AdminUsersDashboardPage() {
    const [users, setUsers] = useState<User[] | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

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
                <Button>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add New User
                </Button>
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
                            <TableRow key={user.id}>
                                <TableCell>{user.username}</TableCell>
                                <TableCell>{user.role}</TableCell>
                                <TableCell>{user.password}</TableCell>
                                <TableCell>
                                    <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                                        user.active 
                                            ? 'bg-green-100 text-green-700'
                                            : 'bg-gray-100 text-gray-700'
                                    }`}>
                                        {user.active ? 'Active' : 'Inactive'}
                                    </span>
                                </TableCell>
                                <TableCell className="text-right">
                                    <Button variant="outline" size="sm" className="mr-2">
                                        Edit
                                    </Button>
                                    <Button variant="destructive" size="sm">
                                        Delete
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}