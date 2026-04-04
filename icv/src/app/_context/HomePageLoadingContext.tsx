'use client'

import { NavMainContentLoadingOverlay } from '@/app/_components/LoadingOverlay'
import React, {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
} from 'react'

type HomePageLoadingContextValue = {
    adjustLoading: (id: string, delta: number) => void
}

const HomePageLoadingContext =
    createContext<HomePageLoadingContextValue | null>(null)

export function HomePageLoadingProvider({
    children,
}: {
    children: React.ReactNode
}) {
    const [loadCounts, setLoadCounts] = useState<Record<string, number>>({})

    const adjustLoading = useCallback((id: string, delta: number) => {
        setLoadCounts((prev) => {
            const n = (prev[id] ?? 0) + delta
            const next = { ...prev }
            if (n <= 0) delete next[id]
            else next[id] = n
            return next
        })
    }, [])

    const anyLoading = useMemo(
        () => Object.values(loadCounts).some((c) => c > 0),
        [loadCounts],
    )

    const value = useMemo(
        () => ({ adjustLoading }),
        [adjustLoading],
    )

    return (
        <HomePageLoadingContext.Provider value={value}>
            {anyLoading && <NavMainContentLoadingOverlay />}
            {children}
        </HomePageLoadingContext.Provider>
    )
}

/** Report loading for a section (e.g. schedule, check-ins). Supports multiple mounts with the same id via ref counting. */
export function useHomePageLoadingReporter(id: string, isLoading: boolean) {
    const ctx = useContext(HomePageLoadingContext)

    useEffect(() => {
        if (!ctx || !isLoading) return
        ctx.adjustLoading(id, +1)
        return () => ctx.adjustLoading(id, -1)
    }, [id, isLoading, ctx])
}
