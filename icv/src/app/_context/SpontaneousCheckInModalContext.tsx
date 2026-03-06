'use client'

import React, { createContext, useContext, useState } from 'react'

interface SpontaneousCheckInModalContextType {
    isOpen: boolean
    openModal: () => void
    closeModal: () => void
}

const SpontaneousCheckInModalContext =
    createContext<SpontaneousCheckInModalContextType | undefined>(undefined)

export function SpontaneousCheckInModalProvider({
    children,
}: {
    children: React.ReactNode
}) {
    const [isOpen, setIsOpen] = useState(false)

    const openModal = () => setIsOpen(true)
    const closeModal = () => setIsOpen(false)

    return (
        <SpontaneousCheckInModalContext.Provider
            value={{ isOpen, openModal, closeModal }}
        >
            {children}
        </SpontaneousCheckInModalContext.Provider>
    )
}

export function useSpontaneousCheckInModal() {
    const context = useContext(SpontaneousCheckInModalContext)
    if (context === undefined) {
        throw new Error(
            'useSpontaneousCheckInModal must be used within a SpontaneousCheckInModalProvider'
        )
    }
    return context
}
