"use client"

import React, { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Separator } from "@radix-ui/react-dropdown-menu"
import {
    createClientComponentClient,
    User,
} from "@supabase/auth-helpers-nextjs"

import { Profile } from "@/types/supabase"
import { Button } from "@/components/ui/button"
import { UserAvatar } from "@/components/user-avatar"

type Roles = Database['public']['Enums']['roles']

export default function AdminPage() {
    const supabase = createClientComponentClient<Database>()
    const [user, setUser] = useState<User | null>(null)
    const [profile, setProfile] = useState<Profile | null>(null)
    const [loading, setLoading] = useState(true)
    const router = useRouter()

    type RoleRequestWithProfile = Database["public"]["Tables"]["role_access_requests"]["Row"] & {
        profiles: Database["public"]["Tables"]["profiles"]["Row"] | null;
    }
    
    const [roleRequests, setRoleRequests] = useState<RoleRequestWithProfile[]>([])

    useEffect(() => {
        const fetchUserAndProfile = async () => {
            try {
                setLoading(true)
                const { data: { session }, error: sessionError } = await supabase.auth.getSession()
                
                if (sessionError) throw sessionError

                if (session?.user) {
                    setUser(session.user)
                    
                    const { data: profileData, error: profileError } = await supabase
                        .from("profiles")
                        .select("*")
                        .eq("id", session.user.id)
                        .single()

                    if (profileError) throw profileError

                    setProfile(profileData)
                } else {
                    // No session, redirect to login
                    router.push("/")
                }
            } catch (error) {
                console.error("Error fetching user or profile:", error)
                // Optionally, redirect to an error page or show an error message
            } finally {
                setLoading(false)
            }
        }

        fetchUserAndProfile()

        const { data: listener } = supabase.auth.onAuthStateChange(
            async (event, newSession) => {
                if (event === "SIGNED_OUT") {
                    setUser(null)
                    setProfile(null)
                    router.push("/")
                } else if (event === "SIGNED_IN" && newSession) {
                    setUser(newSession.user)
                    fetchUserAndProfile() // Refetch profile on sign in
                }
            }
        )

        return () => {
            listener?.subscription.unsubscribe()
        }
    }, [supabase, router])

    useEffect(() => {
        const fetchRoleRequestsAndProfiles = async () => {
            if (profile?.role !== "admin") return

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
                console.error("Error fetching role requests:", error)
            } else {
                const requestsWithProfiles = data.map((item) => ({
                    ...item,
                    profiles: item.profiles,
                }))

                setRoleRequests(requestsWithProfiles)
            }
        }

        fetchRoleRequestsAndProfiles()
    }, [supabase, profile])

    const handleApprove = async (userId: string, requestedRole: Roles) => {
        const { data, error } = await supabase.rpc("grant_role", {
            p_user_id: userId,
            p_role: requestedRole
        })

        if (error) {
            console.error("Error granting role:", error)
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

    if (loading) {
        return <div>Loading...</div>
    }

    if (!user || !profile || profile.role !== "admin") {
        return <div>Access denied. You must be an admin to view this page.</div>
    }

    return (
        <div className="w-1/3">
            <div className="space-y-0.5">
                <h2 className="text-2xl font-bold tracking-tight">
                    Role Access Requests
                </h2>
            </div>
            <Separator className="my-6" />
            <div className="flex flex-col gap-4">
                {roleRequests.map((request) => (
                    <div key={request.id} className="flex items-center justify-between space-x-4">
                        <div className="flex w-fit gap-4">
                            <UserAvatar profile={request.profiles!} />
                            <div className="flex-col">
                                <p className="text-sm font-medium leading-none">
                                    {request.profiles?.username}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                    Current role: {request.profiles?.role}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                    Requested role: {request.role}
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
                                onClick={() =>
                                    handleApprove(request.user_id, request.role)
                                }
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