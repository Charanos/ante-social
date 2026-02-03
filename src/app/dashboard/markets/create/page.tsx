"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import DashboardHeader from "@/components/dashboard/DashboardHeader"
import { MarketCreationWizard } from "@/components/markets/MarketCreationWizard"
import { mockUser } from "@/lib/mockData"
import { LoadingLogo } from "@/components/ui/LoadingLogo"
import { ShieldAlert } from "lucide-react"

export default function CreateMarketPage() {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(true)
    const [isAdmin, setIsAdmin] = useState(false)

    useEffect(() => {
        // Simulate checking permissions
        const checkAccess = () => {
            if (mockUser.role !== 'admin' && mockUser.role !== 'group_admin') {
                setTimeout(() => router.push('/dashboard'), 2000)
            } else {
                setIsAdmin(true)
            }
            setIsLoading(false)
        }

        setTimeout(checkAccess, 1000)
    }, [router])

    if (isLoading) {
        return <LoadingLogo fullScreen size="lg" />
    }

    if (!isAdmin) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4">
                <div className="text-center space-y-4 max-w-sm">
                    <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto">
                        <ShieldAlert className="w-8 h-8" />
                    </div>
                    <h2 className="text-xl font-semibold text-gray-900">Access Denied</h2>
                    <p className="text-gray-500">You do not have permission to view this page. Redirecting...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen pb-20">
            <div className="max-w-7xl mx-auto px-4 md:px-8 space-y-8">
                <DashboardHeader
                    user={mockUser}
                    subtitle="Launch a new betting market"
                />

                <MarketCreationWizard />
            </div>
        </div>
    )
}
