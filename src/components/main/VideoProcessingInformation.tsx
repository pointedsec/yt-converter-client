import { Video } from "@/types/VideoTypes";
import { GetVideoProcessingStatus } from "@/utils/api";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function VideoProcessingInformation({video, resolution, callback}: {video: Video, resolution: string, callback: (str: string|null) => void}) {
    const [currentStatus, setCurrentStatus] = useState<"processing"|"completed"|"failed"|null>(null);
    const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null);

    const checkStatus = async () => {
        const status = await GetVideoProcessingStatus(video.video_id);
        if (!('error' in status)) {
            const currentProcessing = status.find(s => s.resolution === resolution);
            if (currentProcessing) {
                setCurrentStatus(currentProcessing.status as "processing"|"completed"|"failed");
                if (currentProcessing.status === "completed") {
                    callback(currentProcessing.status);
                    // Clear the interval when success
                    if (intervalId) {
                        clearInterval(intervalId);
                        setIntervalId(null);
                    }
                }
            }
        }
    };

    useEffect(() => {
        const initialTimer = setTimeout(() => {
            checkStatus();
        }, 5000);

        const interval = setInterval(() => {
            checkStatus();
        }, 5000);
        
        setIntervalId(interval);

        return () => {
            clearTimeout(initialTimer);
            clearInterval(interval);
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [video.video_id, resolution]);

    return (
        <Card className="mt-4">
            <CardHeader>
                <CardTitle>Processing Status</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center py-8 space-y-4">
                {currentStatus === "processing" && (
                    <div className="flex flex-col items-center space-y-2">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        <p className="text-muted-foreground">Processing your video...</p>
                    </div>
                )}

                {currentStatus === "failed" && (
                    <div className="flex flex-col items-center space-y-2 text-destructive">
                        <p>Processing failed</p>
                        <Button variant="outline">
                            Try Again
                        </Button>
                    </div>
                )}

                {!currentStatus && (
                    <div className="flex items-center space-x-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <p className="text-sm text-muted-foreground">Initializing process...</p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}