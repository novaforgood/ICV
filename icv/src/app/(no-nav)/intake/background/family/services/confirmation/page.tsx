'use client'
import Symbol from '@/components/Symbol'
import { clientDb } from '@/data/firebase'
import { useUser } from '@/hooks/useUser'
import { ConfirmationSchema } from '@/types/client-types'
import { zodResolver } from '@hookform/resolvers/zod'
import { collection, getDocs } from 'firebase/firestore'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Dropdown from 'react-dropdown'
import { useForm } from 'react-hook-form'
import { TypeOf } from 'zod'
import { useIntakeFormStore } from '../../../../../../_lib/useIntakeFormStore'

// JIMIN IS TRIPPINGGGGGGGG

//collecting users document from database in string array
const collectRef = collection(clientDb, 'users')
const querySnapshot = await getDocs(collectRef)
const users = querySnapshot.docs.map((doc) => String(doc.data().name))

const Page = () => {
    const { form: loadedForm, updateForm } = useIntakeFormStore()
    type ConfirmType = TypeOf<typeof ConfirmationSchema>

    const {} = useForm<ConfirmType>({
    const [selectedUser, setSelectedUser] = useState<string | undefined>()

    const handleSelect = (selected: string) => {
        setSelectedUser(selected)
        console.log('Selected user:', selected)
        console.log('available users:', users)
    }
    const {
        handleSubmit,
        formState: { errors },
    } = useForm<ConfirmType>({
        mode: 'onChange',
        resolver: zodResolver(ConfirmationSchema),
        defaultValues: loadedForm,
    })

    const router = useRouter()
    const { user } = useUser()

    // wait until after render (in case rendering occurs before user is async loaded)
    useEffect(() => {
        if (user?.displayName) {
            const assessor = user.displayName
            updateForm({ assessingStaff: assessor })
        }
    }, [user])

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
        <form className="space-y-[24px]" style={{ padding: '24px' }}>
            <div className="flex items-center justify-center">
                <div className="min-w-[800px] space-y-[40px]">
                    <label className="block text-center font-['Epilogue'] text-[40px] font-bold leading-[56px] text-neutral-900">
                        Review
                    </label>

                    <div className="space-y-[24px]">
                        <div className="grid grid-cols-2 gap-x-5 gap-y-3">
                            {/* First Row: Name & Gender */}

                            <div className="flex flex-col space-y-1">
                                <label className="font-['Epilogue'] text-[16px] font-bold leading-[18px] text-neutral-900">
                                    Assessing Staff
                                </label>
                                <div>{loadedForm.assessingStaff}</div>
                            </div>

                            <div className="flex flex-col space-y-1">
                                <label className="font-['Epilogue'] text-[16px] font-bold leading-[18px] text-neutral-900">
                                    Case Manager
                                </label>
                                <div className="relative">
                                    <Dropdown
                                        className="w-full border-black"
                                        options={users}
                                        onChange={(option) =>
                                            handleSelect(option.value)
                                        }
                                        placeholder="Select a user"
                                        controlClassName="flex items-center justify-between border border-black-300 rounded-md px-4 py-2 bg-white w-full hover:border-neutral-400"
                                        menuClassName="dropdown-menu absolute w-full mt-5 py-2 px-2 border border-black-500 rounded-md bg-white shadow-lg z-50 max-h-60 overflow-auto hover:border-neutral-400"
                                        placeholderClassName="text-gray-500"
                                        arrowClosed={
                                            <Symbol
                                                symbol="keyboard_arrow_down"
                                                className="text-neutral-900"
                                            />
                                        }
                                        arrowOpen={
                                            <Symbol
                                                symbol="keyboard_arrow_up"
                                                className="text-neutral-900"
                                            />
                                        }
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* all dropdown sections */}
                    {['Client Profile', 'Background', 'Family', 'Services'].map(
                        (section) => (
                            <div key={section}>
                                {/* Dropdown Button */}
                                <button
                                    type="button"
                                    className="flex w-full items-center justify-between border-t-2 border-neutral-500 pb-[24px] pt-[24px] font-['Epilogue'] text-[40px] font-bold leading-[56px] text-neutral-900"
                                    onClick={() => toggleSection(section)}
                                >
                                    {section}
                                    <span>
                                        {openSections[section] ? (
                                            <Symbol symbol="keyboard_arrow_down" />
                                        ) : (
                                            <Symbol symbol="keyboard_arrow_up" />
                                        )}
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
                                                            <div className="flex flex-row space-x-[4px]">
                                                                {loadedForm.firstName && (
                                                                    <p>
                                                                        {
                                                                            loadedForm.firstName
                                                                        }
                                                                    </p>
                                                                )}
                                                                {loadedForm.lastName && (
                                                                    <p>
                                                                        {
                                                                            loadedForm.lastName
                                                                        }
                                                                    </p>
                                                                )}
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
                                                                    <p>N/A</p>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Second Row: DOB & Referral Source */}
                                                    <div className="grid grid-cols-2 gap-x-5 gap-y-3">
                                                        <div className="flex flex-col space-y-1">
                                                            <label className="font-['Epilogue'] text-[16px] font-bold leading-[18px] text-neutral-900">
                                                                DOB
                                                            </label>
                                                            <div>
                                                                {loadedForm.dateOfBirth ? (
                                                                    loadedForm.dateOfBirth
                                                                ) : (
                                                                    <p>
                                                                        None
                                                                        provided.
                                                                    </p>
                                                                )}
                                                            </div>
                                                        </div>
                                                        <div className="flex flex-col space-y-1">
                                                            <label className="font-['Epilogue'] text-[16px] font-bold leading-[18px] text-neutral-900">
                                                                Age
                                                            </label>
                                                            <div>
                                                                {loadedForm.age ? (
                                                                    loadedForm.age
                                                                ) : (
                                                                    <p>N/A</p>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="grid grid-cols-2 gap-x-5 gap-y-3">
                                                        <div className="flex flex-col space-y-1">
                                                            <label className="font-['Epilogue'] text-[16px] font-bold leading-[18px] text-neutral-900">
                                                                Intake Date
                                                            </label>
                                                            <div>
                                                                {
                                                                    loadedForm.intakeDate
                                                                }
                                                            </div>
                                                        </div>
                                                        <div className="flex flex-col space-y-1">
                                                            <label className="font-['Epilogue'] text-[16px] font-bold leading-[18px] text-neutral-900">
                                                                Client Code
                                                            </label>
                                                            <div>
                                                                {
                                                                    loadedForm.clientCode
                                                                }
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="flex flex-col space-y-1">
                                                        <label className="font-['Epilogue'] text-[16px] font-bold leading-[18px] text-neutral-900">
                                                            Contact Source
                                                        </label>
                                                        <div>
                                                            {loadedForm.contactSource ? (
                                                                loadedForm.contactSource
                                                            ) : (
                                                                <p>N/A</p>
                                                            )}
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
                                                                    <p>N/A</p>
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
                                                                    <p>N/A</p>
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
                                                                    <p>N/A</p>
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
                                                                    <p>N/A</p>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="space-y-[24px]">
                                                    <label className="font-epilogue text-[28px] font-semibold leading-[40px] text-[#000]">
                                                        Ethnicity
                                                    </label>
                                                    <div>
                                                        {loadedForm.ethnicity &&
                                                        loadedForm.ethnicity
                                                            .length > 0 ? (
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
                                                            <p>N/A</p>
                                                        )}
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
                                                                Homeless
                                                            </label>
                                                            <div>
                                                                {loadedForm.homeless ? (
                                                                    loadedForm.homeless
                                                                ) : (
                                                                    <p>N/A</p>
                                                                )}
                                                            </div>
                                                        </div>
                                                        <div className="flex flex-col space-y-1">
                                                            <label className="font-['Epilogue'] text-[16px] font-bold leading-[18px] text-neutral-900">
                                                                Sheltered
                                                            </label>
                                                            <div>
                                                                {loadedForm.sheltered ? (
                                                                    loadedForm.sheltered
                                                                ) : (
                                                                    <p>N/A</p>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="grid grid-cols-2 gap-x-5 gap-y-3">
                                                        <div className="flex flex-col space-y-1">
                                                            <label className="font-['Epilogue'] text-[16px] font-bold leading-[18px] text-neutral-900">
                                                                Street
                                                                Address/Point of
                                                                Contact
                                                            </label>
                                                            <div>
                                                                {loadedForm.streetAddress ? (
                                                                    loadedForm.streetAddress
                                                                ) : (
                                                                    <p>N/A</p>
                                                                )}
                                                            </div>
                                                        </div>
                                                        <div className="flex flex-col space-y-1">
                                                            <label className="font-['Epilogue'] text-[16px] font-bold leading-[18px] text-neutral-900">
                                                                Apartment No.
                                                            </label>
                                                            <div>
                                                                {loadedForm.aptNumber ? (
                                                                    loadedForm.aptNumber
                                                                ) : (
                                                                    <p>N/A</p>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="grid grid-cols-2 gap-x-5 gap-y-3">
                                                        {/* Row: */}
                                                        <div className="flex flex-col space-y-1">
                                                            <label className="font-['Epilogue'] text-[16px] font-bold leading-[18px] text-neutral-900">
                                                                City
                                                            </label>
                                                            <div>
                                                                {loadedForm.city ? (
                                                                    loadedForm.city
                                                                ) : (
                                                                    <p>N/A</p>
                                                                )}
                                                            </div>
                                                        </div>
                                                        <div className="flex flex-col space-y-1">
                                                            <label className="font-['Epilogue'] text-[16px] font-bold leading-[18px] text-neutral-900">
                                                                Postal/Zip Code
                                                            </label>
                                                            <div>
                                                                {loadedForm.zipCode ? (
                                                                    loadedForm.zipCode
                                                                ) : (
                                                                    <p>N/A</p>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {section === 'Background' && (
                                            <div className="space-y-[40px]">
                                                <div className="space-y-[24px]">
                                                    <div className="space-y-[24px]">
                                                        <label className="font-epilogue text-[28px] font-semibold leading-[40px] text-[#000]">
                                                            Education
                                                        </label>
                                                        <div className="flex flex-col space-y-1">
                                                            <div>
                                                                {loadedForm.educationStatus &&
                                                                loadedForm
                                                                    .educationStatus
                                                                    .length >
                                                                    0 ? (
                                                                    <ul>
                                                                        {loadedForm.educationStatus.map(
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
                                                                    <p>N/A</p>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="space-y-[24px]">
                                                    <label className="font-epilogue text-[28px] font-semibold leading-[40px] text-[#000]">
                                                        Income
                                                    </label>
                                                    <div className="grid grid-cols-2 gap-x-5 gap-y-3">
                                                        {/* Row: */}
                                                        <div className="flex flex-col space-y-1">
                                                            <label className="font-['Epilogue'] text-[16px] font-bold leading-[18px] text-neutral-900">
                                                                Employment
                                                            </label>
                                                            <div>
                                                                {loadedForm.employment ? (
                                                                    loadedForm.employment
                                                                ) : (
                                                                    <p>N/A</p>
                                                                )}
                                                            </div>
                                                        </div>
                                                        <div className="flex flex-col space-y-1">
                                                            <label className="font-['Epilogue'] text-[16px] font-bold leading-[18px] text-neutral-900">
                                                                Income
                                                            </label>
                                                            <div>
                                                                {loadedForm.employmentIncome ? (
                                                                    <span>
                                                                        $
                                                                        {
                                                                            loadedForm.employmentIncome
                                                                        }
                                                                    </span>
                                                                ) : (
                                                                    <p>N/A</p>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="space-y-1">
                                                        <div className="grid grid-cols-2 gap-x-5 gap-y-3">
                                                            {/* Row: */}
                                                            <div className="flex flex-col space-y-1">
                                                                <label className="font-['Epilogue'] text-[16px] font-bold leading-[18px] text-neutral-900">
                                                                    Public
                                                                    Services
                                                                </label>
                                                            </div>
                                                            <div className="flex flex-col space-y-1">
                                                                <label className="font-['Epilogue'] text-[16px] font-bold leading-[18px] text-neutral-900">
                                                                    Aid
                                                                </label>
                                                            </div>
                                                        </div>
                                                        {loadedForm.generalRelief ==
                                                            'Recipient' && (
                                                            <div className="grid grid-cols-2 gap-x-5 gap-y-3">
                                                                <div className="flex flex-col space-y-1">
                                                                    <label className="font-['Epilogue'] text-[16px] leading-[18px] text-neutral-900">
                                                                        General
                                                                        Relief
                                                                    </label>
                                                                </div>
                                                                <div className="flex flex-col space-y-1">
                                                                    <label className="font-['Epilogue'] text-[16px] leading-[18px] text-neutral-900">
                                                                        $
                                                                        {loadedForm.generalReliefAid ==
                                                                        ''
                                                                            ? 0
                                                                            : loadedForm.generalReliefAid}
                                                                    </label>
                                                                </div>
                                                            </div>
                                                        )}
                                                        {loadedForm.calFresh ==
                                                            'Recipient' && (
                                                            <div className="grid grid-cols-2 gap-x-5 gap-y-3">
                                                                <div className="flex flex-col space-y-1">
                                                                    <label className="font-['Epilogue'] text-[16px] leading-[18px] text-neutral-900">
                                                                        CalFresh
                                                                        (Food
                                                                        Stamps/EBT)
                                                                    </label>
                                                                </div>
                                                                <div className="flex flex-col space-y-1">
                                                                    <label className="font-['Epilogue'] text-[16px] leading-[18px] text-neutral-900">
                                                                        $
                                                                        {loadedForm.calFreshAid ==
                                                                        ''
                                                                            ? 0
                                                                            : loadedForm.calFreshAid}
                                                                    </label>
                                                                </div>
                                                            </div>
                                                        )}
                                                        {loadedForm.calWorks ==
                                                            'Recipient' && (
                                                            <div className="grid grid-cols-2 gap-x-5 gap-y-3">
                                                                <div className="flex flex-col space-y-1">
                                                                    <label className="font-['Epilogue'] text-[16px] leading-[18px] text-neutral-900">
                                                                        CalWorks
                                                                        (Cash
                                                                        Aid)
                                                                    </label>
                                                                </div>
                                                                <div className="flex flex-col space-y-1">
                                                                    <label className="font-['Epilogue'] text-[16px] leading-[18px] text-neutral-900">
                                                                        $
                                                                        {loadedForm.calWorksAid ==
                                                                        ''
                                                                            ? 0
                                                                            : loadedForm.calWorksAid}
                                                                    </label>
                                                                </div>
                                                            </div>
                                                        )}
                                                        {loadedForm.ssi ==
                                                            'Recipient' && (
                                                            <div className="grid grid-cols-2 gap-x-5 gap-y-3">
                                                                <div className="flex flex-col space-y-1">
                                                                    <label className="font-['Epilogue'] text-[16px] leading-[18px] text-neutral-900">
                                                                        SSI
                                                                    </label>
                                                                </div>
                                                                <div className="flex flex-col space-y-1">
                                                                    <label className="font-['Epilogue'] text-[16px] leading-[18px] text-neutral-900">
                                                                        $
                                                                        {loadedForm.ssiAid ==
                                                                        ''
                                                                            ? 0
                                                                            : loadedForm.ssiAid}
                                                                    </label>
                                                                </div>
                                                            </div>
                                                        )}
                                                        {loadedForm.ssa ==
                                                            'Recipient' && (
                                                            <div className="grid grid-cols-2 gap-x-5 gap-y-3">
                                                                <div className="flex flex-col space-y-1">
                                                                    <label className="font-['Epilogue'] text-[16px] leading-[18px] text-neutral-900">
                                                                        SSA
                                                                    </label>
                                                                </div>
                                                                <div className="flex flex-col space-y-1">
                                                                    <label className="font-['Epilogue'] text-[16px] leading-[18px] text-neutral-900">
                                                                        $
                                                                        {loadedForm.ssaAid ==
                                                                        ''
                                                                            ? 0
                                                                            : loadedForm.ssaAid}
                                                                    </label>
                                                                </div>
                                                            </div>
                                                        )}
                                                        {loadedForm.unemployment ==
                                                            'Recipient' && (
                                                            <div className="grid grid-cols-2 gap-x-5 gap-y-3">
                                                                <div className="flex flex-col space-y-1">
                                                                    <label className="font-['Epilogue'] text-[16px] leading-[18px] text-neutral-900">
                                                                        Unemployment
                                                                    </label>
                                                                </div>
                                                                <div className="flex flex-col space-y-1">
                                                                    <label className="font-['Epilogue'] text-[16px] leading-[18px] text-neutral-900">
                                                                        $
                                                                        {loadedForm.unemploymentAid ==
                                                                        ''
                                                                            ? 0
                                                                            : loadedForm.unemploymentAid}
                                                                    </label>
                                                                </div>
                                                            </div>
                                                        )}
                                                        {loadedForm.otherService ==
                                                            'Recipient' && (
                                                            <div className="grid grid-cols-2 gap-x-5 gap-y-3">
                                                                <div className="flex flex-col space-y-1">
                                                                    <label className="font-['Epilogue'] text-[16px] leading-[18px] text-neutral-900">
                                                                        Other
                                                                    </label>
                                                                </div>
                                                                <div className="flex flex-col space-y-1">
                                                                    <label className="font-['Epilogue'] text-[16px] leading-[18px] text-neutral-900">
                                                                        $
                                                                        {loadedForm.otherServiceAid ==
                                                                        ''
                                                                            ? 0
                                                                            : loadedForm.otherServiceAid}
                                                                    </label>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="grid grid-cols-2 gap-x-5 gap-y-3">
                                                        {/* Row: */}
                                                        <div className="flex flex-col space-y-1">
                                                            <label className="font-['Epilogue'] text-[16px] font-bold leading-[18px] text-neutral-900">
                                                                Total Income
                                                            </label>
                                                        </div>
                                                        <div className="flex flex-col space-y-1">
                                                            <label className="font-['Epilogue'] text-[16px] leading-[18px] text-neutral-900">
                                                                $
                                                                {loadedForm.totalIncome ==
                                                                ''
                                                                    ? 'N/A'
                                                                    : loadedForm.totalIncome}
                                                            </label>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="space-y-[24px]">
                                                    <label className="font-epilogue text-[28px] font-semibold leading-[40px] text-[#000]">
                                                        History
                                                    </label>
                                                    <div className="space-y-1">
                                                        {loadedForm.mentalHealthConditions && (
                                                            <div className="grid grid-cols-2 gap-x-5 gap-y-3">
                                                                {/* Row: */}
                                                                <div className="flex flex-col space-y-1">
                                                                    <label className="font-['Epilogue'] text-[16px] leading-[18px] text-neutral-900">
                                                                        Mental
                                                                        health
                                                                        conditions
                                                                    </label>
                                                                </div>
                                                                <div className="flex flex-col space-y-1">
                                                                    <label className="font-['Epilogue'] text-[16px] leading-[18px] text-neutral-900">
                                                                        {
                                                                            loadedForm.mentalHealthConditions
                                                                        }
                                                                    </label>
                                                                </div>
                                                            </div>
                                                        )}
                                                        {loadedForm.medicalConditions && (
                                                            <div className="grid grid-cols-2 gap-x-5 gap-y-3">
                                                                {/* Row: */}
                                                                <div className="flex flex-col space-y-1">
                                                                    <label className="font-['Epilogue'] text-[16px] leading-[18px] text-neutral-900">
                                                                        Medical
                                                                        conditions
                                                                    </label>
                                                                </div>
                                                                <div className="flex flex-col space-y-1">
                                                                    <label className="font-['Epilogue'] text-[16px] leading-[18px] text-neutral-900">
                                                                        {
                                                                            loadedForm.medicalConditions
                                                                        }
                                                                    </label>
                                                                </div>
                                                            </div>
                                                        )}
                                                        {loadedForm.substanceAbuse && (
                                                            <div className="grid grid-cols-2 gap-x-5 gap-y-3">
                                                                {/* Row: */}
                                                                <div className="flex flex-col space-y-1">
                                                                    <label className="font-['Epilogue'] text-[16px] leading-[18px] text-neutral-900">
                                                                        Substance
                                                                        abuse
                                                                    </label>
                                                                </div>
                                                                <div className="flex flex-col space-y-1">
                                                                    <label className="font-['Epilogue'] text-[16px] leading-[18px] text-neutral-900">
                                                                        {
                                                                            loadedForm.substanceAbuse
                                                                        }
                                                                    </label>
                                                                </div>
                                                            </div>
                                                        )}
                                                        {loadedForm.fosterYouth && (
                                                            <div className="grid grid-cols-2 gap-x-5 gap-y-3">
                                                                {/* Row: */}
                                                                <div className="flex flex-col space-y-1">
                                                                    <label className="font-['Epilogue'] text-[16px] leading-[18px] text-neutral-900">
                                                                        Foster
                                                                        youth
                                                                    </label>
                                                                </div>
                                                                <div className="flex flex-col space-y-1">
                                                                    <label className="font-['Epilogue'] text-[16px] leading-[18px] text-neutral-900">
                                                                        {
                                                                            loadedForm.fosterYouth
                                                                        }
                                                                    </label>
                                                                </div>
                                                            </div>
                                                        )}
                                                        {loadedForm.openProbation && (
                                                            <div className="grid grid-cols-2 gap-x-5 gap-y-3">
                                                                {/* Row: */}
                                                                <div className="flex flex-col space-y-1">
                                                                    <label className="font-['Epilogue'] text-[16px] leading-[18px] text-neutral-900">
                                                                        Open
                                                                        probation
                                                                        case
                                                                    </label>
                                                                </div>
                                                                <div className="flex flex-col space-y-1">
                                                                    <label className="font-['Epilogue'] text-[16px] leading-[18px] text-neutral-900">
                                                                        {
                                                                            loadedForm.openProbation
                                                                        }
                                                                    </label>
                                                                </div>
                                                            </div>
                                                        )}
                                                        {loadedForm.openCPS && (
                                                            <div className="grid grid-cols-2 gap-x-5 gap-y-3">
                                                                {/* Row: */}
                                                                <div className="flex flex-col space-y-1">
                                                                    <label className="font-['Epilogue'] text-[16px] leading-[18px] text-neutral-900">
                                                                        Open CPS
                                                                        case
                                                                    </label>
                                                                </div>
                                                                <div className="flex flex-col space-y-1">
                                                                    <label className="font-['Epilogue'] text-[16px] leading-[18px] text-neutral-900">
                                                                        {
                                                                            loadedForm.openCPS
                                                                        }
                                                                    </label>
                                                                </div>
                                                            </div>
                                                        )}
                                                        {loadedForm.sexOffender && (
                                                            <div className="grid grid-cols-2 gap-x-5 gap-y-3">
                                                                {/* Row: */}
                                                                <div className="flex flex-col space-y-1">
                                                                    <label className="font-['Epilogue'] text-[16px] leading-[18px] text-neutral-900">
                                                                        Sex
                                                                        offender
                                                                    </label>
                                                                </div>
                                                                <div className="flex flex-col space-y-1">
                                                                    <label className="font-['Epilogue'] text-[16px] leading-[18px] text-neutral-900">
                                                                        {
                                                                            loadedForm.sexOffender
                                                                        }
                                                                    </label>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {section == 'Family' && (
                                            <div className="space-y-[40px]">
                                                <div className="space-y-[24px]">
                                                    <label className="font-epilogue text-[28px] font-semibold leading-[40px] text-[#000]">
                                                        Spouse
                                                    </label>
                                                    <div className="grid grid-cols-2 gap-x-5 gap-y-3">
                                                        {/* ROW */}
                                                        <div className="flex flex-col space-y-1">
                                                            <label className="font-['Epilogue'] text-[16px] font-bold leading-[18px] text-neutral-900">
                                                                Marital Status
                                                            </label>
                                                            <div>
                                                                {loadedForm.maritalStatus ? (
                                                                    loadedForm.maritalStatus
                                                                ) : (
                                                                    <p>N/A</p>
                                                                )}
                                                            </div>
                                                        </div>
                                                        {/* ROW */}
                                                        <div className="flex flex-col space-y-1">
                                                            <label className="font-['Epilogue'] text-[16px] font-bold leading-[18px] text-neutral-900">
                                                                If married, is
                                                                spouse an ICV
                                                                client?
                                                            </label>
                                                            <div>
                                                                {loadedForm.spouseClientStatus ? (
                                                                    loadedForm.spouseClientStatus
                                                                ) : (
                                                                    <p>N/A</p>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {loadedForm.spouse && (
                                                        <div className="relative mt-4 space-y-[24px] rounded-[10px] border-[1px] border-solid border-[#DBD8E4] p-[24px]">
                                                            {/* Name + Gender Row */}
                                                            <div className="grid grid-cols-2 gap-x-5 gap-y-3">
                                                                <div className="flex flex-col space-y-1">
                                                                    <label className="font-['Epilogue'] text-[16px] font-bold text-neutral-900">
                                                                        Name
                                                                    </label>
                                                                    <div className="flex flex-row space-x-[4px]">
                                                                        {loadedForm
                                                                            .spouse
                                                                            .spouseFirstName && (
                                                                            <p>
                                                                                {
                                                                                    loadedForm
                                                                                        .spouse
                                                                                        .spouseFirstName
                                                                                }
                                                                            </p>
                                                                        )}
                                                                        {loadedForm
                                                                            .spouse
                                                                            .spouseLastName && (
                                                                            <p>
                                                                                {
                                                                                    loadedForm
                                                                                        .spouse
                                                                                        .spouseLastName
                                                                                }
                                                                            </p>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                                <div className="flex flex-col space-y-1">
                                                                    <label className="font-['Epilogue'] text-[16px] font-bold text-neutral-900">
                                                                        Gender
                                                                    </label>
                                                                    <div>
                                                                        {loadedForm
                                                                            .spouse
                                                                            .spouseGender ? (
                                                                            <p>
                                                                                {
                                                                                    loadedForm
                                                                                        .spouse
                                                                                        .spouseGender
                                                                                }
                                                                            </p>
                                                                        ) : (
                                                                            <p>
                                                                                N/A
                                                                            </p>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            {/* DOB + Age Row */}
                                                            <div className="grid grid-cols-2 gap-x-5">
                                                                <div className="flex flex-col space-y-1">
                                                                    <label className="font-['Epilogue'] text-[16px] font-bold text-neutral-900">
                                                                        DOB
                                                                    </label>
                                                                    <div>
                                                                        {loadedForm
                                                                            .spouse
                                                                            .spouseDOB ? (
                                                                            <p>
                                                                                {
                                                                                    loadedForm
                                                                                        .spouse
                                                                                        .spouseDOB
                                                                                }
                                                                            </p>
                                                                        ) : (
                                                                            <p>
                                                                                N/A
                                                                            </p>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                                <div className="flex flex-col space-y-1">
                                                                    <label className="font-['Epilogue'] text-[16px] font-bold text-neutral-900">
                                                                        Age
                                                                    </label>
                                                                    <div>
                                                                        {loadedForm
                                                                            .spouse
                                                                            .spouseAge ? (
                                                                            <p>
                                                                                {
                                                                                    loadedForm
                                                                                        .spouse
                                                                                        .spouseAge
                                                                                }
                                                                            </p>
                                                                        ) : (
                                                                            <p>
                                                                                N/A
                                                                            </p>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            {/* Income Row */}
                                                            <div className="flex flex-col space-y-1">
                                                                <label className="font-['Epilogue'] text-[16px] font-bold text-neutral-900">
                                                                    Income
                                                                </label>
                                                                <div>
                                                                    {loadedForm
                                                                        .spouse
                                                                        .spouseIncome ? (
                                                                        <p>
                                                                            {
                                                                                '$'
                                                                            }
                                                                            {
                                                                                loadedForm
                                                                                    .spouse
                                                                                    .spouseIncome
                                                                            }
                                                                        </p>
                                                                    ) : (
                                                                        <p>
                                                                            N/A
                                                                        </p>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>

                                                <div className="space-y-[24px]">
                                                    <label className="font-epilogue text-[28px] font-semibold leading-[40px] text-[#000]">
                                                        Dependents
                                                    </label>
                                                    <div className="grid grid-cols-2 gap-x-5">
                                                        <div className="flex flex-col space-y-1">
                                                            <label className="font-['Epilogue'] text-[16px] font-bold text-neutral-900">
                                                                Head of
                                                                Household?
                                                            </label>
                                                            <div>
                                                                {loadedForm.headOfHousehold ? (
                                                                    loadedForm.headOfHousehold
                                                                ) : (
                                                                    <p>N/A</p>
                                                                )}
                                                            </div>
                                                        </div>
                                                        <div className="flex flex-col space-y-1">
                                                            <label className="font-['Epilogue'] text-[16px] font-bold text-neutral-900">
                                                                Family Size
                                                            </label>
                                                            <div>
                                                                {loadedForm.familySize ? (
                                                                    loadedForm.familySize
                                                                ) : (
                                                                    <p>N/A</p>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    {loadedForm.dependent &&
                                                        loadedForm.dependent
                                                            .length > 0 &&
                                                        loadedForm.dependent.map(
                                                            (child, index) => (
                                                                <div
                                                                    key={index}
                                                                    className="relative mt-4 space-y-[24px] rounded-[10px] border-[1px] border-solid border-[#DBD8E4] p-[24px]"
                                                                >
                                                                    <label className="font-epilogue text-[22px] font-medium leading-[24px] text-[#1A1D20]">
                                                                        Dependent{' '}
                                                                        {index +
                                                                            1}
                                                                        :
                                                                    </label>
                                                                    <div className="grid grid-cols-2 gap-x-5 gap-y-3">
                                                                        {/* ROW */}
                                                                        <div className="flex flex-col space-y-1">
                                                                            <label className="font-['Epilogue'] text-[16px] font-bold leading-[18px] text-neutral-900">
                                                                                Name
                                                                            </label>
                                                                            <div className="flex flex-row space-x-[4px]">
                                                                                {child.firstName && (
                                                                                    <p>
                                                                                        {
                                                                                            child.firstName
                                                                                        }
                                                                                    </p>
                                                                                )}
                                                                                {child.lastName && (
                                                                                    <p>
                                                                                        {
                                                                                            child.lastName
                                                                                        }
                                                                                    </p>
                                                                                )}
                                                                            </div>
                                                                        </div>
                                                                        <div className="flex flex-col space-y-1">
                                                                            <label className="font-['Epilogue'] text-[16px] font-bold leading-[18px] text-neutral-900">
                                                                                Gender
                                                                            </label>
                                                                            <div>
                                                                                {child.gender ? (
                                                                                    child.gender
                                                                                ) : (
                                                                                    <p>
                                                                                        N/A
                                                                                    </p>
                                                                                )}
                                                                            </div>
                                                                        </div>
                                                                    </div>

                                                                    {/* Second Row: DOB & Income */}
                                                                    <div className="grid grid-cols-2 gap-x-5 gap-y-3">
                                                                        <div className="flex flex-col space-y-1">
                                                                            <label className="font-['Epilogue'] text-[16px] font-bold leading-[18px] text-neutral-900">
                                                                                DOB
                                                                            </label>
                                                                            <div>
                                                                                {child.dob ? (
                                                                                    child.dob
                                                                                ) : (
                                                                                    <p>
                                                                                        N/A
                                                                                    </p>
                                                                                )}
                                                                            </div>
                                                                        </div>
                                                                        <div className="flex flex-col space-y-1">
                                                                            <label className="font-['Epilogue'] text-[16px] font-bold leading-[18px] text-neutral-900">
                                                                                Age
                                                                            </label>
                                                                            <div>
                                                                                {child.age ? (
                                                                                    child.age
                                                                                ) : (
                                                                                    <p>
                                                                                        N/A
                                                                                    </p>
                                                                                )}
                                                                            </div>
                                                                        </div>
                                                                    </div>

                                                                    {/* Third Row: Income */}
                                                                    <div className="grid grid-cols-2 gap-x-5 gap-y-3">
                                                                        <div className="flex flex-col space-y-1">
                                                                            <label className="font-['Epilogue'] text-[16px] font-bold leading-[18px] text-neutral-900">
                                                                                Income
                                                                            </label>
                                                                        </div>
                                                                        <div className="flex flex-col space-y-1">
                                                                            <div>
                                                                                {child.income ? (
                                                                                    child.income
                                                                                ) : (
                                                                                    <p>
                                                                                        N/A
                                                                                    </p>
                                                                                )}
                                                                            </div>
                                                                        </div>
                                                                    </div>

                                                                    {/* Public Services */}
                                                                    <div className="space-y-1">
                                                                        <div className="grid grid-cols-2 gap-x-5 gap-y-3">
                                                                            {/* Row: */}
                                                                            <div className="flex flex-col space-y-1">
                                                                                <label className="font-['Epilogue'] text-[16px] font-bold leading-[18px] text-neutral-900">
                                                                                    Public
                                                                                    Services
                                                                                </label>
                                                                            </div>
                                                                            <div className="flex flex-col space-y-1">
                                                                                <label className="font-['Epilogue'] text-[16px] font-bold leading-[18px] text-neutral-900">
                                                                                    Aid
                                                                                </label>
                                                                            </div>
                                                                        </div>
                                                                        {child.generalRelief ==
                                                                            'Recipient' && (
                                                                            <div className="grid grid-cols-2 gap-x-5 gap-y-3">
                                                                                <div className="flex flex-col space-y-1">
                                                                                    <label className="font-['Epilogue'] text-[16px] leading-[18px] text-neutral-900">
                                                                                        General
                                                                                        Relief
                                                                                    </label>
                                                                                </div>
                                                                                <div className="flex flex-col space-y-1">
                                                                                    <label className="font-['Epilogue'] text-[16px] leading-[18px] text-neutral-900">
                                                                                        $
                                                                                        {child.generalReliefAid ==
                                                                                        ''
                                                                                            ? 0
                                                                                            : child.generalReliefAid}
                                                                                    </label>
                                                                                </div>
                                                                            </div>
                                                                        )}
                                                                        {child.calFresh ==
                                                                            'Recipient' && (
                                                                            <div className="grid grid-cols-2 gap-x-5 gap-y-3">
                                                                                <div className="flex flex-col space-y-1">
                                                                                    <label className="font-['Epilogue'] text-[16px] leading-[18px] text-neutral-900">
                                                                                        CalFresh
                                                                                        (Food
                                                                                        Stamps/EBT)
                                                                                    </label>
                                                                                </div>
                                                                                <div className="flex flex-col space-y-1">
                                                                                    <label className="font-['Epilogue'] text-[16px] leading-[18px] text-neutral-900">
                                                                                        $
                                                                                        {child.calFreshAid ==
                                                                                        ''
                                                                                            ? 0
                                                                                            : child.calFreshAid}
                                                                                    </label>
                                                                                </div>
                                                                            </div>
                                                                        )}
                                                                        {child.calWorks ==
                                                                            'Recipient' && (
                                                                            <div className="grid grid-cols-2 gap-x-5 gap-y-3">
                                                                                <div className="flex flex-col space-y-1">
                                                                                    <label className="font-['Epilogue'] text-[16px] leading-[18px] text-neutral-900">
                                                                                        CalWorks
                                                                                        (Cash
                                                                                        Aid)
                                                                                    </label>
                                                                                </div>
                                                                                <div className="flex flex-col space-y-1">
                                                                                    <label className="font-['Epilogue'] text-[16px] leading-[18px] text-neutral-900">
                                                                                        $
                                                                                        {child.calWorksAid ==
                                                                                        ''
                                                                                            ? 0
                                                                                            : child.calWorksAid}
                                                                                    </label>
                                                                                </div>
                                                                            </div>
                                                                        )}
                                                                        {child.ssi ==
                                                                            'Recipient' && (
                                                                            <div className="grid grid-cols-2 gap-x-5 gap-y-3">
                                                                                <div className="flex flex-col space-y-1">
                                                                                    <label className="font-['Epilogue'] text-[16px] leading-[18px] text-neutral-900">
                                                                                        SSI
                                                                                    </label>
                                                                                </div>
                                                                                <div className="flex flex-col space-y-1">
                                                                                    <label className="font-['Epilogue'] text-[16px] leading-[18px] text-neutral-900">
                                                                                        $
                                                                                        {child.ssiAid ==
                                                                                        ''
                                                                                            ? 0
                                                                                            : child.ssiAid}
                                                                                    </label>
                                                                                </div>
                                                                            </div>
                                                                        )}
                                                                        {child.ssa ==
                                                                            'Recipient' && (
                                                                            <div className="grid grid-cols-2 gap-x-5 gap-y-3">
                                                                                <div className="flex flex-col space-y-1">
                                                                                    <label className="font-['Epilogue'] text-[16px] leading-[18px] text-neutral-900">
                                                                                        SSA
                                                                                    </label>
                                                                                </div>
                                                                                <div className="flex flex-col space-y-1">
                                                                                    <label className="font-['Epilogue'] text-[16px] leading-[18px] text-neutral-900">
                                                                                        $
                                                                                        {child.ssaAid ==
                                                                                        ''
                                                                                            ? 0
                                                                                            : child.ssaAid}
                                                                                    </label>
                                                                                </div>
                                                                            </div>
                                                                        )}
                                                                        {child.unemployment ==
                                                                            'Recipient' && (
                                                                            <div className="grid grid-cols-2 gap-x-5 gap-y-3">
                                                                                <div className="flex flex-col space-y-1">
                                                                                    <label className="font-['Epilogue'] text-[16px] leading-[18px] text-neutral-900">
                                                                                        Unemployment
                                                                                    </label>
                                                                                </div>
                                                                                <div className="flex flex-col space-y-1">
                                                                                    <label className="font-['Epilogue'] text-[16px] leading-[18px] text-neutral-900">
                                                                                        $
                                                                                        {child.unemploymentAid ==
                                                                                        ''
                                                                                            ? 0
                                                                                            : child.unemploymentAid}
                                                                                    </label>
                                                                                </div>
                                                                            </div>
                                                                        )}
                                                                        {child.otherService ==
                                                                            'Recipient' && (
                                                                            <div className="grid grid-cols-2 gap-x-5 gap-y-3">
                                                                                <div className="flex flex-col space-y-1">
                                                                                    <label className="font-['Epilogue'] text-[16px] leading-[18px] text-neutral-900">
                                                                                        Other
                                                                                    </label>
                                                                                </div>
                                                                                <div className="flex flex-col space-y-1">
                                                                                    <label className="font-['Epilogue'] text-[16px] leading-[18px] text-neutral-900">
                                                                                        $
                                                                                        {child.otherServiceAid ==
                                                                                        ''
                                                                                            ? 0
                                                                                            : child.otherServiceAid}
                                                                                    </label>
                                                                                </div>
                                                                            </div>
                                                                        )}
                                                                    </div>

                                                                    {/* Fifth Row: Total Income */}
                                                                    <div className="grid grid-cols-2 gap-x-5 gap-y-3">
                                                                        <div className="flex flex-col space-y-1">
                                                                            <label className="font-['Epilogue'] text-[16px] font-bold leading-[18px] text-neutral-900">
                                                                                Total
                                                                                Income
                                                                            </label>
                                                                        </div>
                                                                        <div className="flex flex-col space-y-1">
                                                                            <div>
                                                                                <label className="font-['Epilogue'] text-[16px] leading-[18px] text-neutral-900">
                                                                                    $
                                                                                    {child.totalIncome ==
                                                                                    ''
                                                                                        ? 'N/A'
                                                                                        : child.totalIncome}
                                                                                </label>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            ),
                                                        )}
                                                </div>

                                                <div className="space-y-[24px]">
                                                    <label className="font-epilogue text-[28px] font-semibold leading-[40px] text-[#000]">
                                                        Pets
                                                    </label>
                                                    {loadedForm.pets?.length ? ( // Optional chaining used here
                                                        loadedForm.pets.map(
                                                            (pet, index) => (
                                                                <div
                                                                    key={index}
                                                                    className="relative mt-4 space-y-[24px] rounded-[10px] border-[1px] border-solid border-[#DBD8E4] p-[24px]"
                                                                >
                                                                    <label className="font-epilogue text-[22px] font-medium leading-[24px] text-[#1A1D20]">
                                                                        Pet{' '}
                                                                        {index +
                                                                            1}
                                                                        :
                                                                    </label>
                                                                    <div className="grid grid-cols-2 gap-x-5 gap-y-3">
                                                                        {/* First Row: Name & Gender */}
                                                                        <div className="flex flex-col space-y-1">
                                                                            <label className="font-['Epilogue'] text-[16px] font-bold leading-[18px] text-neutral-900">
                                                                                Species
                                                                            </label>
                                                                            <div>
                                                                                {pet.species || (
                                                                                    <p>
                                                                                        N/A
                                                                                    </p>
                                                                                )}
                                                                            </div>
                                                                        </div>
                                                                        <div className="flex flex-col space-y-1">
                                                                            <label className="font-['Epilogue'] text-[16px] font-bold leading-[18px] text-neutral-900">
                                                                                Size
                                                                            </label>
                                                                            <div>
                                                                                {pet.size || (
                                                                                    <p>
                                                                                        N/A
                                                                                    </p>
                                                                                )}
                                                                            </div>
                                                                        </div>
                                                                    </div>

                                                                    {/* Second Row: Purpose */}
                                                                    <div className="space-y-[4px]">
                                                                        <label className="font-['Epilogue'] text-[16px] font-bold leading-[18px] text-neutral-900">
                                                                            Purpose
                                                                        </label>
                                                                        <div>
                                                                            {pet
                                                                                .purpose
                                                                                ?.length ? ( // Optional chaining used here
                                                                                pet.purpose.map(
                                                                                    (
                                                                                        purpose,
                                                                                        index,
                                                                                    ) => (
                                                                                        <div
                                                                                            key={
                                                                                                index
                                                                                            }
                                                                                            className="space-y-4"
                                                                                        >
                                                                                            <label>
                                                                                                {
                                                                                                    purpose
                                                                                                }
                                                                                            </label>
                                                                                        </div>
                                                                                    ),
                                                                                )
                                                                            ) : (
                                                                                <p>
                                                                                    N/A
                                                                                </p>
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            ),
                                                        )
                                                    ) : (
                                                        <p>N/A</p>
                                                    )}
                                                </div>
                                            </div>
                                        )}

                                        {section == 'Services' && (
                                            <div className="space-y-[40px]">
                                                <div className="space-y-[24px]">
                                                    <div className="grid grid-cols-2 gap-[12px]">
                                                        <div>
                                                            <label className="font-['Epilogue'] text-[16px] font-bold leading-[18px] text-neutral-900">
                                                                Mentoring
                                                            </label>
                                                            {loadedForm
                                                                .mentoring
                                                                ?.length ? ( // Optional chaining used here
                                                                loadedForm.mentoring.map(
                                                                    (
                                                                        mentor,
                                                                        index,
                                                                    ) => (
                                                                        <div
                                                                            key={
                                                                                index
                                                                            }
                                                                            className="space-y-4"
                                                                        >
                                                                            <label>
                                                                                {
                                                                                    mentor
                                                                                }
                                                                            </label>
                                                                        </div>
                                                                    ),
                                                                )
                                                            ) : (
                                                                <p>N/A</p>
                                                            )}
                                                        </div>
                                                        <div>
                                                            <label className="font-['Epilogue'] text-[16px] font-bold leading-[18px] text-neutral-900">
                                                                Personal
                                                                Development
                                                            </label>
                                                            {loadedForm
                                                                .personalDev
                                                                ?.length ? ( // Optional chaining used here
                                                                loadedForm.personalDev.map(
                                                                    (
                                                                        dev,
                                                                        index,
                                                                    ) => (
                                                                        <div
                                                                            key={
                                                                                index
                                                                            }
                                                                            className="space-y-4"
                                                                        >
                                                                            <label>
                                                                                {
                                                                                    dev
                                                                                }
                                                                            </label>
                                                                        </div>
                                                                    ),
                                                                )
                                                            ) : (
                                                                <p>N/A</p>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <div className="grid grid-cols-2 gap-[12px]">
                                                        <div>
                                                            <label className="font-['Epilogue'] text-[16px] font-bold leading-[18px] text-neutral-900">
                                                                Housing
                                                                Assistance
                                                            </label>
                                                            {loadedForm.housing
                                                                ?.length ? ( // Optional chaining used here
                                                                loadedForm.housing.map(
                                                                    (
                                                                        house,
                                                                        index,
                                                                    ) => (
                                                                        <div
                                                                            key={
                                                                                index
                                                                            }
                                                                            className="space-y-4"
                                                                        >
                                                                            <label>
                                                                                {
                                                                                    house
                                                                                }
                                                                            </label>
                                                                        </div>
                                                                    ),
                                                                )
                                                            ) : (
                                                                <p>N/A</p>
                                                            )}
                                                        </div>
                                                        <div>
                                                            <label className="font-['Epilogue'] text-[16px] font-bold leading-[18px] text-neutral-900">
                                                                Redirection
                                                                Program
                                                            </label>
                                                            {loadedForm
                                                                .redirection
                                                                ?.length ? ( // Optional chaining used here
                                                                loadedForm.redirection.map(
                                                                    (
                                                                        dir,
                                                                        index,
                                                                    ) => (
                                                                        <div
                                                                            key={
                                                                                index
                                                                            }
                                                                            className="space-y-4"
                                                                        >
                                                                            <label>
                                                                                {
                                                                                    dir
                                                                                }
                                                                            </label>
                                                                        </div>
                                                                    ),
                                                                )
                                                            ) : (
                                                                <p>N/A</p>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <div className="grid grid-cols-2 gap-[12px]">
                                                        <div>
                                                            <label className="font-['Epilogue'] text-[16px] font-bold leading-[18px] text-neutral-900">
                                                                Education &
                                                                Training Support
                                                            </label>
                                                            {loadedForm
                                                                .education
                                                                ?.length ? ( // Optional chaining used here
                                                                loadedForm.education.map(
                                                                    (
                                                                        edu,
                                                                        index,
                                                                    ) => (
                                                                        <div
                                                                            key={
                                                                                index
                                                                            }
                                                                            className="space-y-4"
                                                                        >
                                                                            <label>
                                                                                {
                                                                                    edu
                                                                                }
                                                                            </label>
                                                                        </div>
                                                                    ),
                                                                )
                                                            ) : (
                                                                <p>N/A</p>
                                                            )}
                                                        </div>
                                                        <div>
                                                            <label className="font-['Epilogue'] text-[16px] font-bold leading-[18px] text-neutral-900">
                                                                Health &
                                                                Wellness Support
                                                            </label>
                                                            {loadedForm
                                                                .healthWellness
                                                                ?.length ? ( // Optional chaining used here
                                                                loadedForm.healthWellness.map(
                                                                    (
                                                                        health,
                                                                        index,
                                                                    ) => (
                                                                        <div
                                                                            key={
                                                                                index
                                                                            }
                                                                            className="space-y-4"
                                                                        >
                                                                            <label>
                                                                                {
                                                                                    health
                                                                                }
                                                                            </label>
                                                                        </div>
                                                                    ),
                                                                )
                                                            ) : (
                                                                <p>N/A</p>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <label className="font-['Epilogue'] text-[16px] font-bold leading-[18px] text-neutral-900">
                                                            Referrals/Linkages
                                                            Services
                                                        </label>
                                                        {loadedForm.referral
                                                            ?.length ? ( // Optional chaining used here
                                                            loadedForm.referral.map(
                                                                (
                                                                    ref,
                                                                    index,
                                                                ) => (
                                                                    <div
                                                                        key={
                                                                            index
                                                                        }
                                                                        className="space-y-4"
                                                                    >
                                                                        <label>
                                                                            {
                                                                                ref
                                                                            }
                                                                        </label>
                                                                    </div>
                                                                ),
                                                            )
                                                        ) : (
                                                            <p>N/A</p>
                                                        )}
                                                    </div>
                                                </div>

                                                <div className="space-y-[24px]">
                                                    <label className="font-epilogue text-[28px] font-semibold leading-[40px] text-[#000]">
                                                        Profile picture
                                                    </label>
                                                    <div className="gap-y-[4px]">
                                                        {/* Row: */}
                                                        <div>
                                                            {loadedForm
                                                                .clientImageName
                                                                ?.length ? ( // Optional chaining used here
                                                                loadedForm.clientImageName.map(
                                                                    (
                                                                        imName,
                                                                        index,
                                                                    ) => (
                                                                        <div
                                                                            key={
                                                                                index
                                                                            }
                                                                            className="space-y-4"
                                                                        >
                                                                            <label>
                                                                                {
                                                                                    imName
                                                                                }
                                                                            </label>
                                                                        </div>
                                                                    ),
                                                                )
                                                            ) : (
                                                                <p>
                                                                    No file(s)
                                                                    uploaded.
                                                                </p>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="space-y-[24px]">
                                                    <label className="font-epilogue text-[28px] font-semibold leading-[40px] text-[#000]">
                                                        Documents
                                                    </label>
                                                    <div className="flex flex-col space-y-1">
                                                        <label className="font-['Epilogue'] text-[16px] font-bold leading-[18px] text-neutral-900">
                                                            ID
                                                        </label>
                                                        <div>
                                                            {loadedForm
                                                                .clientIDName
                                                                ?.length ? ( // Optional chaining used here
                                                                loadedForm.clientIDName.map(
                                                                    (
                                                                        id,
                                                                        index,
                                                                    ) => (
                                                                        <div
                                                                            key={
                                                                                index
                                                                            }
                                                                            className="space-y-4"
                                                                        >
                                                                            <label className="flex h-[36px] flex-row items-center gap-3 self-stretch rounded-lg bg-gray-200 px-3 py-1.5 text-sm text-gray-800">
                                                                                <svg
                                                                                    xmlns="http://www.w3.org/2000/svg"
                                                                                    height="24px"
                                                                                    viewBox="0 -960 960 960"
                                                                                    width="24px"
                                                                                    fill="#000000"
                                                                                >
                                                                                    <path d="M330-250h300v-60H330v60Zm0-160h300v-60H330v60Zm-77.69 310Q222-100 201-121q-21-21-21-51.31v-615.38Q180-818 201-839q21-21 51.31-21H570l210 210v477.69Q780-142 759-121q-21 21-51.31 21H252.31ZM540-620v-180H252.31q-4.62 0-8.46 3.85-3.85 3.84-3.85 8.46v615.38q0 4.62 3.85 8.46 3.84 3.85 8.46 3.85h455.38q4.62 0 8.46-3.85 3.85-3.84 3.85-8.46V-620H540ZM240-800v180-180V-160v-640Z" />
                                                                                </svg>
                                                                                {
                                                                                    id
                                                                                }
                                                                            </label>
                                                                        </div>
                                                                    ),
                                                                )
                                                            ) : (
                                                                <p>
                                                                    No file(s)
                                                                    uploaded.
                                                                </p>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <div className="flex flex-col space-y-1">
                                                        <label className="font-['Epilogue'] text-[16px] font-bold leading-[18px] text-neutral-900">
                                                            Passport
                                                        </label>
                                                        <div>
                                                            {loadedForm
                                                                .clientPassportName
                                                                ?.length ? ( // Optional chaining used here
                                                                loadedForm.clientPassportName.map(
                                                                    (
                                                                        pass,
                                                                        index,
                                                                    ) => (
                                                                        <div
                                                                            key={
                                                                                index
                                                                            }
                                                                            className="space-y-4"
                                                                        >
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
                                                                                {
                                                                                    pass
                                                                                }
                                                                            </label>
                                                                        </div>
                                                                    ),
                                                                )
                                                            ) : (
                                                                <p>
                                                                    No file(s)
                                                                    uploaded.
                                                                </p>
                                                            )}
                                                        </div>
                                                    </div>

                                                    <div className="flex flex-col space-y-1">
                                                        <label className="font-['Epilogue'] text-[16px] font-bold leading-[18px] text-neutral-900">
                                                            MediCal
                                                        </label>
                                                        <div>
                                                            {loadedForm
                                                                .clientMedName
                                                                ?.length ? ( // Optional chaining used here
                                                                loadedForm.clientMedName.map(
                                                                    (
                                                                        id,
                                                                        index,
                                                                    ) => (
                                                                        <div
                                                                            key={
                                                                                index
                                                                            }
                                                                            className="space-y-4"
                                                                        >
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
                                                                                {
                                                                                    id
                                                                                }
                                                                            </label>
                                                                        </div>
                                                                    ),
                                                                )
                                                            ) : (
                                                                <p>
                                                                    No file(s)
                                                                    uploaded.
                                                                </p>
                                                            )}
                                                        </div>
                                                    </div>

                                                    <div className="flex flex-col space-y-1">
                                                        <label className="font-['Epilogue'] text-[16px] font-bold leading-[18px] text-neutral-900">
                                                            SSN
                                                        </label>
                                                        <div>
                                                            {loadedForm
                                                                .clientSSNName
                                                                ?.length ? ( // Optional chaining used here
                                                                loadedForm.clientSSNName.map(
                                                                    (
                                                                        id,
                                                                        index,
                                                                    ) => (
                                                                        <div
                                                                            key={
                                                                                index
                                                                            }
                                                                            className="space-y-4"
                                                                        >
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
                                                                                {
                                                                                    id
                                                                                }
                                                                            </label>
                                                                        </div>
                                                                    ),
                                                                )
                                                            ) : (
                                                                <p>
                                                                    No file(s)
                                                                    uploaded.
                                                                </p>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <div className="flex flex-col space-y-1">
                                                        <label className="font-['Epilogue'] text-[16px] font-bold leading-[18px] text-neutral-900">
                                                            Birth Certificate
                                                        </label>
                                                        <div>
                                                            {loadedForm
                                                                .clientBCName
                                                                ?.length ? ( // Optional chaining used here
                                                                loadedForm.clientBCName.map(
                                                                    (
                                                                        id,
                                                                        index,
                                                                    ) => (
                                                                        <div
                                                                            key={
                                                                                index
                                                                            }
                                                                            className="space-y-4"
                                                                        >
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
                                                                                {
                                                                                    id
                                                                                }
                                                                            </label>
                                                                        </div>
                                                                    ),
                                                                )
                                                            ) : (
                                                                <p>
                                                                    No file(s)
                                                                    uploaded.
                                                                </p>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="space-y-[24px]">
                                                    <label className="font-epilogue text-[28px] font-semibold leading-[40px] text-[#000]">
                                                        Case Notes
                                                    </label>

                                                    <div className="flex flex-col space-y-1">
                                                        <label className="font-['Epilogue'] text-[16px] font-bold leading-[18px] text-neutral-900">
                                                            Notes on Housing
                                                        </label>
                                                        <div>
                                                            {loadedForm.housingNotes ? (
                                                                loadedForm.housingNotes
                                                            ) : (
                                                                <p>N/A</p>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <div className="flex flex-col space-y-1">
                                                        <label className="font-['Epilogue'] text-[16px] font-bold leading-[18px] text-neutral-900">
                                                            Notes on History
                                                        </label>
                                                        <div>
                                                            {loadedForm.historyNotes ? (
                                                                loadedForm.historyNotes
                                                            ) : (
                                                                <p>N/A</p>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <div className="flex flex-col space-y-1">
                                                        <label className="font-['Epilogue'] text-[16px] font-bold leading-[18px] text-neutral-900">
                                                            Additional Notes
                                                        </label>
                                                        <div>
                                                            {loadedForm.additionalNotes ? (
                                                                loadedForm.additionalNotes
                                                            ) : (
                                                                <p>N/A</p>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
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
                                    '/intake/background/family/services',
                                )
                            }
                            className="rounded-[5px] bg-neutral-900 px-4 py-2 text-white"
                        >
                            Back
                        </button>
                        <button
                            type="button"
                            onClick={() =>
                                router.push(
                                    '/intake/background/family/services/confirmation/waiver',
                                )
                            }
                            className="rounded-[5px] bg-neutral-900 px-4 py-2 text-white"
                        >
                            Continue
                        </button>
                    </div>
                </div>
            </div>
        </form>
    )
}

export default Page
