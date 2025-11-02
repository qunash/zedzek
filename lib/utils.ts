import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs))

export const getBaseUrl = () => {
    // Client-side: use current origin (always available in browser)
    if (typeof window !== "undefined") {
        return window.location.origin
    }

    // Server-side: check environment variables
    // Netlify: URL or DEPLOY_PRIME_URL, or NEXT_PUBLIC_SITE_URL for production
    const netlifyUrl = process.env.URL || process.env.DEPLOY_PRIME_URL
    if (netlifyUrl) {
        return netlifyUrl
    }

    // Explicit site URL (works on any platform)
    if (process.env.NEXT_PUBLIC_SITE_URL) {
        return process.env.NEXT_PUBLIC_SITE_URL
    }

    // Default fallback
    return "http://localhost:3000"
}
