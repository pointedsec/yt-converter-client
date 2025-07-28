import { useState, useEffect } from "react"
import { Video } from "@/types/VideoTypes"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Loader2, Music, Video as VideoIcon } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DownloadProcessedVideo, GetVideoResolutions, ProcessVideoMP3, ProcessVideoMP4 } from "@/utils/api"
import { toast } from "sonner"
import VideoProcessingInformation from "./VideoProcessingInformation"

import {
  Dropzone,
  DropzoneContent,
  DropzoneEmptyState,
} from "@/components/ui/shadcn-io/dropzone"
import ExtractCookiesInfoModal from "./ExtractCookiesInfoModal"

type FormatType = "MP3" | "MP4" | null;

export default function VideoProcessing({ video }: { video: Video }) {
  const [selectedFormat, setSelectedFormat] = useState<FormatType>(null)
  const [resolutions, setResolutions] = useState<string[]>([])
  const [selectedResolution, setSelectedResolution] = useState<string>("")
  const [isConverting, setIsConverting] = useState(false)
  const [processing, setProcessing] = useState(false)
  const [status, setStatus] = useState<string>("")
  const [isLoadingResolutions, setIsLoadingResolutions] = useState(false)

  const [files, setFiles] = useState<File[]>([])
  const [dropzoneError, setDropzoneError] = useState<null | { code: string, message: string }>(null)

  const handleDrop = (files: File[]) => {
    setFiles(files)
    setDropzoneError(null)
    console.log("Dropped files:", files)
  }

  const handleDropError = (err: { code: string, message: string }) => {
    setDropzoneError(err)
    setFiles([])
    toast.error(`Dropzone error: ${err.message}`)
  }

  useEffect(() => {
    const fetchResolutions = async () => {
      if (selectedFormat === "MP4") {
        setIsLoadingResolutions(true)
        const cookiesFile = files[0] || undefined
        const response = await GetVideoResolutions(video.video_id, cookiesFile)
        if (!("error" in response)) {
          setResolutions(response)
        }
        setIsLoadingResolutions(false)
      }
    }

    if (resolutions.length === 0) {
      fetchResolutions()
    }
  }, [selectedFormat, video.video_id, resolutions.length, files])

  const handleConvert = async () => {
    setIsConverting(true)

    const cookiesFile = files[0] || null

    if (selectedFormat === "MP3") {
      const response = await ProcessVideoMP3(video.video_id, cookiesFile)
      if ("error" in response) {
        toast.error(response.message)
        setIsConverting(false)
        return
      }
      setProcessing(true)
      toast.success(response.message)
    } else if (selectedFormat === "MP4") {
      const response = await ProcessVideoMP4(video.video_id, selectedResolution, cookiesFile)
      if ("error" in response) {
        toast.error(response.message)
        setIsConverting(false)
        return
      }
      toast.success(response.message)
      setProcessing(true)
    }

    setIsConverting(false)
  }

  const finishedProcessing = (status: string | null) => {
    setProcessing(false)
    if (!status) {
      toast.error("Something went wrong while processing the video, try again later")
      return
    }
    setStatus(status)
  }

  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle>Convert Options</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {status === "" && (
          <>
            <div className="space-y-4">
              <Label>Select Format</Label>
              <div className="flex gap-4">
                <Button
                  variant={selectedFormat === "MP3" ? "default" : "outline"}
                  className="w-32 flex gap-2"
                  onClick={() => {
                    setSelectedFormat("MP3")
                    setSelectedResolution("")
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
                    <div className="col-span-2 flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Loading available resolutions...
                    </div>
                  )}
                  {resolutions.map((resolution) => (
                    <div key={resolution} className="flex items-center space-x-2">
                      <RadioGroupItem value={resolution} id={resolution} />
                      <Label htmlFor={resolution}>{resolution}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            )}

            <div className="space-y-2">
              <div className="flex">
                <Label>Optional Cookies File</Label>
                <ExtractCookiesInfoModal />
              </div>
              <Dropzone
                accept={{ "text/plain": [".txt"] }}
                maxFiles={1}
                maxSize={2 * 1024 * 1024}
                minSize={512}
                onDrop={handleDrop}
                onError={(err: Error) =>
                  handleDropError({ code: err.name, message: err.message })
                }
                src={files}
                className="h-32 border-dashed border-2 border-white/20 rounded-xl bg-white/5 backdrop-blur-sm transition hover:border-white/40 flex items-center justify-center"
              >
                <DropzoneEmptyState />
                <DropzoneContent />
              </Dropzone>
              {dropzoneError && (
                <p className="text-red-500 text-sm">{dropzoneError.message}</p>
              )}
            </div>

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
          </>
        )}

        {selectedFormat && status !== "" && (
          <Button className="w-full" onClick={() => location.reload()}>
            Convert another video!
          </Button>
        )}

        {processing && status === "" && (
          <VideoProcessingInformation
            video={video}
            callback={finishedProcessing}
            resolution={selectedResolution}
            format={selectedFormat}
          />
        )}

        {status === "failed" && (
          <div className="flex flex-col items-center gap-4 mt-4">
            <p className="text-destructive">Processing failed. Would you like to try again?</p>
            <Button
              variant="destructive"
              onClick={() => location.reload()}
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
              onClick={async () => {
                const download = await DownloadProcessedVideo(
                  video.video_id,
                  selectedFormat,
                  selectedResolution
                )
                if (download) {
                  toast.success("Download started!")
                } else {
                  toast.error("There was an error creating your download link!")
                }
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
  )
}
