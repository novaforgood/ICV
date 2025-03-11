'use client'
import { createClient } from '@/api/make-cases/make-case'
import { ClientIntakeSchema } from '@/types/client-types'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { TypeOf } from 'zod'
import { useIntakeFormStore } from '../../../../../../_lib/useIntakeFormStore'

const Page = () => {
    const { form: loadedForm, clearForm } = useIntakeFormStore()
    type ClientType = TypeOf<typeof ClientIntakeSchema>

    const {
        handleSubmit,
        formState: { errors },
    } = useForm<ClientType>({
        mode: 'onChange',
        resolver: zodResolver(ClientIntakeSchema),
        defaultValues: loadedForm,
    })

    const router = useRouter()

    const onSubmit = (data: ClientType) => {
        console.log('in submit...', data)
        createClient(data)
        clearForm()
        router.push('/intake')
    }

    // tracks which sections are open/closed
    const [openSections, setOpenSections] = useState<Record<string, boolean>>(
        {},
    )

    // toggle which sections are visible
    const toggleSection = (section: string) => {
        setOpenSections((prev) => ({
            ...prev,
            [section]: !prev[section], // Toggle the section
        }))
    }

    return (
        <form
            className="space-y-[24px]"
            style={{ padding: '24px' }}
            onSubmit={handleSubmit(onSubmit)}
        >
            <div className="flex items-center justify-center">
                <div className="min-w-[800px] space-y-[40px]">
                    <label className="font-['Epilogue'] text-[40px] font-bold leading-[56px] text-neutral-900">
                        Review
                    </label>
                    {/* all dropdown sections */}
                    {['Client Profile', 'Background', 'Family', 'Services'].map(
                        (section) => (
                            <div key={section}>
                                {/* Dropdown Button */}
                                <button
                                    type="button"
                                    className="flex w-full items-center justify-between border-b pb-2 font-['Epilogue'] text-[40px] font-bold leading-[56px] text-neutral-900"
                                    onClick={() => toggleSection(section)}
                                >
                                    {section}
                                    <span>
                                        {openSections[section] ? '˄' : '˅'}
                                    </span>
                                </button>

                                {/* Content - Shows only if section is open */}
                                {openSections[section] && (
                                    <div className="mt-4 space-y-[60px]">
                                        {section === 'Client Profile' && (
                                            <div className="space-y-[40px]">
                                                <div className="space-y-[24px]">
                                                    <div className="grid grid-cols-2 gap-x-5 gap-y-3">
                                                        {/* First Row: Name & Gender */}
                                                        <div className="flex flex-col space-y-1">
                                                            <label className="font-['Epilogue'] text-[16px] font-bold leading-[18px] text-neutral-900">
                                                                Name
                                                            </label>
                                                            <div>
                                                                {
                                                                    loadedForm.firstName
                                                                }{' '}
                                                                {
                                                                    loadedForm.lastName
                                                                }
                                                            </div>
                                                        </div>
                                                        <div className="flex flex-col space-y-1">
                                                            <label className="font-['Epilogue'] text-[16px] font-bold leading-[18px] text-neutral-900">
                                                                Gender
                                                            </label>
                                                            <div>
                                                                {loadedForm.gender ? (
                                                                    loadedForm.gender
                                                                ) : (
                                                                    <p>
                                                                        No
                                                                        gender
                                                                        provided.
                                                                    </p>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Second Row: DOB & Referral Source */}
                                                    <div className="grid grid-cols-2 gap-x-5 gap-y-3">
                                                        <div className="flex flex-col space-y-1">
                                                            <label className="font-['Epilogue'] text-[16px] font-bold leading-[18px] text-neutral-900">
                                                                Date of Birth
                                                            </label>
                                                            <div>
                                                                {loadedForm.dateOfBirth ? (
                                                                    loadedForm.dateOfBirth
                                                                ) : (
                                                                    <p>
                                                                        No date
                                                                        of birth
                                                                        provided.
                                                                    </p>
                                                                )}
                                                            </div>
                                                        </div>
                                                        <div className="flex flex-col space-y-1">
                                                            <label className="font-['Epilogue'] text-[16px] font-bold leading-[18px] text-neutral-900">
                                                                Referral Source
                                                            </label>
                                                            <div>
                                                                {loadedForm.referralSource ? (
                                                                    loadedForm.referralSource
                                                                ) : (
                                                                    <p>
                                                                        No
                                                                        referral
                                                                        source
                                                                        provided.
                                                                    </p>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="space-y-[24px]">
                                                    <label className="font-epilogue text-[28px] font-semibold leading-[40px] text-[#000]">
                                                        Contact Information
                                                    </label>
                                                    <div className="grid grid-cols-2 gap-x-5 gap-y-3">
                                                        {/* Row: */}
                                                        <div className="flex flex-col space-y-1">
                                                            <label className="font-['Epilogue'] text-[16px] font-bold leading-[18px] text-neutral-900">
                                                                Email Address
                                                            </label>
                                                            <div>
                                                                {loadedForm.email ? (
                                                                    loadedForm.email
                                                                ) : (
                                                                    <p>
                                                                        No email
                                                                        provided.
                                                                    </p>
                                                                )}
                                                            </div>
                                                        </div>
                                                        <div className="flex flex-col space-y-1">
                                                            <label className="font-['Epilogue'] text-[16px] font-bold leading-[18px] text-neutral-900">
                                                                Phone Number
                                                            </label>
                                                            <div>
                                                                {loadedForm.phoneNumber ? (
                                                                    loadedForm.phoneNumber
                                                                ) : (
                                                                    <p>
                                                                        No phone
                                                                        number
                                                                        provided.
                                                                    </p>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="space-y-[24px]">
                                                    <label className="font-epilogue text-[28px] font-semibold leading-[40px] text-[#000]">
                                                        Citizenship
                                                    </label>
                                                    <div className="grid grid-cols-2 gap-x-5 gap-y-3">
                                                        {/* Row: */}
                                                        <div className="flex flex-col space-y-1">
                                                            <label className="font-['Epilogue'] text-[16px] font-bold leading-[18px] text-neutral-900">
                                                                Place of Origin
                                                            </label>
                                                            <div>
                                                                {loadedForm.placeOrigin ? (
                                                                    loadedForm.placeOrigin
                                                                ) : (
                                                                    <p>
                                                                        No place
                                                                        of
                                                                        origin
                                                                        provided.
                                                                    </p>
                                                                )}
                                                            </div>
                                                        </div>
                                                        <div className="flex flex-col space-y-1">
                                                            <label className="font-['Epilogue'] text-[16px] font-bold leading-[18px] text-neutral-900">
                                                                Citizenship
                                                            </label>
                                                            <div>
                                                                {loadedForm.citizenship ? (
                                                                    loadedForm.citizenship
                                                                ) : (
                                                                    <p>
                                                                        No
                                                                        citizenship
                                                                        status
                                                                        provided.
                                                                    </p>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="space-y-[24px]">
                                                    <label className="font-epilogue text-[28px] font-semibold leading-[40px] text-[#000]">
                                                        Housing
                                                    </label>
                                                    <div className="grid grid-cols-2 gap-x-5 gap-y-3">
                                                        {/* Row: */}
                                                        <div className="flex flex-col space-y-1">
                                                            <label className="font-['Epilogue'] text-[16px] font-bold leading-[18px] text-neutral-900">
                                                                Email Address
                                                            </label>
                                                            <div>
                                                                {loadedForm.email ? (
                                                                    loadedForm.email
                                                                ) : (
                                                                    <p>
                                                                        No email
                                                                        provided.
                                                                    </p>
                                                                )}
                                                            </div>
                                                        </div>
                                                        <div className="flex flex-col space-y-1">
                                                            <label className="font-['Epilogue'] text-[16px] font-bold leading-[18px] text-neutral-900">
                                                                Address
                                                            </label>
                                                            <div>
                                                                {loadedForm.streetAddress ? (
                                                                    loadedForm.streetAddress
                                                                ) : (
                                                                    <p>
                                                                        No
                                                                        street
                                                                        Address
                                                                        provided.
                                                                    </p>
                                                                )}{' '}
                                                                {loadedForm.aptNumber &&
                                                                    `Apt. ${loadedForm.aptNumber}`}
                                                            </div>
                                                            <div>
                                                                {loadedForm.city
                                                                    ? loadedForm.city
                                                                    : 'No city provided'}
                                                                , CA
                                                                {loadedForm.zipCode
                                                                    ? `, ${loadedForm.zipCode}`
                                                                    : ''}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="grid grid-cols-2 gap-x-5 gap-y-3">
                                                        {/* Row: */}
                                                        <div className="flex flex-col space-y-1">
                                                            <label className="font-['Epilogue'] text-[16px] font-bold leading-[18px] text-neutral-900">
                                                                Housing
                                                                Situation
                                                            </label>
                                                            <div>
                                                                {loadedForm.housingSituation ? (
                                                                    loadedForm.housingSituation
                                                                ) : (
                                                                    <p>
                                                                        No
                                                                        housing
                                                                        situation
                                                                        provided.
                                                                    </p>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="space-y-[24px]">
                                                    <label className="font-epilogue text-[28px] font-semibold leading-[40px] text-[#000]">
                                                        Background
                                                    </label>
                                                    <div className="space-y-[24px]">
                                                        <div className="grid grid-cols-2 gap-x-5 gap-y-3">
                                                            {/* Row: */}
                                                            <div className="flex flex-col space-y-1">
                                                                <label className="font-['Epilogue'] text-[16px] font-bold leading-[18px] text-neutral-900">
                                                                    Ethnicity
                                                                </label>
                                                                <div>
                                                                    {loadedForm.ethnicity &&
                                                                    loadedForm
                                                                        .ethnicity
                                                                        .length >
                                                                        0 ? (
                                                                        <ul>
                                                                            {loadedForm.ethnicity.map(
                                                                                (
                                                                                    item,
                                                                                    index,
                                                                                ) => (
                                                                                    <li
                                                                                        key={
                                                                                            index
                                                                                        }
                                                                                    >
                                                                                        {
                                                                                            item
                                                                                        }
                                                                                    </li>
                                                                                ),
                                                                            )}
                                                                        </ul>
                                                                    ) : (
                                                                        <p>
                                                                            No
                                                                            ethnicity
                                                                            provided.
                                                                        </p>
                                                                    )}
                                                                </div>
                                                            </div>
                                                            <div className="flex flex-col space-y-1">
                                                                <label className="font-['Epilogue'] text-[16px] font-bold leading-[18px] text-neutral-900">
                                                                    Income
                                                                </label>
                                                                <div>
                                                                    {loadedForm.income ? (
                                                                        `$${loadedForm.income} ${loadedForm.aptNumber ? `Apt. ${loadedForm.aptNumber}` : ''}`
                                                                    ) : (
                                                                        <p>
                                                                            No
                                                                            income
                                                                            provided.
                                                                        </p>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="grid grid-cols-2 gap-x-5 gap-y-3">
                                                            {/* Row: */}
                                                            <div className="flex flex-col space-y-1">
                                                                <label className="font-['Epilogue'] text-[16px] font-bold leading-[18px] text-neutral-900">
                                                                    Employed?
                                                                </label>
                                                                <div>
                                                                    {loadedForm.employed ? (
                                                                        loadedForm.employed
                                                                    ) : (
                                                                        <p>
                                                                            No
                                                                            employment
                                                                            status
                                                                            provided.
                                                                        </p>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {section == 'Family' && (
                                            <label>jdjakfdk</label>
                                        )}
                                        {section == 'Background' && (
                                            <label>jdahfkdha</label>
                                        )}

                                        {section == 'Services' && (
                                            <p>services content.</p>
                                        )}
                                    </div>
                                )}
                            </div>
                        ),
                    )}

                    {/* Buttons */}
                    <div className="flex justify-between pt-4">
                        <button
                            type="button"
                            onClick={() =>
                                router.push(
                                    '/intake/family/background/services',
                                )
                            }
                            className="rounded-[5px] bg-neutral-900 px-4 py-2 text-white"
                        >
                            Back
                        </button>
                        <button
                            type="submit"
                            className="rounded-[5px] bg-neutral-900 px-4 py-2 text-white"
                        >
                            Submit
                        </button>
                    </div>
                </div>
            </div>
        </form>
    )
}

export default Page
