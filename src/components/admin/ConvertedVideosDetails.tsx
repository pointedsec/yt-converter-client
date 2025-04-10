import { Video } from "@/types/VideoTypes";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Eye } from "lucide-react";

export default function ConvertedVideoDetails({videos}: {videos: Video[]|null}) {
    const navigate = useNavigate();

    if (!videos || videos.length === 0) {
        return (
            <Card>
                <CardContent className="pt-6">
                    <p className="text-center text-muted-foreground">No videos found</p>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Converted Videos</CardTitle>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>ID</TableHead>
                            <TableHead>Title</TableHead>
                            <TableHead>Video ID</TableHead>
                            <TableHead>User ID</TableHead>
                            <TableHead>IP</TableHead>
                            <TableHead>Created</TableHead>
                            <TableHead>Updated</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {videos.map((video) => (
                            <TableRow key={video.id}>
                                <TableCell className="font-medium">{video.id}</TableCell>
                                <TableCell>{video.title}</TableCell>
                                <TableCell className="font-mono text-sm">{video.video_id}</TableCell>
                                <TableCell>{video.user_id}</TableCell>
                                <TableCell className="font-mono text-sm">{video.requested_by_ip}</TableCell>
                                <TableCell>{new Date(video.created_at).toLocaleString()}</TableCell>
                                <TableCell>{new Date(video.updated_at).toLocaleString()}</TableCell>
                                <TableCell className="text-right">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="cursor-pointer"
                                        onClick={() => navigate(`/admin/video/${video.video_id}`)}
                                    >
                                        <Eye className="h-4 w-4 mr-2" />
                                        View Details
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}