"use client"

import { useEffect, useState } from "react"
import { CheckCookiesFile, DeleteCookiesFile, UploadCookiesFile } from "@/utils/api"
import { CookieStatusType } from "@/types/CookiesTypes"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { IoIosWarning } from "react-icons/io"
import {
  Dropzone,
  DropzoneContent,
  DropzoneEmptyState,
} from "@/components/ui/shadcn-io/dropzone"
import { Loader2Icon, Trash2Icon } from "lucide-react"

type ErrorType = {
  error: string
  statusCode: number
}

export default function AdminUploadCookiePage() {
  const [actualCookies, setActualCookies] = useState<CookieStatusType | null>(null)
  const [error, setError] = useState<ErrorType | null>(null)
  const [dropzoneError, setDropzoneError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [uploadLoading, setUploadLoading] = useState(false)
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [files, setFiles] = useState<File[] | undefined>()

  useEffect(() => {
    fetchFileData()
  }, [])

  const fetchFileData = async () => {
    const data = await CheckCookiesFile()
    if ("error" in data) {
      setError(data)
    } else {
      setActualCookies(data)
    }
    setLoading(false)
  }

  const handleDelete = async () => {
    setError(null)
    setDeleteLoading(true)
    const response = await DeleteCookiesFile()
    if ("error" in response) {
      setError(response)
      setDeleteLoading(false)
      return
    }
    await fetchFileData()
    setDeleteLoading(false)
  }

  const handleDrop = (files: File[]) => {
    setFiles(files)
    setDropzoneError(null)
    console.log("Dropped files:", files)
  }

  const handleDropError = (error: { code: string; message: string }) => {
    setDropzoneError(error.message)
  }

  const handleUploadFile = async () => {
    setUploadLoading(true)
    setError(null)
    setFiles(undefined)
    if (!files) return
    const response = await UploadCookiesFile(files)
    if ("error" in response) {
      setError(response)
      setUploadLoading(false)
      return
    }
    setUploadLoading(false)
    fetchFileData()
  }

  return (
    <div className="max-w-4xl mx-auto mt-12 px-6 space-y-6 text-sm">
      {/* Header */}
      <div className="text-center space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">
          Manage YouTube Cookies
        </h1>
        <p className="text-muted-foreground text-sm">
          Upload your <code>cookies.txt</code> to enable access to restricted videos.
        </p>
      </div>

      {/* Loading/Error */}
      {loading ? (
        <div className="space-y-4">
          <Skeleton className="h-6 w-1/2" />
          <Skeleton className="h-24 w-full" />
        </div>
      ) : error ? (
        <Alert variant="destructive" className="border border-red-500/30 bg-red-500/5">
          <IoIosWarning className="h-5 w-5 text-red-500" />
          <AlertTitle className="text-red-400">Failed to load cookie file</AlertTitle>
          <AlertDescription className="text-red-300">{error.error}</AlertDescription>
        </Alert>
      ) : (
        <div className="flex flex-col md:flex-row gap-6 md:gap-4">
          {/* Cookie Info Card */}
          <Card className="flex-1 bg-white/5 border border-white/10 backdrop-blur-md rounded-2xl">
            <CardHeader>
              <CardTitle className="text-white">Cookie File</CardTitle>
              <CardDescription className="text-muted-foreground">
                Current status of the uploaded cookie file.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div>
                <span className="text-muted-foreground">Exists:</span>{" "}
                {actualCookies?.exists ? "Yes" : "No"}
              </div>
              {actualCookies?.exists && (
                <>
                  <div>
                    <span className="text-muted-foreground">Last Modified:</span>{" "}
                    {new Date(actualCookies.last_modified).toLocaleString()}
                  </div>
                  {actualCookies.absolute_path && (
                    <div>
                      <span className="text-muted-foreground">Path:</span>{" "}
                      <code>{actualCookies.absolute_path}</code>
                    </div>
                  )}
                  {actualCookies.size_bytes !== undefined && (
                    <div>
                      <span className="text-muted-foreground">Size:</span>{" "}
                      {(actualCookies.size_bytes / 1024).toFixed(2)} KB
                    </div>
                  )}
                  <Button
                    variant="destructive"
                    onClick={handleDelete}
                    disabled={deleteLoading}
                    className="mt-3"
                  >
                    {deleteLoading ? (
                      <>
                        <Loader2Icon className="animate-spin mr-2 h-4 w-4" />
                        Deleting...
                      </>
                    ) : (
                      <>
                        <Trash2Icon className="mr-2 h-4 w-4" />
                        Delete Cookie File
                      </>
                    )}
                  </Button>
                </>
              )}
            </CardContent>
          </Card>

          {/* Dropzone */}
          <div className="flex-1 gap-2">
            <Dropzone
              accept={{ 'text/plain': ['.txt'] }}
              maxFiles={1}
              maxSize={1024 * 1024 * 2}  // 2 MB
              minSize={512}       // 0.5 KB
              onDrop={handleDrop}
              onError={(err: Error) =>
                handleDropError({ code: err.name, message: err.message })
              }
              src={files}
              className="h-full border-dashed border-2 border-white/20 rounded-xl bg-white/5 backdrop-blur-sm transition hover:border-white/40 flex items-center justify-center"
            >
              <DropzoneEmptyState />
              <DropzoneContent />
            </Dropzone>
            <div className="w-full mt-4">
              <Button
                onClick={handleUploadFile}
                disabled={!files || uploadLoading}
                variant="secondary"
                className="w-full mt-2"
              >
                {uploadLoading ? (
                  <>
                    <Loader2Icon className="animate-spin mr-2 h-4 w-4" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 mr-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5-5m0 0l5 5m-5-5v12" />
                    </svg>
                    Upload File
                  </>
                )}
              </Button>

            </div>
          </div>
        </div>
      )}

      {/* Dropzone error */}
      {dropzoneError && (
        <Alert variant="destructive" className="border border-red-500/30 bg-red-500/5">
          <IoIosWarning className="h-5 w-5 text-red-500" />
          <AlertTitle className="text-red-400">Invalid File</AlertTitle>
          <AlertDescription className="text-red-300">
            {dropzoneError}
          </AlertDescription>
        </Alert>
      )}
    </div>

  )
}
