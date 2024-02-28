"use client"

import React, { useEffect, useState } from "react"
import { Separator } from "@radix-ui/react-dropdown-menu"
import { User, createClientComponentClient } from "@supabase/auth-helpers-nextjs"

import { Profile } from "@/types/supabase"
import { Button } from "@/components/ui/button"
import { UserAvatar } from "@/components/user-avatar"
import { useRouter } from 'next/navigation'

export default function AdminPage() {
    const supabase = createClientComponentClient<Database>()
    const [user, setUser] = useState<User | null | undefined>()
    const [profile, setProfile] = useState<Profile>()
    const [profileLoaded, setProfileLoaded] = useState(false)
    const router = useRouter()

    const [roleRequests, setRoleRequests] = useState<
        (Database["public"]["Tables"]["role_access_requests"]["Row"] & {
            profiles: Database["public"]["Tables"]["profiles"]["Row"]
        })[]
    >([])

    useEffect(() => {
        const fetchUser = async () => {
            const supaSession = await supabase.auth.getSession()
            if (supaSession?.data) {
                setUser(supaSession.data.session?.user)
            }
        }

        console.log("fetching user")
        fetchUser()

        const { data: listener } = supabase.auth.onAuthStateChange(
            async (event, newSession) => {
                if (event === "SIGNED_OUT") {
                    setUser(null)
                } else if (event === "SIGNED_IN" && newSession) {
                    setUser(newSession.user)
                }
            }
        )

        return () => {
            listener?.subscription.unsubscribe()
        }
    }, [supabase, supabase.auth])

    useEffect(() => {
        console.log('user changed', user)
        const fetchProfile = async (user_id: string) => {
            const { data } = await supabase
                .from("profiles")
                .select("*")
                .eq("id", user_id)

            setProfile(data ? data[0] : undefined)
            setProfileLoaded(true)
        }

        fetchProfile(user?.id || "")
    }, [supabase, user])

    useEffect(() => {
        console.log('profile changed', profile)
        if (profileLoaded && profile?.role !== "admin") {
            console.log('role', profile?.role)
            router.push("/")
        }
    }, [profile, router])

    useEffect(() => {
        const fetchRoleRequestsAndProfiles = async () => {
            const { data, error } = await supabase
                .from("role_access_requests")
                .select(
                    `
                        id,
                        user_id,
                        role,
                        created_at,
                        status,
                        profiles (
                            *
                        )
                    `
                )
                .eq("status", "pending")

            if (error) {
                console.error("error", error)
            } else {
                const requestsWithProfiles = data.map((item) => ({
                    ...item,
                    profiles: item.profiles,
                }))

                setRoleRequests(requestsWithProfiles)

                console.log("requestsWithProfiles", requestsWithProfiles)
            }
        }

        fetchRoleRequestsAndProfiles()
    }, [supabase])

    const handleApprove = async (userId: string) => {
        const { data, error } = await supabase.rpc("grant_proofreader_role", {
            p_user_id: userId,
        })

        if (error) {
            console.error("Error granting proofreader role:", error)
        } else {
            setRoleRequests((currentRequests) =>
                currentRequests.filter((request) => request.user_id !== userId)
            )
        }
    }

    const handleDeny = async (userId: string) => {
        const { data, error } = await supabase
            .from("role_access_requests")
            .update({ status: "rejected" })
            .eq("user_id", userId)

        if (error) {
            console.error("Error denying role request:", error)
        } else {
            setRoleRequests((currentRequests) =>
                currentRequests.filter((request) => request.user_id !== userId)
            )
        }
    }

    return profile?.role === 'admin' && (
        <div className="w-1/3">
            <div className="space-y-0.5">
                <h2 className="text-2xl font-bold tracking-tight">
                    Role Access Requests
                </h2>
            </div>
            <Separator className="my-6" />
            <div className="flex flex-col gap-4">
                {roleRequests.map((request) => (
                    <div className="flex items-center justify-between space-x-4">
                        <div className="flex w-fit gap-4">
                            <UserAvatar profile={request.profiles} />
                            <div className="flex-col">
                                <p className="text-sm font-medium leading-none">
                                    {request.profiles?.username}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                    {request.profiles?.role}
                                </p>
                            </div>
                        </div>
                        <div className="flex w-fit gap-4">
                            <Button
                                variant="secondary"
                                className="shrink-0"
                                onClick={() => handleDeny(request.user_id)}
                            >
                                Deny
                            </Button>
                            <Button
                                onClick={() => handleApprove(request.user_id)}
                            >
                                Approve
                            </Button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
