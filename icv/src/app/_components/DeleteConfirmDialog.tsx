'use client'

import { createPortal } from 'react-dom'

interface DeleteConfirmDialogProps {
    isOpen: boolean
    onClose: () => void
    onConfirm: () => void | Promise<void>
    title?: string
    entityName?: string
    confirmLabel?: string
}

const DeleteConfirmDialog: React.FC<DeleteConfirmDialogProps> = ({
    isOpen,
    onClose,
    onConfirm,
    title = 'Delete Check-in',
    entityName,
    confirmLabel = 'Delete',
}) => {
    if (!isOpen) return null

    const handleConfirm = async () => {
        await onConfirm()
    }

    return createPortal(
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
            onClick={onClose}
        >
            <div
                className="flex flex-col items-center justify-center space-y-[12px] rounded-lg bg-white px-[48px] py-[24px]"
                onClick={(e) => e.stopPropagation()}
            >
                <h3 className="text-center text-[20px]">
                    {title}
                    {entityName ? ` With ${entityName}` : ''}?
                </h3>
                <p className="text-center text-gray-600">
                    This action cannot be undone.
                </p>

                <button
                    type="button"
                    onClick={handleConfirm}
                    className="rounded-[5px] bg-[#FF394D] px-4 py-2 text-white hover:bg-red-600"
                >
                    {confirmLabel}
                </button>
            </div>
        </div>,
        document.body
    )
}

export default DeleteConfirmDialog
