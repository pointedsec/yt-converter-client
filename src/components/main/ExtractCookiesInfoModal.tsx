import { useState } from "react"
import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogClose,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Info } from "lucide-react"

export default function ExtractCookiesInfoModal() {
    const [open, setOpen] = useState(false)

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="Cookies Info" className="cursor-pointer">
                    <Info className="w-5 h-5" />
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-screen flex flex-col">
                <DialogHeader>
                    <DialogTitle>
                        How to export your <code>cookies.txt</code> file
                    </DialogTitle>
                    <DialogDescription>
                        You can use your own YouTube cookies to unlock access to certain restricted content. Sometimes, using your cookies is also necessary to convert a video, as YouTube may flag the traffic as coming from a bot and prevent the video from being downloaded.
                        <br /><br />
                        This project allows the administrator to configure global cookies so that regular users don’t have to worry about it. However, you can also use your own cookies in case the administrator hasn’t set up global cookies, or if you want to access private videos from your own channel.
                        <br /><br />
                        Here’s how to extract them.
                    </DialogDescription>
                </DialogHeader>

                {/* Scrollable wrapper */}
                <div className="overflow-y-auto pr-2 mt-4 space-y-5 text-sm leading-relaxed flex-1">
                    <ol className="list-decimal list-inside space-y-4">
                        <li>
                            Install the <strong>"Get cookies.txt"</strong> browser extension and enable it for incognito mode:
                            <ul className="list-disc list-inside pl-4 mt-1 space-y-1">
                                <li>
                                    <a
                                        href="https://chromewebstore.google.com/detail/get-cookiestxt-locally/cclelndahbckbenkjhflpdbgdldlbecc"
                                        className="text-blue-600 underline"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        Chrome
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="https://addons.mozilla.org/es-ES/firefox/addon/cookies-txt/"
                                        className="text-blue-600 underline"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        Firefox
                                    </a>
                                </li>
                            </ul>
                        </li>
                        <li>Go to <strong>youtube.com</strong> in Incognito Mode and log in.</li>
                        <li>
                            Open <strong>youtube.com/robots.txt</strong>. This step is important because YouTube cookies rotate frequently, and accessing this page ensures the extracted cookies remain valid and stable.
                        </li>
                        <li>
                            Click on the extension icon and choose <em>"Export cookies for this domain"</em>/<em>"Current Site"</em>.
                            <div className="mt-2">
                                <img
                                    src="/images/extract-cookies.png"
                                    alt="Export cookies"
                                    className="border rounded-lg shadow max-w-full"
                                />
                            </div>
                        </li>
                        <li>
                            Save the <code>cookies.txt</code> file. Do not continue browsing YouTube — close the tab right after exporting.
                        </li>
                        <li>
                            Import the <strong>cookies.txt</strong> file into the upload section of this app.
                            <div className="mt-2">
                                <img
                                    src="/images/upload-cookies.png"
                                    alt="Upload cookies"
                                    className="border rounded-lg shadow max-w-full"
                                />
                            </div>
                            <p className="text-muted-foreground mt-2">
                                Don't worry — your cookies are deleted immediately after use and never stored.
                            </p>
                        </li>
                        <li>
                            Enjoy! You should now be able to access and convert restricted or private videos.
                        </li>
                    </ol>

                    <p className="text-muted-foreground">
                        ⚠️ Do not share your <code>cookies.txt</code> file with anyone. It may contain sensitive authentication data.
                    </p>

                    <div className="border-l-4 border-yellow-400 bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-200 p-4 rounded-md text-sm">
                        <strong>Note:</strong> To convert videos to <strong>MP4</strong>, the app first needs to retrieve available resolutions from YouTube. If YouTube is applying restrictions or blocking automated requests, the <code>cookies.txt</code> file is required for this step to work correctly.
                        <br /><br />
                        Therefore, to ensure MP4 downloads work properly:
                        <br />
                        1. First upload the <code>cookies.txt</code> file.
                        <br />
                        2. Then select the <strong>MP4</strong> format.
                    </div>
                </div>

                <DialogClose asChild>
                    <Button className="mt-6 w-full" variant="default">
                        Got it
                    </Button>
                </DialogClose>
            </DialogContent>
        </Dialog>
    )
}
