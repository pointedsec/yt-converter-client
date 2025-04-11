import { Card } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Heart, Github } from "lucide-react"

export default function Footer() {
  return (
    <Card className="mt-auto border-t">
      <div className="container mx-auto py-6">
        <div className="flex flex-col items-center space-y-4">
          <div className="flex items-center space-x-2">
            <img src="/favicon.png" alt="Logo" className="h-8 w-8" />
            <span className="text-lg font-semibold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              MediaFlow
            </span>
          </div>
          
          <Separator className="w-[60%]" />
          
          <div className="flex flex-col items-center space-y-2">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} MediaFlow. All rights reserved.
            </p>
            <div className="flex items-center space-x-1 text-sm">
              <span>Developed with</span>
              <Heart className="h-4 w-4 text-red-500 fill-red-500 animate-pulse" />
              <span>by</span>
              <a 
                href="https://github.com/pointedsec" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center hover:text-primary transition-colors"
              >
                pointedsec
                <Github className="h-4 w-4 ml-1" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
}
