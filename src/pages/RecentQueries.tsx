import { UseUserStore } from "@/store/userStore";
import { GetUser } from "@/utils/api";
import { useEffect } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, Clock } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Video } from "@/types/VideoTypes";

export default function RecentQueries() {
    const user = UseUserStore((state) => state.user);
    const setUser = UseUserStore((state) => state.setUser);

    useEffect(() => {
        const fetchData = async () => {
            const user = GetUser()
            const userData = await user;
            if ('id' in userData) {
              setUser(userData);
            } 
        }
        fetchData()
    },[setUser])

    if (!user) {
        return (
            <div className="container mx-auto p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1,2,3].map((i) => (
                        <Card key={i} className="overflow-hidden">
                            <Skeleton className="h-48 w-full" />
                            <CardContent className="p-4">
                                <Skeleton className="h-4 w-3/4 mb-2" />
                                <Skeleton className="h-4 w-1/2" />
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-6 space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold">Recent Queries</h1>
                <Badge variant="outline" className="text-sm">
                    Total Videos: {user.Videos?.length || 0}
                </Badge>
            </div>

            <ScrollArea className="h-[calc(100vh-200px)] pr-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {user.Videos?.map((video: Video) => (
                        <Card key={video.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                            <div className="relative group">
                                <img 
                                    src={`https://img.youtube.com/vi/${video.video_id}/maxresdefault.jpg`}
                                    alt={video.title}
                                    className="w-full h-48 object-cover transition-transform group-hover:scale-105"
                                    onError={(e) => {
                                        const target = e.target as HTMLImageElement;
                                        target.src = `https://img.youtube.com/vi/${video.video_id}/mqdefault.jpg`;
                                    }}
                                />
                            </div>
                            
                            <CardHeader className="p-4">
                                <CardTitle className="line-clamp-2 text-lg">{video.title}</CardTitle>
                            </CardHeader>

                            <CardFooter className="p-4 pt-0 flex justify-between text-sm text-muted-foreground">
                                <div className="flex items-center">
                                    <CalendarDays className="h-4 w-4 mr-1" />
                                    {new Date(video.created_at).toLocaleDateString()}
                                </div>
                                <div className="flex items-center">
                                    <Clock className="h-4 w-4 mr-1" />
                                    {new Date(video.created_at).toLocaleTimeString()}
                                </div>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            </ScrollArea>
        </div>
    );
}