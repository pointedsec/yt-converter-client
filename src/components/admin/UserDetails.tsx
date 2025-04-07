import { User } from "@/types/AuthTypes"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CalendarDays, UserCircle, Shield, Key } from "lucide-react"

export default function UserDetails({user}: {user: User}) {
    return (
        <div className="container mx-auto p-6 space-y-6">
            {/* User Information Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                    <CardHeader className="flex flex-row items-center space-x-4 pb-2">
                        <UserCircle className="w-6 h-6 text-primary" />
                        <CardTitle className="text-lg">Username</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-2xl font-semibold">{user.username}</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center space-x-4 pb-2">
                        <Shield className="w-6 h-6 text-primary" />
                        <CardTitle className="text-lg">Role</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Badge variant={user.role === 'admin' ? 'destructive' : 'secondary'}>
                            {user.role.toUpperCase()}
                        </Badge>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center space-x-4 pb-2">
                        <Key className="w-6 h-6 text-primary" />
                        <CardTitle className="text-lg">Status</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Badge variant={user.active ? 'success' : 'secondary'}>
                            {user.active ? 'ACTIVE' : 'INACTIVE'}
                        </Badge>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center space-x-4 pb-2">
                        <CalendarDays className="w-6 h-6 text-primary" />
                        <CardTitle className="text-lg">Created At</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground">
                            {new Date(user.createdAt).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                            })}
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Videos Section - Placeholder for future implementation */}
            <Card className="mt-6">
                <CardHeader>
                    <CardTitle className="text-xl">User Videos</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="min-h-[200px] flex items-center justify-center text-muted-foreground">
                        <p>Videos section coming soon...</p>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}