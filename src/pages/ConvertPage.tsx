import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Youtube, Wand2, Loader2 } from "lucide-react"
import { FormEvent, useEffect, useState } from "react"
import { checkIfValidURL, checkIfValidYoutubeURL } from "@/utils/strings"
import ErrorAlert from '../components/global/ErrorAlert'
import { GetVideoByID, InsertVideo } from "@/utils/api"
import { toast } from "sonner"
import VideoInformationCard from "@/components/main/VideoInformationCard"
import { Video } from "@/types/VideoTypes"
import VideoProcessing from "@/components/main/VideoProcessing"

type Error = {
    error: boolean,
    message: string
}

export default function ConvertPage() {
    const [videoURL, setVideoURL] = useState<string>("")
    const [videoID, setVideoID] = useState<string | null>(null)
    const [loading, setLoading] = useState<boolean>(false)
    const [videoData, setVideoData] = useState<Video | null>(null)
    const [error, setError] = useState<Error>({ error: false, message: "Mock error message" })

    const handleConvert = async (e: FormEvent<HTMLFormElement>) => {
        e.stopPropagation()
        e.preventDefault()
        setError({
            error: false,
            message: "Mock error message"
        })
        setLoading(true)
        setVideoID(null)
        const isValidURL = checkIfValidURL(videoURL) && checkIfValidYoutubeURL(videoURL)
        if (!isValidURL) {
            setError({
                error: true,
                message: "Invalid URL to convert, check if the URL is valid and also if is a valid Youtube URL"
            })
            setLoading(false)
            return
        }
        const data = await InsertVideo(videoURL)
        if ('videoID' in data) {
            setVideoID(data.videoID)
            setLoading(false)
            toast.success("Video Inserted into the Database, ready to convert!")
            return
        }
        if ('error' in data) {
            toast.error(data.error)
            setLoading(false)
            return
        }
        setLoading(false)
        toast.success("Video Inserted into the Database, ready to convert!")
    }

    useEffect(() => {
        const fetchVideo = async () => {
            if (!videoID) return;

            const video = await GetVideoByID(videoID);
            if (video && 'error' in video) {
                toast.error(video.error);
                return;
            }
            setVideoData(video);
        };

        fetchVideo();
    }, [videoID]);

    return (
        <div className="container mx-auto px-4 py-12">
            <div className="text-center space-y-6 mb-12 animate-fade-in">
                <h1 className="text-5xl font-bold bg-gradient-to-r from-red-500 to-purple-500 text-transparent bg-clip-text animate-gradient">
                    YouTube Converter
                </h1>
                <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                    Transform your favorite YouTube videos into MP3 or MP4 format with just one click
                </p>
            </div>

            <Card className="max-w-2xl mx-auto transform hover:scale-[1.01] transition-all">
                <CardHeader>
                    {error.error && <div className="m-2"><ErrorAlert message={error.message} /></div>}
                    <CardTitle className="flex items-center gap-2">
                        <Youtube className="h-6 w-6 text-red-500" />
                        Convert Video
                    </CardTitle>
                    <CardDescription>
                        Paste your YouTube URL below to get started
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleConvert}>
                        <div className="flex gap-3">
                            <Input
                                placeholder="https://youtube.com/watch?v=..."
                                className="animate-pulse-border"
                                value={videoURL}
                                onChange={(e) => setVideoURL(e.target.value)}
                            />
                            <Button type="submit" className="group cursor-pointer" disabled={loading}>
                                {loading ? <Loader2 className="animate-spin" /> : <Wand2 className="mr-2 h-4 w-4 group-hover:rotate-45 transition-transform" />}
                                Convert
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>

            {videoID && videoData && (
                <VideoInformationCard video={videoData} />
            )}

            {videoID && videoData && (
                <VideoProcessing video={videoData} />
            )}

            <style>{`
                @keyframes gradient {
                    0% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                    100% { background-position: 0% 50%; }
                }
                @keyframes fade-in {
                    from { opacity: 0; transform: translateY(-20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes pulse-border {
                    0% { border-color: hsl(var(--input)); }
                    50% { border-color: hsl(var(--primary)); }
                    100% { border-color: hsl(var(--input)); }
                }
                .animate-gradient {
                    background-size: 200% 200%;
                    animation: gradient 6s ease infinite;
                }
                .animate-fade-in {
                    animation: fade-in 1s ease-out;
                }
                .animate-pulse-border {
                    animation: pulse-border 2s ease-in-out infinite;
                }
            `}</style>
        </div>
    )
}