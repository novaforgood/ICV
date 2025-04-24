'use client'
import Symbol from '@/components/Symbol'
import { useUser } from '@/hooks/useUser'
import { ConfirmationSchema } from '@/types/client-types'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { TypeOf } from 'zod'
import { useIntakeFormStore } from '../../../../../../_lib/useIntakeFormStore'

const Page = () => {
    const { form: loadedForm, updateForm } = useIntakeFormStore()
    type ConfirmType = TypeOf<typeof ConfirmationSchema>

    const {} = useForm<ConfirmType>({
        mode: 'onChange',
        resolver: zodResolver(ConfirmationSchema),
        defaultValues: loadedForm,
    })

    useEffect(() => {
        const calculatedCode = `${loadedForm.firstName?.[0]?.toUpperCase() ?? 'N'}${loadedForm.gender?.[0]?.toUpperCase() ?? 'X'}${loadedForm.lastName?.[0]?.toUpperCase() ?? 'N'}${new Date().getFullYear()}`
        updateForm({ clientCode: calculatedCode })
    }, [loadedForm.firstName, loadedForm.lastName, loadedForm.gender])

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
                                    Client Code
                                </label>
                                <div>{loadedForm.clientCode}</div>
                            </div>
                            <div className="flex flex-col space-y-1">
                                <label className="font-['Epilogue'] text-[16px] font-bold leading-[18px] text-neutral-900">
                                    Assessing Staff
                                </label>
                                <div>{loadedForm.assessingStaff}</div>
                            </div>
                        </div>
                        {/* Program and Case Manager to be implemented later */}
                        <div className="grid grid-cols-2 gap-x-5 gap-y-3">
                            <div className="flex flex-col space-y-1">
                                <label className="font-['Epilogue'] text-[16px] font-bold leading-[18px] text-neutral-900">
                                    Program
                                </label>
                                <div>Homeless Outreach</div>
                            </div>
                            <div className="flex flex-col space-y-1">
                                <label className="font-['Epilogue'] text-[16px] font-bold leading-[18px] text-neutral-900">
                                    Case Manager
                                </label>
                                <div>*Options to be implemented*</div>
                            </div>
                        </div>
                    </div>
                    {/* all dropdown sections */}
                    {['Client Profile', 'Family', 'Background', 'Services'].map(
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
                                                            <div>
                                                                {loadedForm.firstName ? (
                                                                    <p>
                                                                        {
                                                                            loadedForm.firstName
                                                                        }{' '}
                                                                        {
                                                                            loadedForm.lastName
                                                                        }
                                                                    </p>
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
                                                                Gender
                                                            </label>
                                                            <div>
                                                                {loadedForm.gender ? (
                                                                    loadedForm.gender
                                                                ) : (
                                                                    <p>
                                                                        None
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
                                                                        None
                                                                        provided.
                                                                    </p>
                                                                )}
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
                                                                    <p>
                                                                        None
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
                                                                        None
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
                                                                        None
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
                                                                        None
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
                                                                        None
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
                                                                        None
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
                                                                        None
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
                                                                Housing Notes
                                                            </label>
                                                            <div>
                                                                {loadedForm.housingNotes ? (
                                                                    loadedForm.housingNotes
                                                                ) : (
                                                                    <p>
                                                                        None
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
                                                                            None
                                                                            provided.
                                                                        </p>
                                                                    )}
                                                                </div>
                                                            </div>
                                                            <div className="flex flex-col space-y-1">
                                                                <label className="font-['Epilogue'] text-[16px] font-bold leading-[18px] text-neutral-900">
                                                                    Total Income
                                                                </label>
                                                                <div>
                                                                    {loadedForm.totalIncome ? (
                                                                        `$${loadedForm.totalIncome} ${loadedForm.aptNumber ? `Apt. ${loadedForm.aptNumber}` : ''}`
                                                                    ) : (
                                                                        <p>
                                                                            None
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
                                                                    {loadedForm.employment ? (
                                                                        loadedForm.employment
                                                                    ) : (
                                                                        <p>
                                                                            None
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
                                            <div className="space-y-[40px]">
                                                <div className="space-y-[24px]">
                                                    <div className="grid grid-cols-2 gap-x-5 gap-y-3">
                                                        {/* First Row: Name & Gender */}
                                                        <div className="flex flex-col space-y-1">
                                                            <label className="font-['Epilogue'] text-[16px] font-bold leading-[18px] text-neutral-900">
                                                                Family Size
                                                            </label>
                                                            <div>
                                                                {loadedForm.familySize ? (
                                                                    loadedForm.familySize
                                                                ) : (
                                                                    <p>
                                                                        None
                                                                        provided.
                                                                    </p>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="space-y-[24px]">
                                                    <label className="font-epilogue text-[28px] font-semibold leading-[40px] text-[#000]">
                                                        Spouse
                                                    </label>
                                                    {loadedForm.spouse ? (
                                                        // Optional chaining used here

                                                        <div className="space-y-4 pb-4">
                                                            <label className="font-['Epilogue'] text-[16px] font-bold leading-[18px] text-neutral-900">
                                                                Spouse
                                                            </label>
                                                            <div className="grid grid-cols-2 gap-x-5 gap-y-3">
                                                                {/* First Row: Name & Gender */}
                                                                <div className="flex flex-col space-y-1">
                                                                    <label className="font-['Epilogue'] text-[16px] font-bold leading-[18px] text-neutral-900">
                                                                        Name
                                                                    </label>
                                                                    <div>
                                                                        {
                                                                            loadedForm
                                                                                .spouse
                                                                                .spouseFirstName
                                                                        }{' '}
                                                                        {
                                                                            loadedForm
                                                                                .spouse
                                                                                .spouseLastName
                                                                        }
                                                                    </div>
                                                                </div>
                                                                <div className="flex flex-col space-y-1">
                                                                    <label className="font-['Epilogue'] text-[16px] font-bold leading-[18px] text-neutral-900">
                                                                        Gender
                                                                    </label>
                                                                    <div>
                                                                        {loadedForm
                                                                            .spouse
                                                                            .spouseGender || (
                                                                            <p>
                                                                                None
                                                                                provided.
                                                                            </p>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            {/* Second Row: DOB & Income */}
                                                            <div className="grid grid-cols-2 gap-x-5 gap-y-3">
                                                                <div className="flex flex-col space-y-1">
                                                                    <label className="font-['Epilogue'] text-[16px] font-bold leading-[18px] text-neutral-900">
                                                                        Date of
                                                                        Birth
                                                                    </label>
                                                                    <div>
                                                                        {loadedForm
                                                                            .spouse
                                                                            .spouseDOB || (
                                                                            <p>
                                                                                None
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
                                                                        {loadedForm
                                                                            .spouse
                                                                            .spouseIncome !==
                                                                        undefined ? (
                                                                            `$${loadedForm.spouse.spouseIncome.toLocaleString()}`
                                                                        ) : (
                                                                            <p>
                                                                                None
                                                                                provided.
                                                                            </p>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <p>None provided.</p>
                                                    )}
                                                </div>

                                                <div className="space-y-[24px]">
                                                    <label className="font-epilogue text-[28px] font-semibold leading-[40px] text-[#000]">
                                                        Dependents
                                                    </label>
                                                    {loadedForm.dependent
                                                        ?.length ? ( // Optional chaining used here
                                                        loadedForm.dependent.map(
                                                            (child, index) => (
                                                                <div
                                                                    key={index}
                                                                    className="space-y-4 pb-4"
                                                                >
                                                                    <label className="font-['Epilogue'] text-[16px] font-bold leading-[18px] text-neutral-900">
                                                                        Dependent{' '}
                                                                        {index +
                                                                            1}
                                                                        :
                                                                    </label>
                                                                    <div className="grid grid-cols-2 gap-x-5 gap-y-3">
                                                                        {/* First Row: Name & Income */}
                                                                        <div className="flex flex-col space-y-1">
                                                                            <label className="font-['Epilogue'] text-[16px] font-bold leading-[18px] text-neutral-900">
                                                                                Name
                                                                            </label>
                                                                            <div>
                                                                                {
                                                                                    child.firstName
                                                                                }{' '}
                                                                                {
                                                                                    child.lastName
                                                                                }
                                                                            </div>
                                                                        </div>
                                                                        <div className="flex flex-col space-y-1">
                                                                            <label className="font-['Epilogue'] text-[16px] font-bold leading-[18px] text-neutral-900">
                                                                                Income
                                                                            </label>
                                                                            <div>
                                                                                {child.income !==
                                                                                undefined ? (
                                                                                    `$${child.income.toLocaleString()}`
                                                                                ) : (
                                                                                    <p>
                                                                                        None
                                                                                        provided.
                                                                                    </p>
                                                                                )}
                                                                            </div>
                                                                        </div>
                                                                    </div>

                                                                    {/* Second Row: DOB & Income */}
                                                                    <div className="grid grid-cols-2 gap-x-5 gap-y-3">
                                                                        <div className="flex flex-col space-y-1">
                                                                            <label className="font-['Epilogue'] text-[16px] font-bold leading-[18px] text-neutral-900">
                                                                                Date
                                                                                of
                                                                                Birth
                                                                            </label>
                                                                            <div>
                                                                                {child.dob || (
                                                                                    <p>
                                                                                        None
                                                                                        provided.
                                                                                    </p>
                                                                                )}
                                                                            </div>
                                                                        </div>
                                                                        <div className="flex flex-col space-y-1">
                                                                            <label className="font-['Epilogue'] text-[16px] font-bold leading-[18px] text-neutral-900">
                                                                                Gender
                                                                            </label>
                                                                            <div>
                                                                                {child.gender || (
                                                                                    <p>
                                                                                        None
                                                                                        provided.
                                                                                    </p>
                                                                                )}
                                                                            </div>
                                                                        </div>
                                                                    </div>

                                                                    <div className="space-y-[4px]">
                                                                        <label className="font-['Epilogue'] text-[16px] font-bold leading-[18px] text-neutral-900">
                                                                            Public
                                                                            Services?
                                                                        </label>
                                                                        <div>
                                                                            {child
                                                                                .publicServices
                                                                                ?.length ? ( // Optional chaining used here
                                                                                child.publicServices.map(
                                                                                    (
                                                                                        service,
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
                                                                                                    service
                                                                                                }
                                                                                            </label>
                                                                                        </div>
                                                                                    ),
                                                                                )
                                                                            ) : (
                                                                                <p>
                                                                                    None
                                                                                    provided.
                                                                                </p>
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            ),
                                                        )
                                                    ) : (
                                                        <p>None provided.</p>
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
                                                                    className="space-y-4 pb-4"
                                                                >
                                                                    <label className="font-['Epilogue'] text-[16px] font-bold leading-[18px] text-neutral-900">
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
                                                                                        None
                                                                                        provided.
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
                                                                                        None
                                                                                        provided.
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
                                                                                    None
                                                                                    provided.
                                                                                </p>
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            ),
                                                        )
                                                    ) : (
                                                        <p>None provided.</p>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                        {section === 'Background' && (
                                            <div className="space-y-[40px]">
                                                <div className="space-y-[24px]">
                                                    <div className="grid grid-cols-2 gap-x-5 gap-y-3">
                                                        {/* First Row: Name & Gender */}
                                                        <div className="flex flex-col space-y-1">
                                                            <label className="font-['Epilogue'] text-[16px] font-bold leading-[18px] text-neutral-900">
                                                                Education
                                                            </label>
                                                            <div>
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
                                                                    <p>
                                                                        None
                                                                        provided.
                                                                    </p>
                                                                )}
                                                            </div>
                                                        </div>
                                                        <div className="flex flex-col space-y-1">
                                                            <label className="font-['Epilogue'] text-[16px] font-bold leading-[18px] text-neutral-900">
                                                                Open case with
                                                                probation?
                                                            </label>
                                                            <div>
                                                                {loadedForm.openProbation ? (
                                                                    loadedForm.openProbation
                                                                ) : (
                                                                    <p>
                                                                        None
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
                                                                Open case with
                                                                CPS?
                                                            </label>
                                                            <div>
                                                                {loadedForm.openCPS ? (
                                                                    loadedForm.openCPS
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
                                                                Foster youth?
                                                            </label>
                                                            <div>
                                                                {loadedForm.fosterYouth ? (
                                                                    loadedForm.fosterYouth
                                                                ) : (
                                                                    <p>
                                                                        None
                                                                        provided.
                                                                    </p>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="space-y-[24px]">
                                                    <label className="font-epilogue text-[28px] font-semibold leading-[40px] text-[#000]">
                                                        Mental Health
                                                    </label>
                                                    <div className="space-y-[24px]">
                                                        {/* Row: */}
                                                        <div className="flex flex-col space-y-1">
                                                            <div>
                                                                {loadedForm.mentalHealthConditions ? (
                                                                    loadedForm.mentalHealthConditions
                                                                ) : (
                                                                    <p>
                                                                        None
                                                                        provided.
                                                                    </p>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="space-y-[24px]">
                                                    <label className="font-epilogue text-[28px] font-semibold leading-[40px] text-[#000]">
                                                        Medical History
                                                    </label>
                                                    <div className="grid grid-cols-2 gap-x-5 gap-y-3">
                                                        {/* Row: */}
                                                        <div className="flex flex-col space-y-1">
                                                            <div>
                                                                <div>
                                                                    {loadedForm.medicalConditions ? (
                                                                        loadedForm.medicalConditions
                                                                    ) : (
                                                                        <p>
                                                                            No
                                                                            notes.
                                                                        </p>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="space-y-[24px]">
                                                        <label className="font-epilogue text-[28px] font-semibold leading-[40px] text-[#000]">
                                                            Substance Abuse
                                                        </label>
                                                        <div className="space-y-[24px]">
                                                            <div className="flex flex-col space-y-1">
                                                                <div>
                                                                    {loadedForm.substanceAbuse ? (
                                                                        loadedForm.substanceAbuse
                                                                    ) : (
                                                                        <p>
                                                                            None
                                                                            provided.
                                                                        </p>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>

                                                        {/* <div className="space-y-[24px]">
                                                            <label className="font-epilogue text-[28px] font-semibold leading-[40px] text-[#000]">
                                                                Public Services
                                                            </label>
                                                            <div>
                                                                {loadedForm
                                                                    .publicServices
                                                                    ?.length ? ( // Optional chaining used here
                                                                    loadedForm.publicServices.map(
                                                                        (
                                                                            service,
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
                                                                                        service
                                                                                    }
                                                                                </label>
                                                                            </div>
                                                                        ),
                                                                    )
                                                                ) : (
                                                                    <p>
                                                                        None
                                                                        provided.
                                                                    </p>
                                                                )}
                                                            </div>
                                                        </div> */}
                                                    </div>
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
                                                                <p>
                                                                    No services
                                                                    needed.
                                                                </p>
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
                                                                <p>
                                                                    No services
                                                                    needed.
                                                                </p>
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
                                                                <p>
                                                                    No services
                                                                    needed.
                                                                </p>
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
                                                                <p>
                                                                    No services
                                                                    needed.
                                                                </p>
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
                                                                <p>
                                                                    No services
                                                                    needed.
                                                                </p>
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
                                                                <p>
                                                                    No services
                                                                    needed.
                                                                </p>
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
                                                            <p>
                                                                No services
                                                                needed.
                                                            </p>
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
                                                                            <label>
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
                                                                            <label>
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
                                                                            <label>
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
                                                                            <label>
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
                                                                            <label>
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
                                                        Additional Notes
                                                    </label>
                                                    <div className="grid grid-cols-2 gap-x-5 gap-y-3">
                                                        {/* Row: */}
                                                        <div className="flex flex-col space-y-1">
                                                            <div>
                                                                <div>
                                                                    {loadedForm.notes ? (
                                                                        loadedForm.notes
                                                                    ) : (
                                                                        <p>
                                                                            None
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
                            type="button"
                            onClick={() =>
                                router.push(
                                    '/intake/family/background/services/confirmation/waiver',
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
