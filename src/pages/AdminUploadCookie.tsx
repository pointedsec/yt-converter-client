"use client"

import { useEffect, useState } from "react"
import { CheckCookiesFile } from "@/utils/api"
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
import { useDropzone } from "react-dropzone"

type ErrorType = {
  error: string
  statusCode: number
}

export default function AdminUploadCookiePage() {
  const [actualCookies, setActualCookies] = useState<CookieStatusType | null>(null)
  const [error, setError] = useState<ErrorType | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      const data = await CheckCookiesFile()
      if ("error" in data) {
        setError(data)
      } else {
        setActualCookies(data)
      }
      setLoading(false)
    }
    fetchData()
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      "text/plain": [".txt"],
    },
    multiple: false,
    onDrop: (acceptedFiles: any) => {
      const file = acceptedFiles[0]
      if (file) {
        // Replace this with actual upload logic
        console.log("Dropped file:", file)
      }
    },
  })

  const handleDelete = () => {
    // Replace with actual delete logic
    console.log("Delete cookies clicked")
  }

  return (
    <div className="max-w-xl mx-auto mt-10 px-4 space-y-6">
      {loading ? (
        <div className="space-y-4">
          <Skeleton className="h-6 w-1/2" />
          <Skeleton className="h-20 w-full" />
        </div>
      ) : error ? (
        <Alert variant="destructive">
          <IoIosWarning className="h-5 w-5" />
          <AlertTitle>Failed to load cookie file</AlertTitle>
          <AlertDescription>
            {error.error} (Status code: {error.statusCode})
          </AlertDescription>
        </Alert>
      ) : actualCookies ? (
        <Card>
          <CardHeader>
            <CardTitle>Cookie File Status</CardTitle>
            <CardDescription>
              Current status of the uploaded cookie file.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <p><strong>Exists:</strong> {actualCookies.exists ? "Yes" : "No"}</p>
            {actualCookies.exists && (
              <>
                <p>
                  <strong>Last Modified:</strong>{" "}
                  {new Date(actualCookies.last_modified).toLocaleString()}
                </p>
                {actualCookies.absolute_path && (
                  <p><strong>Path:</strong> {actualCookies.absolute_path}</p>
                )}
                {actualCookies.size_bytes !== undefined && (
                  <p>
                    <strong>Size:</strong>{" "}
                    {(actualCookies.size_bytes / 1024).toFixed(2)} KB
                  </p>
                )}
                <Button variant="destructive" onClick={handleDelete}>
                  Delete Cookie File
                </Button>
              </>
            )}
          </CardContent>
        </Card>
      ) : null}

      {/* Drag and Drop uploader */}
      <div
        {...getRootProps()}
        className="border border-dashed border-gray-400 rounded-xl p-6 text-center cursor-pointer hover:border-primary transition-colors"
      >
        <input {...getInputProps()} />
        {isDragActive ? (
          <p className="text-sm text-muted-foreground">Drop the file here…</p>
        ) : (
          <p className="text-sm text-muted-foreground">
            Drag and drop your <code>cookies.txt</code> file here, or click to select.
          </p>
        )}
      </div>
    </div>
  )
}
