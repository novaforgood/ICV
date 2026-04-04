'use client'

import { updateClient } from '@/api/make-cases/make-case'
import {
    deleteHousingStatus,
    getHousingById,
} from '@/api/make-cases/make-housing'
import { AddHousingModalContent } from '@/app/_components/clientProfile/AddHousingModal'
import {
    ClientBio,
    ClientCitizenship,
    ClientContactInfo,
    ClientEthnicity,
    ClientHousing,
    ClientStaffDetails,
} from '@/app/_components/clientProfile/ClientProfileComponents'
import {
    AddHousingModalProvider,
    useAddHousingModal,
} from '@/app/_context/AddHousingModalContext'
import { ClientIntakeSchema } from '@/types/client-types'
import { formatLocalDateUS } from '@/utils/dateUtils'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import generatePDF, { Margin, Resolution, usePDF } from 'react-to-pdf'
import { TypeOf } from 'zod'
import { useEditFormStore } from '../../_lib/useEditFormStore'
import ProfileSection from '../intakeForm/ProfileComponent'

type ClientType = TypeOf<typeof ClientIntakeSchema>

function ClientProfileView({ client, id }: { client: ClientType; id: string }) {
    const { openModal } = useAddHousingModal()
    const [editMode, setEditMode] = useState(false)
    const [housingLogEditMode, setHousingLogEditMode] = useState(false)
    const [housingDeleteConfirmId, setHousingDeleteConfirmId] = useState<
        string | null
    >(null)
    const [showHousingLog, setShowHousingLog] = useState(false)
    const [housingStatuses, setHousingStatuses] = useState<any[]>([])
    const [exporting, setExporting] = useState(false)
    const { targetRef } = usePDF()
    const { getForm, updateForm, clearForm } = useEditFormStore()
    const formData = getForm(id)
    const router = useRouter()

    const toggleButton = () => {
        setEditMode(!editMode)
    }

    useEffect(() => {
        window.scrollTo({ top: 0 })
    }, [editMode])

    useEffect(() => {
        clearForm(id)
        updateForm(id, client)
    }, [client, id])

    const fetchHousingStatuses = async () => {
        try {
            const statuses = await getHousingById(id)
            setHousingStatuses(statuses)
        } catch (error) {
            console.error('Error fetching housing statuses:', error)
        }
    }

    useEffect(() => {
        fetchHousingStatuses()
        console.log(housingStatuses)
    }, [showHousingLog, id])

    useEffect(() => {
        if (!housingLogEditMode) setHousingDeleteConfirmId(null)
    }, [housingLogEditMode])

    const exportHousingLogPDF = async () => {
        try {
            setExporting(true)
            await new Promise((r) => requestAnimationFrame(() => r(null)))
            await new Promise((r) => requestAnimationFrame(() => r(null)))

            const today = new Date().toLocaleDateString('en-CA')
            const filename = `HousingLog_${client.clientCode}_${today}.pdf`

            await generatePDF(targetRef, {
                method: 'save',
                filename,
                resolution: Resolution.NORMAL,
                page: {
                    format: 'a4',
                    orientation: 'portrait',
                    margin: Margin.SMALL,
                },
                canvas: {
                    mimeType: 'image/jpeg',
                    qualityRatio: 1,
                },
                overrides: {
                    canvas: {
                        useCORS: true,
                        scrollY: 0,
                        backgroundColor: '#ffffff',
                    },
                },
            })
        } catch (err) {
            console.error('Export housing log failed:', err)
        } finally {
            setExporting(false)
        }
    }

    const closeHousingLog = () => {
        setShowHousingLog(false)
        setHousingLogEditMode(false)
        setHousingDeleteConfirmId(null)
    }

    return (
        <>
            <div className="flex min-h-screen px-[48px]">
                <div className="mb-[48px] w-screen min-w-[70%] space-y-[48px]">
                    {showHousingLog && (
                        <div
                            className="fixed inset-0 z-50 flex justify-end bg-black bg-opacity-50"
                            onClick={closeHousingLog}
                        >
                            <div
                                id="housingLogExport"
                                ref={targetRef}
                                className="relative h-full w-full overflow-y-auto bg-white p-[24px] shadow-lg sm:w-[70%]"
                                onClick={(e) => e.stopPropagation()} // prevent close when clicking inside
                            >
                                <button
                                    type="button"
                                    onClick={closeHousingLog}
                                    className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center text-gray-500"
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
                                <div className="m-[20px] flex w-full min-w-0 flex-row items-center justify-between gap-4 pr-14 pt-6">
                                    <h2 className="min-w-0 flex-1 font-['Epilogue'] text-[24px] font-semibold leading-[28px] text-[#1A1D20]">
                                        Housing Log
                                    </h2>
                                    {!exporting && (
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setHousingLogEditMode(
                                                    !housingLogEditMode,
                                                )
                                            }
                                            className="flex shrink-0 flex-row space-x-[8px] rounded-[5px] bg-black px-[12px] py-[8px] text-[14px] text-white"
                                        >
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                height="20px"
                                                viewBox="0 -960 960 960"
                                                width="20px"
                                                fill="#FFFFFF"
                                            >
                                                <path d="M216-216h51l375-375-51-51-375 375v51Zm-72 72v-153l498-498q11-11 23.84-16 12.83-5 27-5 14.16 0 27.16 5t24 16l51 51q11 11 16 24t5 26.54q0 14.45-5.02 27.54T795-642L297-144H144Zm600-549-51-51 51 51Zm-127.95 76.95L591-642l51 51-25.95-25.05Z" />
                                            </svg>
                                            <label>
                                                {housingLogEditMode
                                                    ? 'Done'
                                                    : 'Edit'}
                                            </label>
                                        </button>
                                    )}
                                </div>
                                <div className="m-[20px]">
                                    <div
                                        className={`grid ${housingLogEditMode ? 'grid-cols-4' : 'grid-cols-3'} border-b pb-2 font-bold`}
                                    >
                                        <p>Date</p>
                                        <p>Sheltered by ICV</p>
                                        <p>Housing status</p>
                                        {housingLogEditMode && (
                                            <span
                                                aria-hidden={true}
                                                className="min-w-0"
                                            />
                                        )}
                                    </div>
                                </div>
                                <div className="m-[20px] space-y-4">
                                    {housingStatuses.map((h) => (
                                        <div
                                            key={h.docID}
                                            className="relative border-b pb-4"
                                        >
                                            <div
                                                className={`grid ${housingLogEditMode ? 'grid-cols-4' : 'grid-cols-3'}`}
                                            >
                                                <div>
                                                    {h.date ? (
                                                        formatLocalDateUS(
                                                            h.date,
                                                        )
                                                    ) : (
                                                        <p>N/A</p>
                                                    )}
                                                </div>
                                                <p>{h.housedByICV || 'N/A'}</p>
                                                <p>
                                                    {h.housingStatus || 'N/A'}
                                                </p>
                                                {housingLogEditMode && (
                                                    <div
                                                        className={
                                                            housingDeleteConfirmId ===
                                                            h.docID
                                                                ? 'col-span-4 col-start-1 row-start-2 mt-6 flex min-w-0 justify-start lg:col-span-1 lg:col-start-4 lg:row-start-1 lg:mt-0 lg:justify-end'
                                                                : 'flex min-w-0 justify-end'
                                                        }
                                                    >
                                                        {housingDeleteConfirmId ===
                                                        h.docID ? (
                                                            <div className="flex w-full max-w-[min(100%,440px)] flex-col gap-[12px] lg:items-center">
                                                                <span className="w-full text-left text-sm text-neutral-600 lg:text-center">
                                                                    <strong>
                                                                        This
                                                                        action
                                                                        cannot
                                                                        be
                                                                        reversed.
                                                                    </strong>
                                                                </span>
                                                                <div className="flex w-full flex-row justify-start gap-[12px] lg:justify-center">
                                                                    <button
                                                                        type="button"
                                                                        onClick={() =>
                                                                            setHousingDeleteConfirmId(
                                                                                null,
                                                                            )
                                                                        }
                                                                        className="h-[42px] w-[100px] rounded-[5px] bg-[#27262A] px-4 py-2 text-white"
                                                                    >
                                                                        Cancel
                                                                    </button>
                                                                    <button
                                                                        type="button"
                                                                        onClick={async () => {
                                                                            await deleteHousingStatus(
                                                                                h.docID,
                                                                            )
                                                                            await fetchHousingStatuses()
                                                                            setHousingDeleteConfirmId(
                                                                                null,
                                                                            )
                                                                        }}
                                                                        className="h-[42px] w-[100px] rounded-[5px] bg-[#FF394D] px-4 py-2 text-white"
                                                                    >
                                                                        Delete
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        ) : (
                                                            <button
                                                                type="button"
                                                                onClick={() =>
                                                                    setHousingDeleteConfirmId(
                                                                        h.docID,
                                                                    )
                                                                }
                                                                className="text-red-500 hover:text-red-700"
                                                                title="Delete"
                                                            >
                                                                ✕
                                                            </button>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}

                                    {housingStatuses.length === 0 && (
                                        <p className="text-sm italic text-gray-500">
                                            No housing history found.
                                        </p>
                                    )}
                                </div>

                                {!exporting && (
                                    <button
                                        type="button"
                                        disabled={housingLogEditMode}
                                        onClick={exportHousingLogPDF}
                                        className="m-[20px] rounded-[5px] bg-[#1A1D20] px-[20px] py-[16px] text-white disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                        <div className="items-align flex flex-row justify-center space-x-[12px]">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                height="24px"
                                                viewBox="0 -960 960 960"
                                                width="24px"
                                                fill="#FFFFFF"
                                            >
                                                <path d="M320-240h320v-80H320v80Zm0-160h320v-80H320v80ZM240-80q-33 0-56.5-23.5T160-160v-640q0-33 23.5-56.5T240-880h320l240 240v480q0 33-23.5 56.5T720-80H240Zm280-520v-200H240v640h480v-440H520ZM240-800v200-200 640-640Z" />
                                            </svg>
                                            <label>Export to PDF</label>
                                        </div>
                                    </button>
                                )}
                            </div>
                        </div>
                    )}

                    {!editMode ? (
                        <>
                            <div className="space-y-[24px]">
                                <div className="flex flex-row items-center justify-between">
                                    <label className="font-epilogue text-[18px] font-bold uppercase leading-[18px] tracking-[0.9px] text-[#A2AFC3]">
                                        STAFF DETAILS
                                    </label>
                                    <button
                                        onClick={toggleButton}
                                        className="flex flex-row space-x-[8px] rounded-[5px] bg-black px-[12px] py-[8px] text-[14px] text-white"
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            height="20px"
                                            viewBox="0 -960 960 960"
                                            width="20px"
                                            fill="#FFFFFF"
                                        >
                                            <path d="M216-216h51l375-375-51-51-375 375v51Zm-72 72v-153l498-498q11-11 23.84-16 12.83-5 27-5 14.16 0 27.16 5t24 16l51 51q11 11 16 24t5 26.54q0 14.45-5.02 27.54T795-642L297-144H144Zm600-549-51-51 51 51Zm-127.95 76.95L591-642l51 51-25.95-25.05Z" />
                                        </svg>
                                        <label>Edit</label>
                                    </button>
                                </div>
                                <ClientStaffDetails data={client} />
                            </div>
                            <div className="space-y-[24px]">
                                <label className="font-epilogue text-[18px] font-bold uppercase leading-[18px] tracking-[0.9px] text-[#A2AFC3]">
                                    BIO
                                </label>
                                <ClientBio data={client} />
                            </div>
                            <div className="space-y-[24px]">
                                <label className="font-epilogue text-[18px] font-bold uppercase leading-[18px] tracking-[0.9px] text-[#A2AFC3]">
                                    CONTACT INFORMATION
                                </label>
                                <ClientContactInfo data={client} />
                            </div>
                            <div className="space-y-[24px]">
                                <label className="font-epilogue text-[18px] font-bold uppercase leading-[18px] tracking-[0.9px] text-[#A2AFC3]">
                                    CITIZENSHIP
                                </label>
                                <ClientCitizenship data={client} />
                            </div>
                            <div className="space-y-[24px]">
                                <label className="font-epilogue text-[18px] font-bold uppercase leading-[18px] tracking-[0.9px] text-[#A2AFC3]">
                                    ETHNICITY
                                </label>
                                <ClientEthnicity data={client} />
                            </div>
                            <div className="space-y-[24px]">
                                <div className="flex flex-row items-center justify-between gap-3">
                                    <label className="font-epilogue text-[18px] font-bold uppercase leading-[18px] tracking-[0.9px] text-[#A2AFC3]">
                                        HOUSING
                                    </label>
                                    <button
                                        type="button"
                                        onClick={openModal}
                                        className="h-[52px] w-[150px] rounded-[5px] bg-[#27262A] px-4 py-2 text-white"
                                    >
                                        + Add Status
                                    </button>
                                </div>

                                <ClientHousing
                                    data={client}
                                    setShowHousingLog={setShowHousingLog}
                                    recentHousing={
                                        housingStatuses.length > 0
                                            ? housingStatuses[
                                                  housingStatuses.length - 1
                                              ]
                                            : undefined
                                    }
                                />
                            </div>
                        </>
                    ) : (
                        <div className="mt-[20px]">
                            <ProfileSection
                                formType={formData}
                                updateForm={(form) => updateForm(id, form)}
                                hideHousingSection
                                onSubmitEdit={async (data) => {
                                    try {
                                        await updateClient(id, data)
                                        await fetchHousingStatuses()

                                        clearForm(id)
                                        setEditMode(false)
                                        router.refresh()
                                    } catch (err) {
                                        console.error(
                                            'updateClient error:',
                                            err,
                                        )
                                    }
                                }}
                                onCancel={() => {
                                    clearForm(id)
                                    updateForm(id, client)
                                    setEditMode(false)
                                }}
                                submitType="save"
                                titleStyle="font-epilogue text-[18px] font-bold uppercase leading-[18px] tracking-[0.9px] text-[#A2AFC3]"
                            />
                        </div>
                    )}
                </div>
            </div>
            <AddHousingModalContent
                clientId={id}
                onSuccess={async () => {
                    await fetchHousingStatuses()
                    router.refresh()
                }}
            />
        </>
    )
}

export const ClientProfileToggle = ({
    client,
    id,
}: {
    client: ClientType
    id: string
}) => {
    return (
        <AddHousingModalProvider>
            <ClientProfileView client={client} id={id} />
        </AddHousingModalProvider>
    )
}
