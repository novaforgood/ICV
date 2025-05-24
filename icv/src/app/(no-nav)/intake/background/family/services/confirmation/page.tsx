'use client'
import { getClientById } from '@/api/clients'
import {
    ClientBio,
    ClientCitizenship,
    ClientContactInfo,
    ClientDependents,
    ClientDocs,
    ClientEducation,
    ClientEthnicity,
    ClientHistory,
    ClientHousing,
    ClientIncome,
    ClientNotes,
    ClientPets,
    ClientPic,
    ClientServices,
    ClientSpouse,
} from '@/app/_components/ClientProfileComponents'
import Symbol from '@/components/Symbol'
import { clientDb } from '@/data/firebase'
import { useUser } from '@/hooks/useUser'
import { ConfirmationSchema, NewClient } from '@/types/client-types'
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
    const [spouseInfo, setSpouseInfo] = useState<NewClient>({} as NewClient)

    useEffect(() => {
        if (loadedForm.associatedSpouseID) {
            getClientById(loadedForm.associatedSpouseID).then((spouseData) => {
                setSpouseInfo(spouseData)
            })
        }
    }, [loadedForm.associatedSpouseID])

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
                                                <ClientBio data={loadedForm} />

                                                <div className="space-y-[24px]">
                                                    <label className="font-epilogue text-[28px] font-semibold leading-[40px] text-[#000]">
                                                        Contact Information
                                                    </label>
                                                    <ClientContactInfo
                                                        data={loadedForm}
                                                    />
                                                </div>

                                                <div className="space-y-[24px]">
                                                    <label className="font-epilogue text-[28px] font-semibold leading-[40px] text-[#000]">
                                                        Citizenship
                                                    </label>
                                                    <ClientCitizenship
                                                        data={loadedForm}
                                                    />
                                                </div>

                                                <div className="space-y-[24px]">
                                                    <label className="font-epilogue text-[28px] font-semibold leading-[40px] text-[#000]">
                                                        Ethnicity
                                                    </label>
                                                    <ClientEthnicity
                                                        data={loadedForm}
                                                    />
                                                </div>

                                                <div className="space-y-[24px]">
                                                    <label className="font-epilogue text-[28px] font-semibold leading-[40px] text-[#000]">
                                                        Housing
                                                    </label>
                                                    <ClientHousing
                                                        data={loadedForm}
                                                    />
                                                </div>
                                            </div>
                                        )}

                                        {section === 'Background' && (
                                            <div className="space-y-[40px]">
                                                <div className="space-y-[24px]">
                                                    <label className="font-epilogue text-[28px] font-semibold leading-[40px] text-[#000]">
                                                        Education
                                                    </label>
                                                    <ClientEducation
                                                        data={loadedForm}
                                                    />
                                                </div>

                                                <div className="space-y-[24px]">
                                                    <label className="font-epilogue text-[28px] font-semibold leading-[40px] text-[#000]">
                                                        Income
                                                    </label>
                                                    <ClientIncome
                                                        data={loadedForm}
                                                    />
                                                </div>

                                                <div className="space-y-[24px]">
                                                    <label className="font-epilogue text-[28px] font-semibold leading-[40px] text-[#000]">
                                                        History
                                                    </label>
                                                    <ClientHistory
                                                        data={loadedForm}
                                                    />
                                                </div>
                                            </div>
                                        )}

                                        {section == 'Family' && (
                                            <div className="space-y-[40px]">
                                                {/* SPOUSE */}
                                                <div className="space-y-[24px]">
                                                    <label className="font-epilogue text-[28px] font-semibold leading-[40px] text-[#000]">
                                                        Spouse
                                                    </label>
                                                    <ClientSpouse
                                                        data={loadedForm}
                                                        spouseInfo={spouseInfo}
                                                    />
                                                </div>
                                                <div className="space-y-[24px]">
                                                    <label className="font-epilogue text-[28px] font-semibold leading-[40px] text-[#000]">
                                                        Dependents
                                                    </label>
                                                    <ClientDependents
                                                        data={loadedForm}
                                                    />
                                                </div>

                                                <div className="space-y-[24px]">
                                                    <label className="font-epilogue text-[28px] font-semibold leading-[40px] text-[#000]">
                                                        Pets
                                                    </label>
                                                    <ClientPets
                                                        data={loadedForm}
                                                    />
                                                </div>
                                            </div>
                                        )}

                                        {section == 'Services' && (
                                            <div className="space-y-[40px]">
                                                <ClientServices
                                                    data={loadedForm}
                                                />
                                                <div className="space-y-[24px]">
                                                    <label className="font-epilogue text-[28px] font-semibold leading-[40px] text-[#000]">
                                                        Profile picture
                                                    </label>

                                                    <ClientPic
                                                        data={loadedForm}
                                                    />
                                                </div>

                                                <div className="space-y-[24px]">
                                                    <label className="font-epilogue text-[28px] font-semibold leading-[40px] text-[#000]">
                                                        Documents
                                                    </label>
                                                    <ClientDocs
                                                        data={loadedForm}
                                                    />
                                                </div>
                                                <div className="space-y-[24px]">
                                                    <label className="font-epilogue text-[28px] font-semibold leading-[40px] text-[#000]">
                                                        Notes
                                                    </label>
                                                    <ClientNotes
                                                        data={loadedForm}
                                                    />
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
