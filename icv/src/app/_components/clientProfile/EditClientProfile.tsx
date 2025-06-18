'use client'

import { updateClient } from '@/api/make-cases/make-case'
import {
    createHousingUpdate,
    deleteHousingStatus,
    getHousingById,
} from '@/api/make-cases/make-housing'
import {
    ClientBio,
    ClientCitizenship,
    ClientContactInfo,
    ClientEthnicity,
    ClientHousing,
} from '@/app/_components/clientProfile/ClientProfileComponents'
import { ClientIntakeSchema } from '@/types/client-types'
import html2pdf from 'html2pdf.js'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { TypeOf } from 'zod'
import { useEditFormStore } from '../../_lib/useEditFormStore'
import ProfileSection from '../intakeForm/ProfileComponent'

type ClientType = TypeOf<typeof ClientIntakeSchema>

export const ClientProfileToggle = ({
    client,
    id,
}: {
    client: ClientType
    id: string
}) => {
    const [editMode, setEditMode] = useState(false)
    const [editHousing, setEditHousing] = useState(false)
    const [showHousingLog, setShowHousingLog] = useState(false)
    const [housingStatuses, setHousingStatuses] = useState<any[]>([])
    const [exporting, setExporting] = useState(false)
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

    const exportHousingLogPDF = async () => {
        try {
            setExporting(true)
            const el = document.getElementById('housingLogExport')
            if (!el) throw new Error('Housing log element not found')

            const today = new Date().toLocaleDateString('en-CA')

            const filename = `HousingLog_${client.clientCode}_${today}.pdf`

            await html2pdf()
                .set({
                    filename,
                    image: { type: 'jpeg', quality: 1 },
                    html2canvas: { scale: 2, useCORS: true, scrollY: 0 },
                    jsPDF: {
                        unit: 'in',
                        format: 'a4',
                        orientation: 'portrait',
                    },
                })
                .from(el)
                .save() // <-- this directly downloads the PDF
        } catch (err) {
            console.error('Export housing log failed:', err)
        } finally {
            setExporting(false)
        }
    }

    return (
        <div className="flex min-h-screen px-[48px]">
            <div className="mb-[48px] h-screen w-screen min-w-[70%] space-y-[48px]">
                {showHousingLog && (
                    <div
                        className="fixed inset-0 z-50 flex justify-end bg-black bg-opacity-50"
                        onClick={() => setShowHousingLog(false)} // click outside = close
                    >
                        <div
                            id="housingLogExport"
                            className="m-[240xp h-full w-[70%] overflow-y-auto bg-white p-[24px] shadow-lg"
                            onClick={(e) => e.stopPropagation()} // prevent close when clicking inside
                        >
                            <div className="m-[20px] flex flex-row justify-between">
                                <h2 className="font-['Epilogue'] text-[24px] font-semibold leading-[28px] text-[#1A1D20]">
                                    Housing Log
                                </h2>
                                {!exporting && (
                                    <button
                                        onClick={() => setEditMode(!editMode)}
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
                                        <label>
                                            {editMode ? 'Done' : 'Edit'}
                                        </label>
                                    </button>
                                )}
                            </div>
                            <div className="m-[20px]">
                                <div
                                    className={`grid ${editMode ? 'grid-cols-4' : 'grid-cols-3'} border-b pb-2 font-bold`}
                                >
                                    <p>Date</p>
                                    <p>Sheltered by ICV</p>
                                    <p>Housing status</p>
                                </div>
                            </div>
                            <div className="m-[20px] space-y-4">
                                {housingStatuses.map((h) => (
                                    <div
                                        key={h.docID}
                                        className="relative border-b pb-2"
                                    >
                                        <div
                                            className={`grid ${editMode ? 'grid-cols-4' : 'grid-cols-3'}`}
                                        >
                                            <p>{h.date}</p>
                                            <p>{h.housedByICV}</p>
                                            <p>{h.housingStatus}</p>
                                            {editMode && (
                                                <div className="flex justify-end">
                                                    <button
                                                        onClick={async () => {
                                                            await deleteHousingStatus(
                                                                h.docID,
                                                            )
                                                            await fetchHousingStatuses()
                                                        }}
                                                        className="text-red-500 hover:text-red-700"
                                                        title="Delete"
                                                    >
                                                        ✕
                                                    </button>
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
                                    onClick={exportHousingLogPDF}
                                    className="m-[20px] rounded-[5px] bg-[#1A1D20] px-[20px] py-[16px] text-white"
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
                                    BIO
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
                            <label className="font-epilogue text-[18px] font-bold uppercase leading-[18px] tracking-[0.9px] text-[#A2AFC3]">
                                HOUSING
                            </label>

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
                            onSubmitEdit={async (data) => {
                                try {
                                    if (data.homeless) {
                                        const newHousing = {
                                            clientID: id,
                                            date:
                                                data.housingDate ??
                                                data.intakeDate,
                                            housingStatus: data.homeless || '',
                                            housedByICV: data.sheltered || '',
                                        }

                                        await createHousingUpdate(
                                            newHousing,
                                        ).catch((err) =>
                                            console.error(
                                                'Failed to create housing update:',
                                                err,
                                            ),
                                        )
                                        data.homeless = ''
                                        data.housingDate = ''
                                        data.sheltered = ''
                                    }

                                    await updateClient(id, data)

                                    clearForm(id)
                                    setEditMode(false)
                                    router.push(`/clients/${id}`)
                                } catch (err) {
                                    console.error('updateClient error:', err)
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
    )
}
