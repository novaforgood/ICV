'use client'

import {
    ClientBio,
    ClientCitizenship,
    ClientContactInfo,
    ClientEthnicity,
    ClientHousing,
} from '@/app/_components/ClientProfileComponents'
import { ClientIntakeSchema } from '@/types/client-types'
import { useEffect, useState } from 'react'
import { TypeOf } from 'zod'
import { useEditFormStore } from '../../_lib/useEditFormStore'
import ProfileSection from '../intakeForm/ProfileComponent'

type ClientType = TypeOf<typeof ClientIntakeSchema>

export const ClientProfileToggle = ({ client }: { client: ClientType }) => {
    const [editMode, setEditMode] = useState(false)
    const { form: loadedForm, updateForm } = useEditFormStore()

    const toggleButton = () => {
        setEditMode(!editMode)
    }

    useEffect(() => {
        updateForm(client)
    }, [client])

    return (
        <div className="flex min-h-screen px-[48px]">
            <div className="mb-[48px] h-screen w-screen min-w-[70%] space-y-[48px]">
                <button onClick={toggleButton}>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        height="24px"
                        viewBox="0 -960 960 960"
                        width="24px"
                        fill="#000000"
                    >
                        <path d="M200-200h57l391-391-57-57-391 391v57Zm-80 80v-170l528-527q12-11 26.5-17t30.5-6q16 0 31 6t26 18l55 56q12 11 17.5 26t5.5 30q0 16-5.5 30.5T817-647L290-120H120Zm640-584-56-56 56 56Zm-141 85-28-29 57 57-29-28Z" />
                    </svg>
                </button>
                {!editMode ? (
                    <>
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
                            <label className="font-epilogue text-[18px] font-bold uppercase leading-[18px] tracking-[0.9px] text-[#A2AFC3]">
                                HOUSING
                            </label>
                            <ClientHousing data={client} />
                        </div>
                    </>
                ) : (
                    <ProfileSection
                        formType={loadedForm}
                        updateForm={updateForm}
                        onSubmitEdit={(data) => {
                            updateForm(data)
                            setEditMode(false)
                        }}
                        submitType="save"
                    />
                )}
            </div>
        </div>
    )
}
