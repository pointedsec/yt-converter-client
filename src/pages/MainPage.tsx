import { UseUserStore } from "@/store/userStore"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Youtube, Upload, History, Github, Code2, Server, Coffee } from "lucide-react"
import { User } from "@/types/AuthTypes"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Link } from "react-router-dom"

export default function MainPage() {
  const user = UseUserStore((state) => state.user) as User;

  const getRoleMessage = () => {
    switch (user.role) {
      case 'admin':
        return "You have administrator privileges. You can manage users and access all system features.";
      case 'guest':
        return "You're using a guest account. You can convert and manage your own videos.";
      default:
        return "Welcome to our private video conversion service.";
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center space-y-4 mb-12">
        <h1 className="text-4xl font-bold tracking-tight">
          Welcome back, <span className="text-primary">{user.username}</span>! 👋
        </h1>
        <div className="max-w-2xl mx-auto">
          <p className="text-muted-foreground text-lg mb-2">
            {getRoleMessage()}
          </p>
          <p className="text-muted-foreground text-lg">
            Ready to convert some videos? Choose an option below to get started.
          </p>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        <Card className="hover:shadow-lg transition-shadow flex flex-col">
          <CardHeader>
            <Youtube className="w-8 h-8 text-red-500 mb-2" />
            <CardTitle>Convert Video</CardTitle>
            <CardDescription className="min-h-[48px]">
              Convert YouTube videos to your preferred format (MP3 or MP4)
            </CardDescription>
          </CardHeader>
          <CardContent className="mt-auto">
            <Link to="/convert">
              <Button className="w-full cursor-pointer" variant="default">
                <Upload className="mr-2 h-4 w-4" /> Start Converting
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow flex flex-col">
          <CardHeader>
            <History className="w-8 h-8 text-blue-500 mb-2" />
            <CardTitle>Recent Conversions</CardTitle>
            <CardDescription className="min-h-[48px]">
              View your recently converted videos
            </CardDescription>
          </CardHeader>
          <CardContent className="mt-auto">
            <Link to='/recent'>
              <Button className="w-full cursor-pointer" variant="secondary">
                View History
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow flex flex-col">
          <CardHeader>
            <Upload className="w-8 h-8 text-green-500 mb-2" />
            <CardTitle>My Videos</CardTitle>
            <CardDescription className="min-h-[48px]">
              Access your converted video library
            </CardDescription>
          </CardHeader>
          <CardContent className="mt-auto">
            <Link to='/converted-history'>
              <Button className="w-full cursor-pointer" variant="outline">
                Browse Videos
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      <div className="mt-12 max-w-3xl mx-auto">
        <Accordion type="single" collapsible className="mb-8">
          <AccordionItem value="about">
            <AccordionTrigger className="text-lg">
              <Code2 className="mr-2 h-5 w-5" />
              About This Project
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-2 p-4">
                <p>This is an open-source YouTube video converter built with Golang, fiber and Python (yt-dlp).
                  It's designed to be self-hosted, giving you complete control over your data and conversion process and also, not be censored by your ISP</p>
                <div className="flex items-center gap-4 mt-4">
                  <Card className="p-3 flex items-center">
                    <Github className="mr-2 h-4 w-4" />
                    Open Source
                  </Card>
                  <Card className="p-3 flex items-center">
                    <Server className="mr-2 h-4 w-4" />
                    Self Hosted
                  </Card>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            Need help? Check out our <a href='https://github.com/pointedsec/yt-converter-api/blob/main/README.md' target='_blank'><Button variant="link" className="p-0 cursor-pointer">documentation</Button></a> or{" "}
            <HoverCard>
              <HoverCardTrigger asChild>
                <Button variant="link" className="p-0">contact the developer</Button>
              </HoverCardTrigger>
              <HoverCardContent className="w-80">
                <div className="flex justify-between space-x-4">
                  <Avatar>
                    <AvatarImage src="https://github.com/pointedsec.png" />
                    <AvatarFallback>PS</AvatarFallback>
                  </Avatar>
                  <div className="space-y-1">
                    <h4 className="text-sm font-semibold">@pointedsec</h4>
                    <p className="text-sm text-muted-foreground">
                      Full-stack developer passionate about creating open-source tools for the community.
                    </p>
                    <div className="flex items-center pt-2">
                      <Coffee className="mr-2 h-4 w-4" />
                      <a
                        href="https://github.com/pointedsec"
                        className="text-xs text-muted-foreground hover:underline"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Find me on GitHub
                      </a>
                    </div>
                  </div>
                </div>
              </HoverCardContent>
            </HoverCard>
          </p>
        </div>
      </div>
    </div>
  )
}