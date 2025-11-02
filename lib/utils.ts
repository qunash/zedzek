import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs))

export const getBaseUrl = () => {
    // Client-side: use current origin (always available in browser)
    if (typeof window !== "undefined") {
        return window.location.origin
    }

    // Server-side: use Netlify environment variables
    const context = process.env.CONTEXT
    if (context === "production") {
        return process.env.URL || process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
    } else if (context === "deploy-preview" || context === "branch-deploy") {
        return process.env.DEPLOY_PRIME_URL || process.env.URL || "http://localhost:3000"
    }

    // Explicit site URL (works on any platform, useful for manual override)
    if (process.env.NEXT_PUBLIC_SITE_URL) {
        return process.env.NEXT_PUBLIC_SITE_URL
    }

    // Default fallback for local development
    return "http://localhost:3000"
}
