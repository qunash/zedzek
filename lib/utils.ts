import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs))

export const getBaseUrl = () => {
    if (typeof window !== "undefined" && window.location?.origin) {
        return window.location.origin
    }

    const netlifyUrl =
        process.env.NEXT_PUBLIC_SITE_URL ||
        process.env.SITE_URL ||
        process.env.URL
    if (netlifyUrl) {
        return netlifyUrl
    }

    const vercelUrl = process.env.NEXT_PUBLIC_VERCEL_URL
    if (vercelUrl) {
        return `https://${vercelUrl}`
    }

    return "http://localhost:3000"
}