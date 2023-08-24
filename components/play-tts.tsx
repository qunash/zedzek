import { useRef, useState } from "react"
import { Icons } from "./icons"
import { buttonVariants } from "./ui/button"

export default function PlayTTS({ text }: { text: string }) {
    const [isLoading, setIsLoading] = useState(false)
    const [isPlaying, setIsPlaying] = useState(false)
    const [audioUrl, setAudioUrl] = useState("")
    const audioRef = useRef<HTMLAudioElement | null>(null)

    const handlePlay = async () => {
        if (isPlaying) {
            setIsPlaying(false)
            if (audioRef.current) {
                audioRef.current.pause()
                audioRef.current.currentTime = 0
            }
            return
        }

        let fetchedAudioUrl = ""

        if (!audioUrl) {
            setIsLoading(true)

            try {
                const response = await fetch("/api/tts", {
                    method: "POST",
                    body: JSON.stringify({ text }),
                    headers: {
                        "Content-Type": "application/json",
                    },
                })

                if (!response.ok) {
                    throw new Error("Failed to fetch audio")
                }

                const data = await response.json()
                fetchedAudioUrl = data.audioUrl
                setAudioUrl(fetchedAudioUrl)
            } catch (error) {
                console.error("Error:", error)
            } finally {
                setIsLoading(false)
            }
        }

        const audioSource = audioUrl || fetchedAudioUrl

        if (audioSource) {
            audioRef.current = new Audio(audioSource)
            audioRef.current.addEventListener("ended", () => {
                setIsPlaying(false)
            })
            setIsPlaying(true)
            audioRef.current.play()
        }
    }

    return (
        <div className="flex items-center justify-center w-fit h-10 w-8">
            <div
                className={buttonVariants({
                    size: "default",
                    variant: "link",
                    className: "items-center justify-center p-0 text-slate-700 dark:text-slate-400 cursor-pointer",
                })}
                onClick={handlePlay}
            >
                {
                    isLoading ? <div className="h-4 w-4 self-center animate-spin rounded-full border-y-2 border-gray-500" /> :
                        isPlaying ? <Icons.stop className="h-5 w-5 fill-current" /> :
                            <Icons.play className="h-5 w-5 fill-current" />
                }
            </div>
        </div>
    )
}
