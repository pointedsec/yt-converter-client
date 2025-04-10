import { User } from "@/types/AuthTypes"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CalendarDays, UserCircle, Shield, Key } from "lucide-react"
import { UpdateUserModal } from "./UpdateUserModal"
import { ConfirmDeleteUserModal } from "./ConfirmDeleteUserModal"
import { useNavigate } from "react-router-dom"
import { GetVideosByUserId } from "@/utils/api"
import { useEffect, useState } from "react"
import { Video } from "@/types/VideoTypes"
import ConvertedVideoDetails from "./ConvertedVideosDetails"

export default function UserDetails({ user, updateCallback }: { user: User, updateCallback: () => void }) {
    const [videos, setVideos] = useState<Video[]|null>(null)
    const [videoError, setVideoError] = useState(false)
    const navigate = useNavigate()
    const deleteCallback = () => {
        navigate('/admin/')
    }
    useEffect(() => {
        const getVideos = async () => {
            const reqVideos = await GetVideosByUserId(user.id)
            if ('error' in reqVideos){
                setVideoError(true)
                return
            }
            setVideos(reqVideos)
        }
        getVideos()
    }, [user.id])
    return (
        <div className="container mx-auto p-6 space-y-6">
            {/* User Information Section */}
            <div className="w-full grid grid-cols-3 items-center">
                <div></div>
                <h1 className="text-center text-2xl">
                    User details of <strong>{user.username}</strong>
                </h1>
                <div className="flex justify-end gap-2">
                    <UpdateUserModal user={user} updateCallback={updateCallback} />
                    <ConfirmDeleteUserModal user={user} deleteCallback={deleteCallback}/>
                </div>
            </div>


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
                        <Badge variant={user.active ? 'default' : 'secondary'}>
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
                            {new Date(user.created_at).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                                second: '2-digit',
                                hour12: true
                            })}
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center space-x-4 pb-2">
                        <CalendarDays className="w-6 h-6 text-primary" />
                        <CardTitle className="text-lg">Updated At</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground">
                            {new Date(user.updated_at).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                                second: '2-digit',
                                hour12: true
                            })}
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center space-x-4 pb-2">
                        <CalendarDays className="w-6 h-6 text-primary" />
                        <CardTitle className="text-lg">Last Login At</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground">
                            {new Date(user.last_login_at).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                                second: '2-digit',
                                hour12: true
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
                        {videoError? 'Error loading videos' : videos?.length === 0? 'No videos found' : <ConvertedVideoDetails videos={videos}/>}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}