'use client'

import { updateClient } from '@/api/make-cases/make-case'
import {
    ClientBio,
    ClientCitizenship,
    ClientContactInfo,
    ClientEthnicity,
    ClientHousing,
} from '@/app/_components/ClientProfileComponents'
import { ClientIntakeSchema } from '@/types/client-types'
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

    return (
        <div className="flex min-h-screen px-[48px]">
            <div className="mb-[48px] h-screen w-screen min-w-[70%] space-y-[48px]">
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
                            <ClientHousing data={client} />
                        </div>
                    </>
                ) : (
                    <div className="mt-[20px]">
                        <ProfileSection
                            formType={formData}
                            updateForm={(form) => updateForm(id, form)}
                            onSubmitEdit={async (data) => {
                                try {
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
