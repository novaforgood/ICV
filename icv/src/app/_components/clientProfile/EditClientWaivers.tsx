'use client'

import { updateClient } from '@/api/make-cases/make-case'
import { storage } from '@/data/firebase'
import { ClientIntakeSchema } from '@/types/client-types'
import { deleteObject, ref } from 'firebase/storage'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { TypeOf } from 'zod'
import { useEditFormStore } from '../../_lib/useEditFormStore'
import WaiverSection from '../intakeForm/WaiversComponent'

type ClientType = TypeOf<typeof ClientIntakeSchema>

export const ClientWaiversToggle = ({
    client,
    id,
}: {
    client: ClientType
    id: string
}) => {
    const [editMode, setEditMode] = useState(false)
    const [listEditMode, setListEditMode] = useState(false)
    const [deletingIndex, setDeletingIndex] = useState<number | null>(null)
    const { getForm, updateForm, clearForm } = useEditFormStore()

    const formData = getForm(id)
    const router = useRouter()

    const toggleButton = () => {
        setEditMode(!editMode)
        if (!editMode) setListEditMode(false)
    }

    const handleDeleteWaiver = async (index: number) => {
        const waivers = client.waivers ?? []
        const waiver = waivers[index]
        if (!waiver?.uri) return
        if (
            !window.confirm(
                `Remove "${waiver.name ?? 'this file'}" from this client? The file will be permanently deleted from storage.`,
            )
        ) {
            return
        }
        setDeletingIndex(index)
        try {
            await deleteObject(ref(storage, waiver.uri))
            const updated = waivers.filter((_, i) => i !== index)
            await updateClient(id, { waivers: updated })
            router.refresh()
            if (updated.length === 0) setListEditMode(false)
        } catch (err) {
            console.error('delete waiver error:', err)
        } finally {
            setDeletingIndex(null)
        }
    }

    useEffect(() => {
        clearForm(id)
        updateForm(id, client)
    }, [client, id])

    useEffect(() => {
        window.scrollTo({ top: 0 })
    }, [editMode])

    return (
        <div className="flex min-h-screen px-[48px]">
            <div className="mb-[48px] w-screen min-w-[70%] space-y-[48px]">
                {!editMode ? (
                    <div>
                        {client.waivers && client.waivers.length >= 0 ? (
                            <div className="p-4">
                                <div className="mb-[24px] flex flex-row items-center justify-between gap-3">
                                    <h2 className="font-epilogue text-[18px] font-bold uppercase leading-[18px] tracking-[0.9px] text-[#A2AFC3]">
                                        Client Waivers
                                    </h2>
                                    {client.waivers.length > 0 && (
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setListEditMode(!listEditMode)
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
                                                {listEditMode ? 'Done' : 'Edit'}
                                            </label>
                                        </button>
                                    )}
                                </div>
                                <div className="mb-[24px] flex flex-col space-y-2">
                                    {client.waivers.map((waiver, index) => (
                                        <div
                                            key={index}
                                            className="mt-4 flex items-center justify-between gap-2 first:mt-0"
                                        >
                                            <div className="min-w-0 flex-1">
                                                <label className="flex h-[36px] flex-row items-center gap-3 self-stretch rounded-lg bg-gray-200 px-3 py-1.5 text-sm text-gray-800">
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        height="24px"
                                                        viewBox="0 -960 960 960"
                                                        width="24px"
                                                        fill="#000000"
                                                        className="shrink-0"
                                                    >
                                                        <path d="M330-250h300v-60H330v60Zm0-160h300v-60H330v60Zm-77.69 310Q222-100 201-121q-21-21-21-51.31v-615.38Q180-818 201-839q21-21 51.31-21H570l210 210v477.69Q780-142 759-121q-21 21-51.31 21H252.31ZM540-620v-180H252.31q-4.62 0-8.46 3.85-3.85 3.84-3.85 8.46v615.38q0 4.62 3.85 8.46 3.84 3.85 8.46 3.85h455.38q4.62 0 8.46-3.85 3.85-3.84 3.85-8.46V-620H540ZM240-800v180-180V-160v-640Z" />
                                                    </svg>
                                                    <a
                                                        href={waiver.uri}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className={`truncate text-blue-600 underline ${listEditMode ? 'pointer-events-none opacity-60' : ''}`}
                                                    >
                                                        {waiver.name}
                                                    </a>
                                                </label>
                                            </div>
                                            {listEditMode && (
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        handleDeleteWaiver(
                                                            index,
                                                        )
                                                    }
                                                    disabled={
                                                        deletingIndex === index
                                                    }
                                                    className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded text-gray-500 disabled:cursor-not-allowed disabled:opacity-50"
                                                    aria-label="Remove file"
                                                >
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        width="20"
                                                        height="20"
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
                                            )}
                                        </div>
                                    ))}
                                </div>
                                <button
                                    type="button"
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
                                        <path d="M192-396v-72h288v72H192Zm0-150v-72h432v72H192Zm0-150v-72h432v72H192Zm336 504v-113l210-209q7.26-7.41 16.13-10.71Q763-528 771.76-528q9.55 0 18.31 3.5Q798.83-521 806-514l44 45q6.59 7.26 10.29 16.13Q864-444 864-435.24t-3.29 17.92q-3.3 9.15-10.71 16.32L641-192H528Zm288-243-45-45 45 45ZM576-240h45l115-115-22-23-22-22-116 115v45Zm138-138-22-22 44 45-22-23Z" />
                                    </svg>
                                    Add new waiver
                                </button>
                            </div>
                        ) : (
                            <div className="p-4">
                                <h2 className="font-epilogue mb-[24px] text-[18px] font-bold uppercase leading-[18px] tracking-[0.9px] text-[#A2AFC3]">
                                    Client Waivers
                                </h2>
                                <button
                                    type="button"
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
                                        <path d="M192-396v-72h288v72H192Zm0-150v-72h432v72H192Zm0-150v-72h432v72H192Zm336 504v-113l210-209q7.26-7.41 16.13-10.71Q763-528 771.76-528q9.55 0 18.31 3.5Q798.83-521 806-514l44 45q6.59 7.26 10.29 16.13Q864-444 864-435.24t-3.29 17.92q-3.3 9.15-10.71 16.32L641-192H528Zm288-243-45-45 45 45ZM576-240h45l115-115-22-23-22-22-116 115v45Zm138-138-22-22 44 45-22-23Z" />
                                    </svg>
                                    Add new waiver
                                </button>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="mt-[20px] isolate">
                        <WaiverSection
                            formType={formData}
                            updateForm={(form) => updateForm(id, form)}
                            onSubmitEdit={async (data) => {
                                try {
                                    await updateClient(id, data)
                                    clearForm(id)
                                    setEditMode(false)
                                    router.push(`/clients/${id}/waivers`)
                                } catch (err) {
                                    console.error('updateWaivers error:', err)
                                }
                            }}
                            onCancel={() => {
                                clearForm(id)
                                updateForm(id, client)
                                setEditMode(false)
                            }}
                            submitType="save"
                        />
                    </div>
                )}
            </div>
        </div>
    )
}
