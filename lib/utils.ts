import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs))

export const getBaseUrl = () => {
    if (typeof window !== "undefined" && window.location?.origin) {
        console.log("1. Returning window.location.origin:", window.location.origin)
        return window.location.origin
    }

    const netlifyUrl =
        process.env.NEXT_PUBLIC_SITE_URL ||
        process.env.SITE_URL ||
        process.env.URL
    if (netlifyUrl) {
        console.log("process.env.NEXT_PUBLIC_SITE_URL:", process.env.NEXT_PUBLIC_SITE_URL)
        console.log("process.env.SITE_URL:", process.env.SITE_URL)
        console.log("process.env.URL:", process.env.URL)
        console.log("2. Returning netlifyUrl:", netlifyUrl)
        return netlifyUrl
    }

    const vercelUrl = process.env.NEXT_PUBLIC_VERCEL_URL
    if (vercelUrl) {
        console.log("process.env.NEXT_PUBLIC_VERCEL_URL:", process.env.NEXT_PUBLIC_VERCEL_URL)
        console.log("3. Returning vercelUrl:", vercelUrl)
        return `https://${vercelUrl}`
    }

    console.log("4. Returning fallback: http://localhost:3000")
    return "http://localhost:3000"
}