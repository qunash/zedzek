import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs))

export const getBaseUrl = () => {

    const context = process.env.CONTEXT

    console.log("context", context)

    if (context === "production") {
        console.log("Redirecting to production URL, process.env.URL", process.env.URL)
        return process.env.URL
    }

    console.log("Redirecting to deploy URL, process.env.DEPLOY_URL", process.env.DEPLOY_URL)
    console.log("Redirecting to deploy prime URL, process.env.DEPLOY_PRIME_URL", process.env.DEPLOY_PRIME_URL)
    console.log("Redirecting to URL, process.env.URL", process.env.URL)
    console.log("Redirecting to fallback URL, http://localhost:3000")
    return (
        process.env.DEPLOY_URL ??
        process.env.DEPLOY_PRIME_URL ??
        process.env.URL ??
        "http://localhost:3000"
    )
}