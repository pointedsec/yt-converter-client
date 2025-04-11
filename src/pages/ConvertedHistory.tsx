import { UseUserStore } from "@/store/userStore";
import { GetVideoProcessingStatus, DownloadProcessedVideo } from "@/utils/api";
import { useEffect, useState } from "react";
import { ProcessingStatus, Video } from "@/types/VideoTypes";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Download, Loader2, Music, Video as VideoIcon, Calendar } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Separator } from "@/components/ui/separator";
import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
} from "@/components/ui/hover-card";

export default function ConvertedHistory() {
    const user = UseUserStore((state) => state.user);
    const [videoStatuses, setVideoStatuses] = useState<Map<string, ProcessingStatus[]>>(new Map());
    const [loading, setLoading] = useState(true);
    const [downloading, setDownloading] = useState<number | null>(null);

    useEffect(() => {
        const fetchProcessingStatuses = async () => {
            if (!user?.Videos){
                setLoading(false);
                return;
            }
            
            const statusMap = new Map<string, ProcessingStatus[]>();
            for (const video of user.Videos) {
                const status = await GetVideoProcessingStatus(video.video_id);
                if (!('error' in status)) {
                    statusMap.set(video.video_id, status);
                }
            }
            setVideoStatuses(statusMap);
            setLoading(false);
        };

        fetchProcessingStatuses();
    }, [user?.Videos]);

    const handleDownload = async (status: ProcessingStatus) => {
        setDownloading(status.id);
        const format = status.resolution === "MP3" ? "MP3" : "MP4";
        await DownloadProcessedVideo(status.video_id, format, status.resolution);
        setDownloading(null);
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-[calc(100vh-200px)]">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        );
    }

    if (!user?.Videos || user.Videos.length === 0) {
        return (
            <div className="container mx-auto p-6">
                <div className="flex flex-col items-center justify-center h-[calc(100vh-200px)] space-y-4">
                    <VideoIcon className="h-16 w-16 text-muted-foreground" />
                    <h2 className="text-2xl font-semibold text-center">No Videos Found</h2>
                    <p className="text-muted-foreground text-center max-w-md">
                        You haven't converted any videos yet. Head to the converter to start processing your first video!
                    </p>
                    <Button asChild>
                        <Link to="/convert">
                            Convert Your First Video
                        </Link>
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-4 md:p-6 space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold">Media Library</h1>
                    <p className="text-muted-foreground">Manage your converted videos</p>
                </div>
                <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-sm">
                        {user?.Videos?.length || 0} Videos
                    </Badge>
                    <Button asChild variant="outline" size="sm">
                        <Link to="/convert">New Conversion</Link>
                    </Button>
                </div>
            </div>

            <ScrollArea className="h-[calc(100vh-200px)]">
                <div className="grid grid-cols-1 gap-4">
                    {user?.Videos?.map((video: Video) => (
                        <Card key={video.id} className="overflow-hidden">
                            <CardHeader className="p-0">
                                <div className="relative">
                                    <img 
                                        src={`https://img.youtube.com/vi/${video.video_id}/maxresdefault.jpg`}
                                        alt={video.title}
                                        className="w-full h-48 object-cover"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                                    <div className="absolute bottom-0 p-4 text-white">
                                        <CardTitle className="line-clamp-1 text-lg md:text-xl">
                                            {video.title}
                                        </CardTitle>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="p-4">
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                            <Calendar className="h-4 w-4" />
                                            <span>{new Date(video.created_at).toLocaleDateString()}</span>
                                        </div>
                                        <Badge variant="secondary">
                                            {videoStatuses.get(video.video_id)?.length || 0} Formats
                                        </Badge>
                                    </div>
                                    
                                    <Separator />

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                        {videoStatuses.get(video.video_id)?.map((status) => (
                                            <HoverCard key={status.id}>
                                                <HoverCardTrigger asChild>
                                                    <div className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-accent transition-colors cursor-pointer">
                                                        <div className="flex items-center gap-2">
                                                            {status.resolution === "MP3" ? 
                                                                <Music className="h-4 w-4" /> : 
                                                                <VideoIcon className="h-4 w-4" />
                                                            }
                                                            <span className="font-medium">
                                                                {status.resolution}
                                                            </span>
                                                            <Badge 
                                                                variant={status.status === "completed" ? "default" : "secondary"}
                                                                className="ml-2"
                                                            >
                                                                {status.status}
                                                            </Badge>
                                                        </div>
                                                        {status.status === "completed" && (
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                onClick={() => handleDownload(status)}
                                                                disabled={downloading === status.id}
                                                            >
                                                                {downloading === status.id ? (
                                                                    <Loader2 className="h-4 w-4 animate-spin" />
                                                                ) : (
                                                                    <Download className="h-4 w-4" />
                                                                )}
                                                            </Button>
                                                        )}
                                                    </div>
                                                </HoverCardTrigger>
                                                <HoverCardContent className="w-80">
                                                    <div className="flex justify-between space-x-4">
                                                        <div className="space-y-1">
                                                            <h4 className="text-sm font-semibold">Format Details</h4>
                                                            <p className="text-sm text-muted-foreground">
                                                                Type: {status.resolution === "MP3" ? "Audio" : "Video"}
                                                            </p>
                                                            <p className="text-sm text-muted-foreground">
                                                                Quality: {status.resolution}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </HoverCardContent>
                                            </HoverCard>
                                        ))}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </ScrollArea>
        </div>
    );
}