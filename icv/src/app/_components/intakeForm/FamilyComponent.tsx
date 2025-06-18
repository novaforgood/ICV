'use client'

import { getClientById } from '@/api/clients'
import {
    FamilySchema,
    GENDER,
    MARITALSTATUS,
    NewClient,
    PETPURPOSE,
    PETSIZE,
    YESNO,
} from '@/types/client-types'
import { zodResolver } from '@hookform/resolvers/zod'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { TypeOf } from 'zod'
import ClientSearch from '../ClientSearch'
import {
    CheckboxList,
    RadioChoice,
    RadioWithOther,
    ServicesWithIncome,
} from './MakeOptions'

interface Props {
    formType: Partial<NewClient>
    updateForm: (form: Partial<NewClient>) => void
    onSubmitNew?: (formType: NewClient) => void
    onSubmitEdit?: (formType: NewClient) => void
    onCancel?: () => void
    submitType: 'save' | 'new'
    titleStyle: string
    showSpouseLink?: boolean
}

type FamilyType = TypeOf<typeof FamilySchema>
export const FamilySection: React.FC<Props> = ({
    formType,
    updateForm,
    onSubmitNew,
    onSubmitEdit,
    onCancel,
    submitType,
    titleStyle,
    showSpouseLink,
}) => {
    const {
        register,
        handleSubmit,
        reset,
        watch,
        setValue,
        getValues,
        formState: { errors },
    } = useForm<FamilyType>({
        mode: 'onChange',
        resolver: zodResolver(FamilySchema),
        defaultValues: formType,
    })

    const router = useRouter()
    const manualUpdateRef = useRef(false)

    const [warnings, setWarnings] = useState<string[]>([])
    type IncomeWarning = {
        message: string
        depIndex: number
    }
    const [invalidIncome, setInvalidIncome] = useState<IncomeWarning[]>([])
    const [linkSpouse, setLinkSpouse] = useState(
        formType.associatedSpouseID && showSpouseLink ? false : true,
    )

    useEffect(() => {
        reset(formType)
    }, [formType, reset])

    useEffect(() => {
        const unsubscribe = watch((data) => {
            updateForm({
                ...data,
                dependent: data.dependent?.filter(
                    (child) => child !== undefined,
                ),
                pets: data.pets
                    ?.filter((pet) => pet !== undefined)
                    .map((pet) => ({
                        ...pet,
                        purpose: pet?.purpose ?? [],
                    })),
            })
        }).unsubscribe
        console.log(formType)
        console.log(errors)

        return unsubscribe
    }, [watch, formType])

    useEffect(() => {
        if (formType.associatedSpouseID && !manualUpdateRef.current) {
            setValue('maritalStatus', 'Married')
            setValue('spouseClientStatus', 'Yes')
        }
    }, [formType.associatedSpouseID, setValue])

    const [spouseInfo, setSpouseInfo] = useState<NewClient>({} as NewClient)
    const [showSpouseSearch, setShowSpouseSearch] = useState(false)

    useEffect(() => {
        if (formType.associatedSpouseID) {
            getClientById(formType.associatedSpouseID).then((spouseData) => {
                setSpouseInfo(spouseData)
            })
        }
    }, [formType.associatedSpouseID])

    // useEffect(() => {
    //     if (formType.maritalStatus !== 'Married') {
    //         if (formType.spouse) {
    //             removeSpouse()
    //         }

    //         if (formType.spouseClientStatus) {
    //             setValue('spouseClientStatus', '')
    //         }

    //         // if (formType.associatedSpouseID) {
    //         //     setValue('associatedSpouseID', '')
    //         //     updateForm({ associatedSpouseID: '' })
    //         // }
    //     }
    // }, [
    //     formType.maritalStatus,
    //     formType.spouse,
    //     formType.spouseClientStatus,
    //     formType.associatedSpouseID,
    // ])

    useEffect(() => {
        const marital = watch('maritalStatus')
        const spouseStatus = watch('spouseClientStatus')

        if (
            (marital && marital !== 'Married') ||
            (spouseStatus && spouseStatus !== 'Yes')
        ) {
            if (formType.associatedSpouseID) {
                manualUpdateRef.current = true
                setValue('associatedSpouseID', '')
                updateForm({ associatedSpouseID: '' })
            }
        }
    }, [watch('maritalStatus'), watch('spouseClientStatus')])

    useEffect(() => {
        if (formType.headOfHousehold != 'Yes' && formType.dependent) {
            removeDependents()
        }
    }, [formType.headOfHousehold])

    useEffect(() => {
        const errors: string[] = []
        // number of family members serviced always includes the client themselves
        const parseFamSize = (value: any) => {
            console.log('value', value)
            if (value === undefined || value === '') {
                setWarnings([])
                return 1
            }
            const num = Number(value)
            console.log('NUM', num)
            if (isNaN(num)) {
                errors.push(`Enter a valid family size.`)
                console.log('ERRORS', errors)
                setWarnings(errors)
                return 0
            }

            setWarnings(errors)
            console.log('ERRRORS', errors)
            return num
        }

        const familyNum = parseFamSize(formType.familySize)
        console.log('FamilySize as an int', familyNum)

        // default for if a client is not the head of household, and has spouse who is
        let servicedVal = '1'

        if (formType.headOfHousehold === 'No') {
            // if a client is not head of household but has a non-ICV client spouse
            servicedVal = formType.spouseClientStatus === 'Yes' ? '1' : '2'
        } else if (familyNum === 1) {
            servicedVal = '1'
        } else if (formType.spouseClientStatus === 'Yes') {
            servicedVal = (familyNum - 1).toString()
        } else {
            servicedVal = familyNum.toString()
        }
        updateForm({ familyMembersServiced: servicedVal })
        console.log('Serviced', servicedVal)

        // if user filled out spouse info but switches to yes, ICV client, remove spouse info
        if (formType.spouseClientStatus === 'Yes' && formType.spouse) {
            removeSpouse()
        } else if (
            formType.spouseClientStatus === 'No' &&
            formType.associatedSpouseID &&
            formType.spouse
        ) {
            setValue('associatedSpouseID', undefined)
        }
    }, [
        formType.spouseClientStatus,
        formType.familySize,
        formType.headOfHousehold,
    ])

    useEffect(() => {
        const warnings: { message: string; depIndex: number }[] = []

        const parseIncome = (label: string, value: any, depIndex: number) => {
            if (value === undefined || value === '') return 0

            const cleaned = String(value).replace(/,/g, '')
            const num = parseFloat(cleaned)

            if (isNaN(num) || cleaned !== num.toString()) {
                warnings.push({
                    depIndex,
                    message: `"${value}" is not a valid income for ${label}.`,
                })

                return 0
            }

            return num
        }

        const updatedDependents = (formType.dependent || []).map(
            (dep, index) => {
                const totalSum =
                    parseIncome('Income', dep.income, index) +
                    parseIncome(
                        'General Relief Aid',
                        dep.generalReliefAid,
                        index,
                    ) +
                    parseIncome('CalFresh Aid', dep.calFreshAid, index) +
                    parseIncome('CalWorks Aid', dep.calWorksAid, index) +
                    parseIncome('SSI Aid', dep.ssiAid, index) +
                    parseIncome('SSA Aid', dep.ssaAid, index) +
                    parseIncome(
                        'Unemployment Aid',
                        dep.unemploymentAid,
                        index,
                    ) +
                    parseIncome('Other Aid', dep.otherServiceAid, index)

                return {
                    ...dep,
                    totalIncome: totalSum.toString(),
                }
            },
        )
        console.log({ updatedDependents })
        setInvalidIncome(warnings)
        const shouldUpdate =
            JSON.stringify(formType.dependent) !==
            JSON.stringify(updatedDependents)

        if (shouldUpdate) {
            updateForm({ dependent: updatedDependents })
        }
    }, [formType.dependent])

    const calculateAge = (dobString: string): { age: number | undefined } => {
        if (!dobString) return { age: undefined }

        const dob = new Date(dobString)
        const now = new Date()

        let age = now.getFullYear() - dob.getFullYear()
        const monthDiff = now.getMonth() - dob.getMonth()
        if (
            monthDiff < 0 ||
            (monthDiff === 0 && now.getDate() < dob.getDate())
        ) {
            age--
        }

        return { age }
    }

    useEffect(() => {
        const dobValue = formType.spouse?.spouseDOB

        if (dobValue) {
            const { age } = calculateAge(dobValue)

            if (age !== undefined) {
                setValue('spouse.spouseAge', age.toString()) // Only set 'age' if it's calculated
            }
        }
    }, [formType.spouse?.spouseDOB, setValue])

    useEffect(() => {
        if (formType.dependent) {
            formType.dependent.forEach((dep, index) => {
                const dobValue = dep?.dob
                if (dobValue) {
                    const { age } = calculateAge(dobValue)
                    if (
                        age !== undefined &&
                        formType.dependent?.[index]?.age !== age?.toString()
                    ) {
                        setValue(`dependent.${index}.age`, age.toString())
                    }
                }
            })
        }
    }, [formType.dependent, setValue])

    // Function to clear spouse information
    const removeSpouse = () => {
        console.log('Remove in progress!')
        setValue('spouse.spouseFirstName', undefined)
        setValue('spouse.spouseLastName', undefined)
        setValue('spouse.spouseDOB', undefined)
        setValue('spouse.spouseIncome', undefined)
        setValue('spouse.spouseGender', undefined)

        updateForm({
            spouse: undefined,
        })
    }

    const removeDependents = () => {
        if (formType.dependent) {
            formType.dependent.forEach((dep, index) => {
                setValue(`dependent.${index}.firstName`, undefined)
                setValue(`dependent.${index}.lastName`, undefined)
                setValue(`dependent.${index}.dob`, undefined)
                setValue(`dependent.${index}.income`, undefined)
                setValue(`dependent.${index}.age`, undefined)
                setValue(`dependent.${index}.gender`, undefined)
                setValue(`dependent.${index}.generalRelief`, undefined)
                setValue(`dependent.${index}.generalReliefAid`, undefined)
                setValue(`dependent.${index}.calFresh`, undefined)
                setValue(`dependent.${index}.calFreshAid`, undefined)
                setValue(`dependent.${index}.calWorks`, undefined)
                setValue(`dependent.${index}.calWorksAid`, undefined)
                setValue(`dependent.${index}.ssi`, undefined)
                setValue(`dependent.${index}.ssiAid`, undefined)
                setValue(`dependent.${index}.ssa`, undefined)
                setValue(`dependent.${index}.ssaAid`, undefined)
                setValue(`dependent.${index}.unemployment`, undefined)
                setValue(`dependent.${index}.unemploymentAid`, undefined)
                setValue(`dependent.${index}.otherService`, undefined)
                setValue(`dependent.${index}.otherServiceAid`, undefined)
                setValue(`dependent.${index}.totalIncome`, undefined)
                setValue(`dependent`, undefined)
            })
        }
    }

    // Function to add a child
    const addChild = () => {
        const currentDep = getValues('dependent') || []
        const newDependent = {
            firstName: '',
            lastName: '',
            dob: '',
            income: '',
            gender: '',
            publicServices: [],
        }
        setValue('dependent', [...currentDep, newDependent])
    }

    // Function to remove a child
    const removeChild = (index: number) => {
        const currentDep = getValues('dependent')
        if (currentDep) {
            currentDep.splice(index, 1)
        }
        setValue('dependent', [...(currentDep || [])])
    }

    // Function to add a pet
    const addPet = () => {
        const currentPets = getValues('pets') || []
        const newPet = {
            species: '',
            size: '',
            purpose: [],
        }
        setValue('pets', [...currentPets, newPet])
    }

    // Function to remove a pet
    const removePet = (index: number) => {
        const currentPets = getValues('pets')
        if (currentPets) {
            currentPets.splice(index, 1)
        }
        setValue('pets', [...(currentPets || [])])
    }

    const handleSubmitType = (formType: FamilyType) => {
        if (submitType === 'save' && onSubmitEdit) {
            onSubmitEdit(formType)
        } else if (submitType === 'new' && onSubmitNew) {
            onSubmitNew(formType)
        }
    }

    return (
        <form
            className="space-y-[24px]"
            onSubmit={handleSubmit(handleSubmitType)}
        >
            <div className="flex min-h-screen items-center justify-center">
                <div className="w-full space-y-[30px]">
                    {/* Spouse Section */}
                    <div className="flex flex-col space-y-[24px]">
                        <label className={titleStyle}>Spouse</label>
                        <div className="flex flex-col space-y-[4px]">
                            <label className="font-['Epilogue'] text-[16px] font-normal leading-[18px] text-neutral-900">
                                Marital Status
                            </label>
                            <RadioWithOther
                                options={MARITALSTATUS}
                                selectedValue={watch(`maritalStatus`) ?? ''}
                                onChange={(updatedGender) =>
                                    setValue(`maritalStatus`, updatedGender)
                                }
                                name={`maritalStatus`}
                                otherLabel="Other"
                                otherPlaceholder="Other"
                            />
                        </div>
                        {formType.maritalStatus === 'Married' && (
                            <div className="flex flex-col space-y-[4px]">
                                <label className="font-['Epilogue'] text-[16px] font-normal leading-[18px] text-neutral-900">
                                    If married, is spouse an ICV client?
                                </label>
                                <RadioChoice
                                    options={YESNO}
                                    selectedValue={
                                        watch(`spouseClientStatus`) ?? ''
                                    }
                                    onChange={(updatedStat) =>
                                        setValue(
                                            `spouseClientStatus`,
                                            updatedStat,
                                        )
                                    }
                                    name={`spouseClientStatus`}
                                />
                            </div>
                        )}

                        {formType.maritalStatus === 'Married' &&
                            formType.spouseClientStatus === 'No' && (
                                <div className="mt-4 space-y-[24px] rounded-[10px] border-[1px] border-solid border-[#DBD8E4] p-[24px]">
                                    <div className="flex justify-end">
                                        <button
                                            type="button"
                                            onClick={() => removeSpouse()}
                                        >
                                            Clear x
                                        </button>
                                    </div>

                                    <div className="grid grid-cols-2 gap-[12px]">
                                        <div className="flex flex-col space-y-[4px]">
                                            <label className="font-['Epilogue'] text-[16px] font-normal leading-[18px] text-neutral-900">
                                                First Name
                                            </label>
                                            <input
                                                {...register(
                                                    `spouse.spouseFirstName`,
                                                )}
                                                type="text"
                                                placeholder="First Name"
                                                className="w-full rounded border p-2"
                                            />
                                        </div>
                                        <div className="flex flex-col space-y-[4px]">
                                            <label className="font-['Epilogue'] text-[16px] font-normal leading-[18px] text-neutral-900">
                                                Last Name
                                            </label>
                                            <input
                                                {...register(
                                                    `spouse.spouseLastName`,
                                                )}
                                                type="text"
                                                placeholder="Last Name"
                                                className="w-full rounded border p-2"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="flex flex-col space-y-[4px]">
                                            <label className="font-['Epilogue'] text-[16px] font-normal leading-[18px] text-neutral-900">
                                                Date of Birth
                                            </label>
                                            <input
                                                {...register(
                                                    `spouse.spouseDOB`,
                                                )}
                                                type="date"
                                                className="w-full rounded border p-2"
                                            />
                                        </div>
                                        <div className="flex flex-col space-y-[4px]">
                                            <label className="font-['Epilogue'] text-[16px] font-normal leading-[18px] text-neutral-900">
                                                Income
                                            </label>
                                            <div className="flex items-center space-x-[2px]">
                                                <p className="text-lg">$</p>
                                                <input
                                                    {...register(
                                                        `spouse.spouseIncome`,
                                                    )}
                                                    type="text"
                                                    placeholder="Text"
                                                    className="w-[30%] rounded border p-2"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex flex-col space-y-[4px]">
                                        <label className="font-['Epilogue'] text-[16px] font-normal leading-[18px] text-neutral-900">
                                            Gender
                                        </label>
                                        <RadioWithOther
                                            options={GENDER}
                                            selectedValue={
                                                watch(`spouse.spouseGender`) ??
                                                ''
                                            }
                                            onChange={(updatedGender) =>
                                                setValue(
                                                    `spouse.spouseGender`,
                                                    updatedGender,
                                                )
                                            }
                                            name={`spouse.spouseGender`}
                                            otherLabel="Other"
                                            otherPlaceholder="Other"
                                        />
                                    </div>
                                </div>
                            )}
                        {formType.associatedSpouseID && (
                            <div className="space-y-[24px]">
                                <div className="mt-4 w-full space-y-[24px] rounded-[10px] border border-[#DBD8E4] p-[24px]">
                                    <div className="flex flex-row items-center space-x-4">
                                        <div className="h-[64px] w-[64px] overflow-hidden rounded-full">
                                            {spouseInfo.clientPic?.[0]?.uri ? (
                                                <Image
                                                    src={
                                                        spouseInfo.clientPic[0]
                                                            .uri
                                                    }
                                                    alt={`${spouseInfo.firstName} ${spouseInfo.lastName}`}
                                                    className="h-full w-full object-cover object-center"
                                                    width={64}
                                                    height={64}
                                                />
                                            ) : (
                                                <svg
                                                    viewBox="0 0 24 24"
                                                    fill="currentColor"
                                                    className="h-full w-full text-gray-300"
                                                >
                                                    <path
                                                        fillRule="evenodd"
                                                        d="M18.685 19.097A9.723 9.723 0 0021.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 003.065 7.097A9.716 9.716 0 0012 21.75a9.716 9.716 0 006.685-2.653zm-12.54-1.285A7.486 7.486 0 0112 15a7.486 7.486 0 015.855 2.812A8.224 8.224 0 0112 20.25a8.224 8.224 0 01-5.855-2.438zM15.75 9a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z"
                                                        clipRule="evenodd"
                                                    />
                                                </svg>
                                            )}
                                        </div>

                                        <div className="truncate font-['Epilogue'] text-[22px] text-neutral-900">
                                            {spouseInfo.firstName}{' '}
                                            {spouseInfo.lastName}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-x-5">
                                        <div className="flex flex-col space-y-1">
                                            <label className="font-bold">
                                                Client Code
                                            </label>
                                            <label>
                                                {spouseInfo?.clientCode}
                                            </label>
                                        </div>
                                        <div className="flex flex-col space-y-1">
                                            <label className="font-bold">
                                                DOB
                                            </label>
                                            <label>
                                                {spouseInfo?.dateOfBirth}
                                            </label>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-x-5">
                                        <div className="flex flex-col space-y-1">
                                            <label className="font-bold">
                                                Gender
                                            </label>
                                            <label>{spouseInfo?.gender}</label>
                                        </div>
                                        <div className="flex flex-col space-y-1">
                                            <label className="font-bold">
                                                Income
                                            </label>
                                            <label>
                                                ${spouseInfo?.totalIncome}
                                            </label>
                                        </div>
                                    </div>
                                </div>
                                {showSpouseLink && (
                                    <button
                                        className="rounded-[5px] bg-black px-[20px] py-[16px] text-white hover:bg-[#6D757F]"
                                        onClick={() => {
                                            setValue('associatedSpouseID', '')
                                            updateForm({
                                                associatedSpouseID: '',
                                            })
                                            setLinkSpouse(true)
                                        }}
                                    >
                                        <div className="flex flex-row space-x-[8px]">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                height="20px"
                                                viewBox="0 -960 960 960"
                                                width="20px"
                                                fill="#FFFFFF"
                                            >
                                                <path d="M312-144q-29.7 0-50.85-21.15Q240-186.3 240-216v-480h-48v-72h192v-48h192v48h192v72h-48v479.57Q720-186 698.85-165T648-144H312Zm336-552H312v480h336v-480ZM384-288h72v-336h-72v336Zm120 0h72v-336h-72v336ZM312-696v480-480Z" />
                                            </svg>
                                            <label>Remove spouse</label>
                                        </div>
                                    </button>
                                )}
                            </div>
                        )}

                        {/* Add search to associate a new spouse */}
                        {showSpouseLink &&
                            formType.maritalStatus === 'Married' &&
                            formType.spouseClientStatus === 'Yes' &&
                            !formType.associatedSpouseID && (
                                <div>
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setShowSpouseSearch(true)
                                        }
                                        className="rounded-[5px] bg-black px-[20px] py-[16px] text-white hover:bg-[#6D757F]"
                                    >
                                        <div className="flex flex-row space-x-[8px]">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                height="20px"
                                                viewBox="0 -960 960 960"
                                                width="20px"
                                                fill="#FFFFFF"
                                            >
                                                <path d="M432-288H288q-79.68 0-135.84-56.23Q96-400.45 96-480.23 96-560 152.16-616q56.16-56 135.84-56h144v72H288q-50 0-85 35t-35 85q0 50 35 85t85 35h144v72Zm-96-156v-72h288v72H336Zm192 156v-72h144q50 0 85-35t35-85q0-50-35-85t-85-35H528v-72h144q79.68 0 135.84 56.23 56.16 56.22 56.16 136Q864-400 807.84-344 751.68-288 672-288H528Z" />
                                            </svg>
                                            <label>Link spouse profile</label>
                                        </div>
                                    </button>

                                    {showSpouseSearch && (
                                        <>
                                            {/* Modal Backdrop */}
                                            <div
                                                className="fixed inset-0 z-40 bg-black bg-opacity-50"
                                                onClick={() =>
                                                    setShowSpouseSearch(false)
                                                }
                                            />

                                            {/* Modal Content */}
                                            <div
                                                className="fixed left-1/2 top-1/2 z-50 w-full max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-lg bg-white p-6 shadow-lg"
                                                onClick={(e) =>
                                                    e.stopPropagation()
                                                }
                                            >
                                                <div className="mb-4 flex items-center justify-between">
                                                    <button
                                                        onClick={() =>
                                                            setShowSpouseSearch(
                                                                false,
                                                            )
                                                        }
                                                        className="text-2xl text-gray-600 hover:text-black"
                                                    >
                                                        <svg
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            height="20px"
                                                            viewBox="0 -960 960 960"
                                                            width="20px"
                                                            fill="#000000"
                                                        >
                                                            <path d="m291-240-51-51 189-189-189-189 51-51 189 189 189-189 51 51-189 189 189 189-51 51-189-189-189 189Z" />
                                                        </svg>
                                                    </button>
                                                </div>
                                                <ClientSearch
                                                    onSelect={(docId) => {
                                                        manualUpdateRef.current =
                                                            false
                                                        setValue(
                                                            'associatedSpouseID',
                                                            docId,
                                                        )
                                                        updateForm({
                                                            associatedSpouseID:
                                                                docId,
                                                        })
                                                        setShowSpouseSearch(
                                                            false,
                                                        )
                                                    }}
                                                />
                                            </div>
                                        </>
                                    )}
                                </div>
                            )}
                    </div>

                    {/* Dependent Section */}

                    <div className="flex flex-col space-y-[24px]">
                        <label className={titleStyle}>Dependents</label>
                        <div className="flex flex-col">
                            <label className="font-['Epilogue'] text-[16px] font-normal leading-[18px] text-neutral-900">
                                Head of household
                            </label>
                            <RadioChoice
                                options={YESNO}
                                selectedValue={watch(`headOfHousehold`) ?? ''}
                                onChange={(updatedStat) =>
                                    setValue(`headOfHousehold`, updatedStat)
                                }
                                name={`headOfHousehold`}
                            />
                        </div>
                        <div className="flex flex-col">
                            <label className="font-['Epilogue'] text-[16px] font-normal leading-[18px] text-neutral-900">
                                Family Size
                            </label>
                            <input
                                {...register('familySize')}
                                type="text"
                                placeholder="Text"
                                className="w-[50%] rounded border p-2"
                            />
                            {warnings.length > 0 && (
                                <div
                                    style={{ color: 'red', marginTop: '1rem' }}
                                >
                                    {warnings.map((msg, index) => (
                                        <div key={index}>{msg}</div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {formType.headOfHousehold === 'Yes' && (
                            <>
                                {watch('dependent')?.map((dependent, index) => (
                                    <div
                                        key={index}
                                        className="mt-4 space-y-[24px] rounded-[10px] border-[1px] border-solid border-[#DBD8E4] p-[24px]"
                                    >
                                        <div className="grid grid-cols-2 gap-x-5 gap-y-3">
                                            <label className="font-epilogue text-[22px] font-medium leading-[24px] text-[#1A1D20]">
                                                Dependent {index + 1}:
                                            </label>
                                            <div className="flex justify-end">
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        removeChild(index)
                                                    }
                                                >
                                                    Remove x
                                                </button>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-[12px]">
                                            {/* First Name and Last Name on the same line */}
                                            <div className="flex flex-col space-y-[4px]">
                                                <label className="font-['Epilogue'] text-[16px] font-normal leading-[18px] text-neutral-900">
                                                    First Name
                                                </label>
                                                <input
                                                    {...register(
                                                        `dependent.${index}.firstName`,
                                                    )}
                                                    type="text"
                                                    placeholder="Text"
                                                    className="w-full rounded border p-2"
                                                />
                                            </div>
                                            <div className="flex flex-col space-y-[4px]">
                                                <label className="font-['Epilogue'] text-[16px] font-normal leading-[18px] text-neutral-900">
                                                    Last Name
                                                </label>
                                                <input
                                                    {...register(
                                                        `dependent.${index}.lastName`,
                                                    )}
                                                    type="text"
                                                    placeholder="Text"
                                                    className="w-full rounded border p-2"
                                                />
                                            </div>
                                        </div>

                                        <div className="flex flex-col space-y-[4px]">
                                            <label className="font-['Epilogue'] text-[16px] font-normal leading-[18px] text-neutral-900">
                                                Date of Birth
                                            </label>
                                            <input
                                                {...register(
                                                    `dependent.${index}.dob`,
                                                )}
                                                type="date"
                                                className="w-[50%] rounded border p-2"
                                            />
                                        </div>
                                        <div className="flex flex-col space-y-[4px]">
                                            <label className="font-['Epilogue'] text-[16px] font-normal leading-[18px] text-neutral-900">
                                                Gender
                                            </label>
                                            <RadioWithOther
                                                options={GENDER}
                                                selectedValue={
                                                    watch(
                                                        `dependent.${index}.gender`,
                                                    ) ?? ''
                                                }
                                                onChange={(updatedGender) =>
                                                    setValue(
                                                        `dependent.${index}.gender`,
                                                        updatedGender,
                                                    )
                                                }
                                                name={`dependent.${index}.gender`}
                                                otherLabel="Other"
                                                otherPlaceholder="Other"
                                            />
                                        </div>
                                        <div className="align-center grid grid-cols-2 items-center">
                                            <label className="font-['Epilogue'] text-[16px] font-normal leading-[18px] text-neutral-900">
                                                Income
                                            </label>
                                            <div className="flex items-center space-x-[2px]">
                                                <p className="text-lg">$</p>
                                                <input
                                                    {...register(
                                                        `dependent.${index}.income`,
                                                    )}
                                                    type="text"
                                                    placeholder="Text"
                                                    className="w-full rounded border p-2"
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-[8px]">
                                            <div className="grid grid-cols-2 gap-[12px]">
                                                <div className="flex flex-col">
                                                    <label className="font-['Epilogue'] text-[16px] font-normal leading-[18px] text-neutral-900">
                                                        Public Services
                                                    </label>
                                                </div>
                                                <div className="flex flex-col">
                                                    <label className="font-['Epilogue'] text-[16px] font-normal leading-[18px] text-neutral-900">
                                                        Aid
                                                    </label>
                                                </div>
                                            </div>
                                            <div className="flex flex-col space-y-[8px]">
                                                <ServicesWithIncome
                                                    selected={
                                                        watch(
                                                            `dependent.${index}.generalRelief`,
                                                        ) ?? ''
                                                    }
                                                    serviceTitle="General Relief"
                                                    incomeFieldName={`dependent.${index}.generalReliefAid`}
                                                    serviceFieldName={`dependent.${index}.generalRelief`}
                                                    setValue={(field, value) =>
                                                        setValue(
                                                            field as keyof FamilyType,
                                                            value,
                                                        )
                                                    }
                                                    register={
                                                        register as (
                                                            field: string,
                                                        ) => {
                                                            [key: string]: any
                                                        }
                                                    }
                                                />
                                                <ServicesWithIncome
                                                    selected={
                                                        watch(
                                                            `dependent.${index}.calFresh`,
                                                        ) ?? ''
                                                    }
                                                    serviceTitle="CalFresh (Food Stamps/EBT)"
                                                    incomeFieldName={`dependent.${index}.calFreshAid`}
                                                    serviceFieldName={`dependent.${index}.calFresh`}
                                                    setValue={(field, value) =>
                                                        setValue(
                                                            field as keyof FamilyType,
                                                            value,
                                                        )
                                                    }
                                                    register={
                                                        register as (
                                                            field: string,
                                                        ) => {
                                                            [key: string]: any
                                                        }
                                                    }
                                                />
                                                <ServicesWithIncome
                                                    selected={
                                                        watch(
                                                            `dependent.${index}.calWorks`,
                                                        ) ?? ''
                                                    }
                                                    serviceTitle="CalWorks (Cash Aid)"
                                                    incomeFieldName={`dependent.${index}.calWorksAid`}
                                                    serviceFieldName={`dependent.${index}.calWorks`}
                                                    setValue={(field, value) =>
                                                        setValue(
                                                            field as keyof FamilyType,
                                                            value,
                                                        )
                                                    }
                                                    register={
                                                        register as (
                                                            field: string,
                                                        ) => {
                                                            [key: string]: any
                                                        }
                                                    }
                                                />
                                                <ServicesWithIncome
                                                    selected={
                                                        watch(
                                                            `dependent.${index}.ssi`,
                                                        ) ?? ''
                                                    }
                                                    serviceTitle="SSI"
                                                    incomeFieldName={`dependent.${index}.ssiAid`}
                                                    serviceFieldName={`dependent.${index}.ssi`}
                                                    setValue={(field, value) =>
                                                        setValue(
                                                            field as keyof FamilyType,
                                                            value,
                                                        )
                                                    }
                                                    register={
                                                        register as (
                                                            field: string,
                                                        ) => {
                                                            [key: string]: any
                                                        }
                                                    }
                                                />
                                                <ServicesWithIncome
                                                    selected={
                                                        watch(
                                                            `dependent.${index}.ssa`,
                                                        ) ?? ''
                                                    }
                                                    serviceTitle="SSA"
                                                    incomeFieldName={`dependent.${index}.ssaAid`}
                                                    serviceFieldName={`dependent.${index}.ssa`}
                                                    setValue={(field, value) =>
                                                        setValue(
                                                            field as keyof FamilyType,
                                                            value,
                                                        )
                                                    }
                                                    register={
                                                        register as (
                                                            field: string,
                                                        ) => {
                                                            [key: string]: any
                                                        }
                                                    }
                                                />
                                                <ServicesWithIncome
                                                    selected={
                                                        watch(
                                                            `dependent.${index}.unemployment`,
                                                        ) ?? ''
                                                    }
                                                    serviceTitle="Unemployment"
                                                    incomeFieldName={`dependent.${index}.unemploymentAid`}
                                                    serviceFieldName={`dependent.${index}.unemployment`}
                                                    setValue={(field, value) =>
                                                        setValue(
                                                            field as keyof FamilyType,
                                                            value,
                                                        )
                                                    }
                                                    register={
                                                        register as (
                                                            field: string,
                                                        ) => {
                                                            [key: string]: any
                                                        }
                                                    }
                                                />
                                                <ServicesWithIncome
                                                    selected={
                                                        watch(
                                                            `dependent.${index}.otherService`,
                                                        ) ?? ''
                                                    }
                                                    serviceTitle="Other"
                                                    incomeFieldName={`dependent.${index}.otherServiceAid`}
                                                    serviceFieldName={`dependent.${index}.otherService`}
                                                    setValue={(field, value) =>
                                                        setValue(
                                                            field as keyof FamilyType,
                                                            value,
                                                        )
                                                    }
                                                    register={
                                                        register as (
                                                            field: string,
                                                        ) => {
                                                            [key: string]: any
                                                        }
                                                    }
                                                />
                                            </div>
                                        </div>
                                        <div className="flex grid grid-cols-2 items-center gap-[12px]">
                                            <div>
                                                <label className="font-['Epilogue'] text-[16px] font-semibold leading-[40px] text-neutral-900">
                                                    Total Income
                                                </label>
                                            </div>
                                            <div className="flex items-center rounded border p-2">
                                                <span className="mr-1 text-neutral-900">
                                                    $
                                                </span>
                                                <input
                                                    {...register(
                                                        `dependent.${index}.totalIncome`,
                                                    )}
                                                    type="text"
                                                    placeholder="Text"
                                                    className="w-full outline-none"
                                                />
                                            </div>
                                        </div>
                                        {invalidIncome.length > 0 && (
                                            <div
                                                style={{
                                                    color: 'red',
                                                    marginTop: '1rem',
                                                }}
                                            >
                                                {invalidIncome
                                                    .filter(
                                                        (msg) =>
                                                            msg.depIndex ===
                                                            index,
                                                    )
                                                    .map((msg, i) => (
                                                        <div key={i}>
                                                            {msg.message}
                                                        </div>
                                                    ))}
                                            </div>
                                        )}
                                    </div>
                                ))}
                                <button
                                    type="button"
                                    onClick={addChild}
                                    disabled={
                                        formType.familySize === undefined ||
                                        formType.familySize === ''
                                    }
                                    className="h-[52px] w-[200px] rounded-[5px] bg-[#27262A] px-4 py-2 text-white disabled:cursor-not-allowed disabled:bg-gray-400"
                                >
                                    + Add dependent
                                </button>
                            </>
                        )}
                    </div>

                    {/* Pets Section */}
                    <div className="flex flex-col space-y-[24px]">
                        <label className={titleStyle}>Pets</label>

                        {watch('pets')?.map((pet, index) => (
                            <div
                                key={index}
                                className="mt-4 space-y-[24px] rounded-[10px] border-[1px] border-solid border-[#DBD8E4] p-[24px]"
                            >
                                <div className="grid grid-cols-2 gap-x-5 gap-y-3">
                                    <label className="font-epilogue text-[22px] font-medium leading-[24px] text-[#1A1D20]">
                                        Pet {index + 1}:
                                    </label>
                                    <div className="flex justify-end">
                                        <button
                                            type="button"
                                            onClick={() => removePet(index)}
                                        >
                                            Remove x
                                        </button>
                                    </div>
                                </div>

                                <div className="flex flex-col space-y-[4px]">
                                    <label className="font-['Epilogue'] text-[16px] font-normal leading-[18px] text-neutral-900">
                                        Species
                                    </label>
                                    <input
                                        {...register(`pets.${index}.species`)}
                                        type="text"
                                        placeholder="Text"
                                        className="w-[40%] rounded border p-2"
                                    />
                                </div>
                                <div className="flex flex-col space-y-[4px]">
                                    <label className="font-['Epilogue'] text-[16px] font-normal leading-[18px] text-neutral-900">
                                        Size
                                    </label>
                                    <RadioChoice
                                        options={PETSIZE}
                                        selectedValue={
                                            watch(`pets.${index}.size`) ?? ''
                                        }
                                        onChange={(updatedSize) =>
                                            setValue(
                                                `pets.${index}.size`,
                                                updatedSize,
                                            )
                                        }
                                        name={`pets.${index}.size`}
                                    />
                                </div>
                                <div className="flex flex-col space-y-[4px]">
                                    <label className="font-['Epilogue'] text-[16px] font-normal leading-[18px] text-neutral-900">
                                        Purpose
                                    </label>
                                    <CheckboxList
                                        options={PETPURPOSE}
                                        selectedValues={(
                                            watch(`pets.${index}.purpose`) ?? []
                                        ).filter(
                                            (purpose) => purpose !== undefined,
                                        )}
                                        onChange={(updatedPurpose) =>
                                            setValue(
                                                `pets.${index}.purpose`,
                                                updatedPurpose ?? [],
                                            )
                                        }
                                        name={`pets.${index}.purpose`}
                                    />
                                </div>
                            </div>
                        ))}
                        <button
                            type="button"
                            onClick={addPet}
                            className="h-[52px] w-[150px] rounded-[5px] bg-[#27262A] px-4 py-2 text-white"
                        >
                            + Add Pet
                        </button>
                    </div>
                    {submitType == 'new' && (
                        <div className="flex justify-between">
                            <button
                                type="button"
                                onClick={() =>
                                    router.push('/intake/background')
                                }
                                className="rounded-[5px] bg-neutral-900 px-4 py-2 text-white"
                            >
                                Back
                            </button>
                            <button
                                type="submit"
                                className="rounded-[5px] bg-neutral-900 px-4 py-2 text-white"
                            >
                                Continue
                            </button>
                        </div>
                    )}

                    {submitType == 'save' && (
                        <div className="flex justify-start space-x-[24px]">
                            <button
                                type="submit"
                                className="rounded-[5px] bg-[#4EA0C9] px-[20px] py-[16px] text-white hover:bg-[#246F95]"
                            >
                                <div className="flex flex-row space-x-[8px]">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        height="20px"
                                        viewBox="0 -960 960 960"
                                        width="20px"
                                        fill="#FFFFFF"
                                    >
                                        <path d="M389-267 195-460l51-52 143 143 325-324 51 51-376 375Z" />
                                    </svg>
                                    Save
                                </div>
                            </button>
                            <button
                                type="button"
                                onClick={onCancel}
                                className="rounded-[5px] bg-[#1A1D20] px-[20px] py-[16px] text-white hover:bg-[#6D757F]"
                            >
                                <div className="flex flex-row space-x-[8px]">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        height="20px"
                                        viewBox="0 -960 960 960"
                                        width="20px"
                                        fill="#FFFFFF"
                                    >
                                        <path d="m291-240-51-51 189-189-189-189 51-51 189 189 189-189 51 51-189 189 189 189-51 51-189-189-189 189Z" />
                                    </svg>
                                    Cancel
                                </div>
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </form>
    )
}
