import { Button } from "@/components/ui/button"
import { useNavigate } from "react-router-dom"
import { Shield, AlertTriangle, ArrowLeft } from "lucide-react"

export default function NotFound() {
    const navigate = useNavigate()

    return (
        <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
            {/* Animated Background */}
            <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] dark:bg-grid-slate-700/50 bg-slate-100 dark:bg-slate-900">
                <div className="absolute inset-0 bg-gradient-to-tr from-red-500/30 to-blue-500/30 animate-pulse"></div>
                <div className="absolute inset-0 animate-[spin_30s_linear_infinite] bg-police-lights opacity-30"></div>
            </div>

            {/* Content */}
            <div className="relative z-10 text-center p-8 max-w-2xl mx-auto backdrop-blur-sm bg-white/10 rounded-xl border border-white/20 shadow-2xl">
                <div className="flex justify-center items-center mb-6 animate-bounce">
                    <Shield className="h-16 w-16 text-red-500" />
                    <AlertTriangle className="h-16 w-16 text-blue-500 ml-4" />
                </div>

                <h1 className="text-6xl font-bold mb-4 animate-pulse">
                    4🚨4
                </h1>

                <div className="space-y-4 mb-8">
                    <h2 className="text-2xl font-semibold">
                        ⛔️ CONTENT BLOCKED ⛔️
                    </h2>
                    <p className="text-muted-foreground">
                        This page has been seized by the Anti-Fun Police Department.
                        All suspicious activities involving video downloads are being monitored.
                    </p>
                    <div className="text-sm text-muted-foreground italic">
                        (Just kidding, the page you're looking for doesn't exist)
                    </div>
                </div>

                <Button 
                    onClick={() => navigate('/')}
                    variant="secondary"
                    className="group hover:bg-red-500 hover:text-white transition-all cursor-pointer"
                >
                    <ArrowLeft className="mr-2 h-4 w-4 group-hover:animate-bounce-x" />
                    Escape to Safety
                </Button>
            </div>

            <style>{`
                @keyframes bounce-x {
                    0%, 100% { transform: translateX(0); }
                    50% { transform: translateX(-25%); }
                }
                .bg-police-lights {
                    background: repeating-linear-gradient(
                        45deg,
                        rgba(255, 0, 0, 0.1) 0px 10px,
                        rgba(0, 0, 255, 0.1) 10px 20px
                    );
                }
                .bg-grid-slate-100 {
                    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32' width='32' height='32' fill='none' stroke='rgb(15 23 42 / 0.04)'%3E%3Cpath d='M0 .5H31.5V32'/%3E%3C/svg%3E");
                }
                .bg-grid-slate-700 {
                    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32' width='32' height='32' fill='none' stroke='rgb(51 65 85 / 0.4)'%3E%3Cpath d='M0 .5H31.5V32'/%3E%3C/svg%3E");
                }
            `}</style>
        </div>
    )
}