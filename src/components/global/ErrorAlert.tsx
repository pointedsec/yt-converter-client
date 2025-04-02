import { AlertCircle } from "lucide-react"

import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert"

export default function AlertDestructive({ message, messageTrace } : { message: string, messageTrace?: string }) {
  return (
    <Alert variant="destructive">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Error</AlertTitle>
      <AlertDescription>
        {message}
      </AlertDescription>
      {messageTrace && <AlertDescription>
        {messageTrace}
      </AlertDescription>}
    </Alert>
  )
}
