'use client'

import { auth } from '@/lib/firebase'
import { getCookie } from 'cookies-next'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

// Hook for components to use
export function useAuth() {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)
    const router = useRouter()
    
    useEffect(() => {
        const idToken = getCookie('idToken')
        if (!idToken) {
            setIsAuthenticated(false)
            router.push('/login')
            return
        }
        
        const unsubscribe = auth.onAuthStateChanged(user => {
            if (user) {
                setIsAuthenticated(true)
            } else {
                setIsAuthenticated(false)
                router.push('/login')
            }
        })
        
        return () => unsubscribe()
    }, [router])
    
    return { isAuthenticated, user: auth.currentUser }
} 