import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs))

export const getBaseUrl = () => {

    const context = process.env.CONTEXT

    if (context === "production") {
        return process.env.URL
    }

    return (
        process.env.DEPLOY_URL ??
        process.env.DEPLOY_PRIME_URL ??
        process.env.URL ??
        "http://localhost:3000"
    )
}