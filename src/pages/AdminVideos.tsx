import { useEffect, useState } from "react";
import { GetVideos } from "@/utils/api";
import { Video } from "@/types/VideoTypes";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Eye, Loader2 } from "lucide-react";
import { toast } from "sonner";
import DeleteVideoButton from "@/components/admin/DeleteVideoButton";

export default function AdminVideos() {
    const [videos, setVideos] = useState<Video[] | null>(null);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const videosPerPage = 5;

    useEffect(() => {
        const fetchVideos = async () => {
            const response = await GetVideos();
            if (response && 'error' in response) {
                toast.error("Failed to fetch videos");
                return;
            }
            setVideos(response);
            setLoading(false);
        };

        fetchVideos();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        );
    }

    const indexOfLastVideo = currentPage * videosPerPage;
    const indexOfFirstVideo = indexOfLastVideo - videosPerPage;
    const currentVideos = videos?.slice(indexOfFirstVideo, indexOfLastVideo) || [];
    const totalPages = videos ? Math.ceil(videos.length / videosPerPage) : 0;

    return (
        <div className="space-y-4">
            <h1 className="text-3xl font-bold">Videos Management</h1>
            <Card>
                <CardHeader>
                    <CardTitle>All Videos</CardTitle>
                </CardHeader>
                <CardContent>
                    {!videos || videos.length === 0 ? (
                        <p className="text-center text-muted-foreground">No videos found</p>
                    ) : (
                        <>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Thumbnail</TableHead>
                                        <TableHead>Title</TableHead>
                                        <TableHead>Video ID</TableHead>
                                        <TableHead>Created</TableHead>
                                        <TableHead>Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {currentVideos.map((video) => (
                                        <TableRow key={video.id}>
                                            <TableCell>
                                                <img 
                                                    src={`https://img.youtube.com/vi/${video.video_id}/mqdefault.jpg`}
                                                    alt={video.title}
                                                    className="w-32 rounded-md"
                                                />
                                            </TableCell>
                                            <TableCell className="font-medium">{video.title}</TableCell>
                                            <TableCell className="font-mono text-sm">{video.video_id}</TableCell>
                                            <TableCell>{new Date(video.created_at).toLocaleString()}</TableCell>
                                            <TableCell className="space-x-2">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    asChild
                                                >
                                                    <Link to={`/admin/video/${video.video_id}`}>
                                                        <Eye className="h-4 w-4 mr-2" />
                                                        View Details
                                                    </Link>
                                                </Button>
                                                <DeleteVideoButton video={video} />
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                            
                            <div className="flex items-center justify-end space-x-2 py-4">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                    disabled={currentPage === 1}
                                >
                                    <ChevronLeft className="h-4 w-4" />
                                    Previous
                                </Button>
                                <div className="text-sm text-muted-foreground">
                                    Page {currentPage} of {totalPages}
                                </div>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                    disabled={currentPage === totalPages}
                                >
                                    Next
                                    <ChevronRight className="h-4 w-4 ml-2" />
                                </Button>
                            </div>
                        </>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}