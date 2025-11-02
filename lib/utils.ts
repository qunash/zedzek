import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs))

export const getBaseUrl = () => {
    if (typeof window !== "undefined") {
        return window.location.origin
    }

    if (process.env.NEXT_PUBLIC_SITE_URL) {
        return process.env.NEXT_PUBLIC_SITE_URL
    }

    if (process.env.URL) {
        return process.env.URL
    }

    if (process.env.DEPLOY_URL) {
        return process.env.DEPLOY_URL
    }

    if (process.env.DEPLOY_PRIME_URL) {
        return process.env.DEPLOY_PRIME_URL
    }

    return "http://localhost:3000"
}