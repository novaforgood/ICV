'use client'

import React, { createContext, useContext, useState } from 'react'

interface AddHousingModalContextType {
    isOpen: boolean
    openModal: () => void
    closeModal: () => void
}

const AddHousingModalContext = createContext<
    AddHousingModalContextType | undefined
>(undefined)

export function AddHousingModalProvider({
    children,
}: {
    children: React.ReactNode
}) {
    const [isOpen, setIsOpen] = useState(false)

    const openModal = () => setIsOpen(true)
    const closeModal = () => setIsOpen(false)

    return (
        <AddHousingModalContext.Provider
            value={{ isOpen, openModal, closeModal }}
        >
            {children}
        </AddHousingModalContext.Provider>
    )
}

export function useAddHousingModal() {
    const context = useContext(AddHousingModalContext)
    if (context === undefined) {
        throw new Error(
            'useAddHousingModal must be used within an AddHousingModalProvider',
        )
    }
    return context
}
