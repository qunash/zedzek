import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs))

export const getBaseUrl = () => {
    const env = process.env.NEXT_PUBLIC_VERCEL_ENV

    if (env === "production") {
        return process.env.NEXT_PUBLIC_SITE_URL // set manually by me to https://www.zedzek.com in Vercel dashboard
    } else if (env === "preview" || env === "development") {
        return `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
    } else {
        return "http://localhost:3000"
    }
}
