'use client'

import { updateClient } from '@/api/make-cases/make-case'
import { ClientIntakeSchema } from '@/types/client-types'
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
    const { getForm, updateForm, clearForm } = useEditFormStore()

    const formData = getForm(id)
    const router = useRouter()

    const toggleButton = () => {
        setEditMode(!editMode)
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
            <div className="mb-[48px] h-screen w-screen min-w-[70%] space-y-[48px]">
                {!editMode ? (
                    <div>
                        {client.waivers && client.waivers.length >= 0 ? (
                            <div className="p-4">
                                <h2 className="font-epilogue mb-[24px] text-[18px] font-bold uppercase leading-[18px] tracking-[0.9px] text-[#A2AFC3]">
                                    Client Waivers
                                </h2>
                                <div className="mb-[24px] space-y-[8px]">
                                    {client.waivers.map((waiver, index) => (
                                        <div key={index} className="mt-2">
                                            <label className="flex h-[36px] flex-row items-center gap-3 self-stretch rounded-lg bg-gray-200 px-3 py-1.5 text-sm text-gray-800">
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    height="24px"
                                                    viewBox="0 -960 960 960"
                                                    width="24px"
                                                    fill="#000000"
                                                >
                                                    <path d="M330-250h300v-60H330v60Zm0-160h300v-60H330v60Zm-77.69 310Q222-100 201-121q-21-21-21-51.31v-615.38Q180-818 201-839q21-21 51.31-21H570l210 210v477.69Q780-142 759-121q-21 21-51.31 21H252.31ZM540-620v-180H252.31q-4.62 0-8.46 3.85-3.85 3.84-3.85 8.46v615.38q0 4.62 3.85 8.46 3.84 3.85 8.46 3.85h455.38q4.62 0 8.46-3.85 3.85-3.84 3.85-8.46V-620H540ZM240-800v180-180V-160v-640Z" />
                                                </svg>{' '}
                                                <a
                                                    href={waiver.uri}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-blue-600 underline"
                                                >
                                                    {waiver.name}
                                                </a>
                                            </label>
                                        </div>
                                    ))}
                                </div>
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
                                        <path d="M192-396v-72h288v72H192Zm0-150v-72h432v72H192Zm0-150v-72h432v72H192Zm336 504v-113l210-209q7.26-7.41 16.13-10.71Q763-528 771.76-528q9.55 0 18.31 3.5Q798.83-521 806-514l44 45q6.59 7.26 10.29 16.13Q864-444 864-435.24t-3.29 17.92q-3.3 9.15-10.71 16.32L641-192H528Zm288-243-45-45 45 45ZM576-240h45l115-115-22-23-22-22-116 115v45Zm138-138-22-22 44 45-22-23Z" />
                                    </svg>
                                    Add new waiver
                                </button>
                            </div>
                        ) : (
                            <div className="p-4">
                                <h2 className="text-xl font-bold">
                                    No Waivers Found
                                </h2>
                                <p>Add a waiver to view them here.</p>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="mt-[20px]">
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
