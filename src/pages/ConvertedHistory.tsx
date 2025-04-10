import { UseUserStore } from "@/store/userStore";
import { GetVideoProcessingStatus, DownloadProcessedVideo } from "@/utils/api";
import { useEffect, useState } from "react";
import { ProcessingStatus, Video } from "@/types/VideoTypes";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Download, Loader2, Music, Video as VideoIcon } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";

export default function ConvertedHistory() {
    const user = UseUserStore((state) => state.user);
    const [videoStatuses, setVideoStatuses] = useState<Map<string, ProcessingStatus[]>>(new Map());
    const [loading, setLoading] = useState(true);
    const [downloading, setDownloading] = useState<number | null>(null);

    useEffect(() => {
        const fetchProcessingStatuses = async () => {
            if (!user?.Videos) return;
            
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

    return (
        <div className="container mx-auto p-6 space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold">Converted Videos History</h1>
                <Badge variant="outline" className="text-sm">
                    Total Videos: {user?.Videos?.length || 0}
                </Badge>
            </div>

            <ScrollArea className="h-[calc(100vh-200px)]">
                <div className="space-y-4">
                    {user?.Videos?.map((video: Video) => (
                        <Card key={video.id} className="overflow-hidden">
                            <CardHeader className="flex flex-row items-start justify-between space-y-0">
                                <CardTitle className="line-clamp-1">{video.title}</CardTitle>
                                <Badge variant="outline">
                                    {videoStatuses.get(video.video_id)?.length || 0} Conversions
                                </Badge>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex gap-4">
                                    <img 
                                        src={`https://img.youtube.com/vi/${video.video_id}/mqdefault.jpg`}
                                        alt={video.title}
                                        className="w-48 rounded-md shadow-md"
                                    />
                                    <Accordion type="single" collapsible className="w-full">
                                        <AccordionItem value="processing-status">
                                            <AccordionTrigger>Processing Status</AccordionTrigger>
                                            <AccordionContent>
                                                <div className="space-y-2">
                                                    {videoStatuses.get(video.video_id)?.map((status) => (
                                                        <div key={status.id} 
                                                            className="flex items-center justify-between p-2 rounded-lg border bg-card">
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
                                                                    variant="outline"
                                                                    size="sm"
                                                                    onClick={() => handleDownload(status)}
                                                                    disabled={downloading === status.id}
                                                                >
                                                                    {downloading === status.id ? (
                                                                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                                                    ) : (
                                                                        <Download className="h-4 w-4 mr-2" />
                                                                    )}
                                                                    Download
                                                                </Button>
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>
                                            </AccordionContent>
                                        </AccordionItem>
                                    </Accordion>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </ScrollArea>
        </div>
    );
}