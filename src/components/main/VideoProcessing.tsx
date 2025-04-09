import { Video } from "@/types/VideoTypes"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import { Loader2, Music, Video as VideoIcon } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { GetVideoResolutions, ProcessVideoMP3, ProcessVideoMP4 } from "@/utils/api"
import { useEffect } from "react"
import { toast } from "sonner"
import VideoProcessingInformation from "./VideoProcessingInformation"

type FormatType = "MP3" | "MP4" | null;

export default function VideoProcessing({ video }: { video: Video }) {
    const [selectedFormat, setSelectedFormat] = useState<FormatType>(null);
    const [resolutions, setResolutions] = useState<string[]>([]);
    const [selectedResolution, setSelectedResolution] = useState<string>("");
    const [isConverting, setIsConverting] = useState(false);
    const [processing, setProcessing] = useState(false)
    const [status, setStatus] = useState<string>("")
    const [isLoadingResolutions, setIsLoadingResolutions] = useState(false);

    useEffect(() => {
        const fetchResolutions = async () => {
            if (selectedFormat === "MP4") {
                setIsLoadingResolutions(true);
                const response = await GetVideoResolutions(video.video_id);
                if (!('error' in response)) {
                    setResolutions(response);
                }
                setIsLoadingResolutions(false);
            }
        };

        if (resolutions.length === 0) {
            fetchResolutions();
        }
    }, [selectedFormat, video.video_id, resolutions.length]);

    const handleConvert = async () => {
        setIsConverting(true);
        if (selectedFormat === "MP3") {
           const response = await ProcessVideoMP3(video.video_id)
           if ('error' in response) {
               toast.error(response.message)
               return;
           }
           setProcessing(true)
           toast.success(response.message)
        } else if (selectedFormat === "MP4") {
            const response = await ProcessVideoMP4(video.video_id, selectedResolution)
            if ('error' in response) {
                toast.error(response.message)
                return;
            }
            toast.success(response.message) 
            setProcessing(true)
        }
        setIsConverting(false);
    };

    const finishedProcessing = (status: string|null) => {
        setProcessing(false)
        console.log(status)
        if (!status) {
            toast.error("Something went wrong while processing the video, try again later")
            return;
        }
        setStatus(status)
    }

    return (
        <Card className="mt-4">
            <CardHeader>
                <CardTitle>Convert Options</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="space-y-4">
                    <Label>Select Format</Label>
                    <div className="flex gap-4">
                        <Button
                            variant={selectedFormat === "MP3" ? "default" : "outline"}
                            className="w-32 flex gap-2"
                            onClick={() => {
                                setSelectedFormat("MP3");
                                setSelectedResolution("");
                            }}
                        >
                            <Music className="h-4 w-4" />
                            MP3
                        </Button>
                        <Button
                            variant={selectedFormat === "MP4" ? "default" : "outline"}
                            className="w-32 flex gap-2"
                            onClick={() => setSelectedFormat("MP4")}
                        >
                            <VideoIcon className="h-4 w-4" />
                            MP4
                        </Button>
                    </div>
                </div>

                {selectedFormat === "MP4" && (
                    <div className="space-y-4">
                        <Label>Select Resolution</Label>
                        <RadioGroup
                            value={selectedResolution}
                            onValueChange={setSelectedResolution}
                            className="grid grid-cols-2 sm:grid-cols-3 gap-2"
                        >
                            {isLoadingResolutions && (
                                <div className="col-span-2 flex items-center space-x-2 gap-2">
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    Loading available resolutions... 
                                </div>
                            )}
                            {resolutions.map((resolution) => (
                                <div key={resolution} className="flex items-center space-x-2">
                                    <RadioGroupItem
                                        value={resolution}
                                        id={resolution}
                                    />
                                    <Label htmlFor={resolution}>{resolution}</Label>
                                </div>
                            ))}
                        </RadioGroup>
                    </div>
                )}

                {selectedFormat && (
                    <Button
                        className="w-full"
                        disabled={isConverting || (selectedFormat === "MP4" && !selectedResolution)}
                        onClick={handleConvert}
                    >
                        {isConverting ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Converting...
                            </>
                        ) : (
                            <>Convert to {selectedFormat}</>
                        )}
                    </Button>
                )}

                {processing && status === "" && <VideoProcessingInformation video={video} callback={finishedProcessing} resolution={selectedResolution}/>}
                
                {status === "failed" && (
                    <div className="flex flex-col items-center gap-4 mt-4">
                        <p className="text-destructive">Processing failed. Would you like to try again?</p>
                        <Button 
                            variant="destructive"
                            onClick={() => {
                                setStatus("");
                                setProcessing(true);
                                handleConvert();
                            }}
                            className="w-full sm:w-auto"
                        >
                            <Loader2 className="mr-2 h-4 w-4" />
                            Try Again
                        </Button>
                    </div>
                )}

                {status === "completed" && (
                    <div className="flex flex-col items-center gap-4 mt-4">
                        <p className="text-green-600 dark:text-green-400">Processing completed successfully!</p>
                        <Button 
                            variant="default"
                            onClick={() => {
                                // Mock download for now
                                toast.success("Download started!");
                            }}
                            className="w-full sm:w-auto"
                        >
                            <VideoIcon className="mr-2 h-4 w-4" />
                            Download {selectedFormat}
                        </Button>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}