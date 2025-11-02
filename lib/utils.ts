import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs))

export const getBaseUrl = () => {
    // Client-side: use window.location.origin (most reliable)
    if (typeof window !== "undefined") {
        return window.location.origin
    }

    // Server-side: use environment variables
    // Netlify environment variables
    const netlifyContext = process.env.CONTEXT
    const deployPrimeUrl = process.env.DEPLOY_PRIME_URL

    // Production on Netlify
    if (netlifyContext === "production") {
        return process.env.NEXT_PUBLIC_SITE_URL || "https://www.zedzek.com"
    }

    // Preview/deploy-preview/branch-deploy on Netlify
    if (netlifyContext === "deploy-preview" || netlifyContext === "branch-deploy") {
        return deployPrimeUrl || process.env.NEXT_PUBLIC_SITE_URL || "https://www.zedzek.com"
    }

    // Vercel fallback (for backward compatibility)
    const vercelEnv = process.env.NEXT_PUBLIC_VERCEL_ENV
    if (vercelEnv === "production") {
        return process.env.NEXT_PUBLIC_SITE_URL || "https://www.zedzek.com"
    } else if (vercelEnv === "preview" || vercelEnv === "development") {
        return `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
    }

    // Local development fallback
    return "http://localhost:3000"
}
