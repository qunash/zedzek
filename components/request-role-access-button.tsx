"use client"

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { useEffect, useState } from 'react'
import { LoadingSpinner } from './loading-spinner'

import { getI18nCLient } from "@/app/locales/client"
import { cn } from "@/lib/utils"

import { User } from "@supabase/supabase-js"
import { Button } from "./ui/button"

interface RequestRoleAccessButtonProps {
    className?: string
    user: User | null
    role: Database["public"]["Enums"]["roles"]
}

export function RequestRoleAccessButton({ className, user, role }: RequestRoleAccessButtonProps) {
    const supabase = createClientComponentClient<Database>()
    const t = getI18nCLient()

    const [isLoading, setIsLoading] = useState(false)
    const [isPending, setIsPending] = useState(false)

    useEffect(() => {
        const checkPendingRequest = async () => {
            if (user) {
                setIsLoading(true)
                const { data, error } = await supabase
                    .from('role_access_requests')
                    .select('status')
                    .eq('user_id', user.id)
                    .eq('role', role)
                    .eq('status', 'pending')

                setIsLoading(false)

                if (error) {
                    console.error('Error checking pending request:', error)
                } else if (data && data.length > 0) {
                    setIsPending(true)
                }
            }
        }

        checkPendingRequest()
    }, [user, role, supabase])

    const handleRequestAccess = async () => {
        if (!user) {
            console.error("User must be signed in to request access")
            return
        }

        setIsLoading(true)

        const { data, error } = await supabase.from('role_access_requests').insert([
            { user_id: user.id, role: role, status: 'pending' },
        ])

        setIsLoading(false)

        if (error) {
            console.error(`Error requesting ${role} access:`, error)
        } else {
            console.log(`${role} access request submitted successfully`)
            setIsPending(true) 
        }
    }

    return (
        <div className={cn(className, "self-center")}>
            {isLoading ? (
                <LoadingSpinner />
            ) : isPending ? (
                <div>{t(`contribute.pending_access_request`)}</div>
            ) : (
                <Button onClick={handleRequestAccess}>{t(`buttons.request_access`)}</Button>
            )}
        </div>
    )
}
