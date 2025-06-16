'use client'

import { X } from 'lucide-react'

interface FilterPanelProps {
    isOpen?: boolean
    onClose?: () => void
    title: string
    children: React.ReactNode
    isStatic?: boolean
}

const FilterPanel = ({
    isOpen = true,
    onClose,
    title,
    children,
    isStatic = false
}: FilterPanelProps) => {
    if (!isOpen && !isStatic) return null

    return (
        <>
            {!isStatic && (
                <div className="fixed inset-0 bg-black/50 z-40" onClick={onClose} />
            )}
            <div className={`${isStatic ? 'relative' : 'fixed top-0 right-0'} h-screen w-[400px] bg-white border-l shadow-lg z-50 m-0`}>
                <div className="h-full flex flex-col m-0">
                    <div className="p-6 border-b m-0">
                        <div className="flex items-center justify-between">
                            <h2 className="text-lg font-semibold">{title}</h2>
                            {!isStatic && onClose && (
                                <button
                                    onClick={onClose}
                                    className="text-gray-500 hover:text-gray-700"
                                >
                                    <X className="h-4 w-4" />
                                </button>
                            )}
                        </div>
                    </div>
                    <div className="flex-1 overflow-y-auto p-6">
                        {children}
                    </div>
                </div>
            </div>
        </>
    )
}

export default FilterPanel 