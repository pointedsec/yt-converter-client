import { Video } from "@/types/VideoTypes";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, User } from "lucide-react";

export default function VideoInformationCard({ video }: { video: Video }) {
    const formatDate = (date: Date) => {
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    return (
        <Card className="mt-8 max-w-2xl mx-auto transform hover:scale-[1.01] transition-all">
            <CardHeader>
                <CardTitle className="flex items-center justify-between">
                    <span>Video Information</span>
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="relative aspect-video rounded-lg overflow-hidden">
                    <img 
                        src={`https://img.youtube.com/vi/${video.video_id}/maxresdefault.jpg`}
                        alt={video.title}
                        className="object-cover w-full h-full"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <h2 className="absolute bottom-4 left-4 right-4 text-white font-semibold text-lg line-clamp-2">
                        {video.title}
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        <span>Created: {formatDate(video.created_at)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        <span>Updated: {formatDate(video.updated_at)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                        <User className="h-4 w-4" />
                        <span>User ID: {video.user_id}</span>
                    </div>
                </div>

                <div className="pt-4 flex justify-end space-x-2">
                    <Badge variant="secondary" className="cursor-pointer hover:bg-secondary/80">
                        MP3
                    </Badge>
                    <Badge variant="secondary" className="cursor-pointer hover:bg-secondary/80">
                        MP4
                    </Badge>
                </div>
            </CardContent>
        </Card>
    );
}