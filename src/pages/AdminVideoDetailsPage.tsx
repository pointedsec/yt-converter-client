import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { GetUserById, GetVideoByID, GetVideoProcessingStatus } from "@/utils/api";
import { ProcessingStatus, Video } from "@/types/VideoTypes";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import { Download, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DownloadProcessedVideo } from "@/utils/api";
import DeleteVideoButton from "@/components/admin/DeleteVideoButton";
import { User } from "@/types/AuthTypes";
import { Link } from "react-router-dom";
import { ExternalLink } from "lucide-react";

export default function AdminVideoDetailsPage() {
    const { videoId } = useParams();
    const [video, setVideo] = useState<Video | null>(null);
    const [processingStatus, setProcessingStatus] = useState<ProcessingStatus[]>([]);
    const [loading, setLoading] = useState(true);
    const [downloadingId, setDownloadingId] = useState<number | null>(null);
    const [user, setUser] = useState<User|null>(null);

    const handleDownload = async (status: ProcessingStatus) => {
        setDownloadingId(status.id);
        const response = await DownloadProcessedVideo(
            status.video_id, 
            status.resolution === "MP3" ? "MP3" : "MP4",
            status.resolution
        );
        if ('error' in response) {
            toast.error("Failed to download video");
        }
        setDownloadingId(null);
    };

    useEffect(() => {
        const fetchData = async () => {
            if (!videoId) return;

            const videoData = await GetVideoByID(videoId);
            if (videoData && 'error' in videoData) {
                toast.error("Failed to fetch video details");
                return;
            }
            setVideo(videoData);

            // Fetch user data
            if (videoData?.user_id) {
                const userData = await GetUserById(videoData.user_id.toString());
                if (!('error' in userData)) {
                    setUser(userData);
                }
            }

            const statusData = await GetVideoProcessingStatus(videoId);
            if (!('error' in statusData)) {
                setProcessingStatus(statusData);
            }

            setLoading(false);
        };

        fetchData();
    }, [videoId]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        );
    }

    if (!video) {
        return <div className="text-center text-muted-foreground">Video not found</div>;
    }

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Video Details</CardTitle>
                    <DeleteVideoButton
                        video={video} 
                    />
                </CardHeader>
                <CardContent className="flex flex-col md:flex-row gap-6">
                    <div className="w-full md:w-1/3">
                        <img 
                            src={`https://img.youtube.com/vi/${video?.video_id}/mqdefault.jpg`}
                            alt={video?.title}
                            className="w-full rounded-lg shadow-md"
                        />
                    </div>
                    <div className="w-full md:w-2/3">
                        <Table>
                            <TableBody>
                                <TableRow>
                                    <TableCell className="font-medium">ID</TableCell>
                                    <TableCell>{video.id}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell className="font-medium">Title</TableCell>
                                    <TableCell>{video.title}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell className="font-medium">Video ID</TableCell>
                                    <TableCell className="font-mono">{video.video_id}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell className="font-medium">User requested</TableCell>
                                    <TableCell className="flex items-center gap-2">
                                        {user?.username || video.user_id}
                                        {user && (
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                asChild
                                            >
                                                <Link to={`/admin/user/${video.user_id}`}>
                                                    <ExternalLink className="h-4 w-4 mr-2" />
                                                    View User
                                                </Link>
                                            </Button>
                                        )}
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell className="font-medium">Requested By IP</TableCell>
                                    <TableCell className="font-mono">{video.requested_by_ip}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell className="font-medium">Created At</TableCell>
                                    <TableCell>{new Date(video.created_at).toLocaleString()}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell className="font-medium">Updated At</TableCell>
                                    <TableCell>{new Date(video.updated_at).toLocaleString()}</TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Processing Requests</CardTitle>
                </CardHeader>
                <CardContent>
                    {processingStatus.length === 0 ? (
                        <p className="text-center text-muted-foreground">No processing requests found</p>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>ID</TableHead>
                                    <TableHead>Resolution</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Path</TableHead>
                                    <TableHead>Created</TableHead>
                                    <TableHead>Updated</TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {processingStatus.map((status) => (
                                    <TableRow key={status.id}>
                                        <TableCell>{status.id}</TableCell>
                                        <TableCell>{status.resolution}</TableCell>
                                        <TableCell>{status.status}</TableCell>
                                        <TableCell className="font-mono text-sm">{status.path}</TableCell>
                                        <TableCell>{new Date(status.created_at).toLocaleString()}</TableCell>
                                        <TableCell>{new Date(status.updated_at).toLocaleString()}</TableCell>
                                        <TableCell>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handleDownload(status)}
                                                disabled={downloadingId === status.id || status.status !== "completed"}
                                            >
                                                {downloadingId === status.id ? (
                                                    <>
                                                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                                        Downloading...
                                                    </>
                                                ) : (
                                                    <>
                                                        <Download className="h-4 w-4 mr-2" />
                                                        Download
                                                    </>
                                                )}
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}