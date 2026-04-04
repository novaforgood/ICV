'use client'

import { createHousingUpdate } from '@/api/make-cases/make-housing'
import { useAddHousingModal } from '@/app/_context/AddHousingModalContext'
import { HOMELESS, YESNO } from '@/types/client-types'
import { useEffect, useState } from 'react'
import { RadioChoice } from '../intakeForm/MakeOptions'

export function AddHousingModalContent({
    clientId,
    onSuccess,
}: {
    clientId: string
    onSuccess: () => void | Promise<void>
}) {
    const { isOpen, closeModal: contextCloseModal } = useAddHousingModal()
    const [housingDate, setHousingDate] = useState('')
    const [sheltered, setSheltered] = useState('')
    const [housingStatus, setHousingStatus] = useState('')
    const [submitting, setSubmitting] = useState(false)

    const closeModal = () => {
        contextCloseModal()
    }

    useEffect(() => {
        if (isOpen) {
            setHousingDate(new Date().toLocaleDateString('en-CA'))
            setSheltered('')
            setHousingStatus('')
        }
    }, [isOpen])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!housingDate || !housingStatus || !sheltered) {
            return
        }
        try {
            setSubmitting(true)
            await createHousingUpdate({
                clientID: clientId,
                date: housingDate,
                housingStatus,
                housedByICV: sheltered,
            })
            await onSuccess()
            closeModal()
        } catch (err) {
            console.error('Add housing failed:', err)
        } finally {
            setSubmitting(false)
        }
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center">
            <div
                className="absolute inset-0 bg-black opacity-50"
                onClick={closeModal}
            />
            <div className="relative z-10 flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-lg bg-white shadow-lg">
                <button
                    type="button"
                    onClick={closeModal}
                    className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center text-gray-500"
                    aria-label="Close"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <path d="M18 6 6 18" />
                        <path d="m6 6 12 12" />
                    </svg>
                </button>
                <form
                    onSubmit={handleSubmit}
                    className="flex min-h-0 flex-1 flex-col space-y-[24px] p-[36px]"
                >
                    <h2 className="font-['Epilogue'] text-[22px] font-[500]">
                        Add housing
                    </h2>
                    <div className="grid grid-cols-2 gap-[24px] rounded-[10px] border border-[#DBD8E4] p-[24px]">
                        <div className="flex flex-col gap-[24px]">
                            <div className="flex flex-col space-y-[4px]">
                                <label className="font-['Epilogue'] text-[16px] font-normal leading-[18px] text-neutral-900">
                                    Date
                                </label>
                                <input
                                    type="date"
                                    value={housingDate}
                                    onChange={(e) =>
                                        setHousingDate(e.target.value)
                                    }
                                    className="w-full rounded border p-2"
                                    required
                                />
                            </div>
                            <div className="flex flex-col space-y-[4px]">
                                <label className="font-['Epilogue'] text-[16px] font-normal leading-[18px] text-neutral-900">
                                    Sheltered by ICV
                                </label>
                                <RadioChoice
                                    options={YESNO}
                                    selectedValue={sheltered}
                                    onChange={(v) => setSheltered(v ?? '')}
                                    name="add-housing-sheltered"
                                />
                            </div>
                        </div>
                        <div className="flex flex-col space-y-[4px]">
                            <label className="font-['Epilogue'] text-[16px] font-normal leading-[18px] text-neutral-900">
                                Housing status
                            </label>
                            <div className="flex flex-col space-y-[8px]">
                                <RadioChoice
                                    options={HOMELESS}
                                    selectedValue={housingStatus}
                                    onChange={(v) => setHousingStatus(v ?? '')}
                                    name="add-housing-status"
                                />
                            </div>
                        </div>
                    </div>
                    <div className="flex justify-start gap-[24px]">
                        <button
                            type="submit"
                            disabled={submitting}
                            className={`rounded-[5px] px-[20px] py-[16px] text-white ${
                                submitting
                                    ? 'cursor-not-allowed bg-gray-400'
                                    : 'bg-[#4EA0C9] hover:bg-[#246F95]'
                            }`}
                        >
                            {submitting ? 'Saving…' : 'Save'}
                        </button>
                        <button
                            type="button"
                            onClick={closeModal}
                            disabled={submitting}
                            className="rounded-[5px] bg-[#1A1D20] px-[20px] py-[16px] text-white hover:bg-[#6D757F]"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
