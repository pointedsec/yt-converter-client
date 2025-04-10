import { Video } from "@/types/VideoTypes";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { useState } from "react";
import { DeleteVideoById } from "@/utils/api";
import { toast } from "sonner";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useNavigate, useLocation } from "react-router-dom";

export default function DeleteVideoButton({video}: {video: Video}){
    const [isDeleting, setIsDeleting] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    const handleDelete = async () => {
        setIsDeleting(true);
        const response = await DeleteVideoById(video.video_id);
        if ('error' in response) {
            toast.error("Failed to delete video");
        } else {
            toast.success("Video deleted successfully");
            if (location.pathname.includes(`/admin/video/${video.video_id}`)) {
                navigate('/admin/');
            } else {
                window.location.reload();
            }
        }
        setIsDeleting(false);
    };

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button variant="destructive" size="sm">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete Video
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete the video
                        and all its converted files.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={handleDelete}
                        disabled={isDeleting}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                        {isDeleting ? "Deleting..." : "Delete"}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}