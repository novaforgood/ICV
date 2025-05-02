'use client'

import { useIntakeFormStore } from '@/app/_lib/useIntakeFormStore'
import {
    FamilySchema,
    GENDER,
    MARITALSTATUS,
    PETPURPOSE,
    PETSIZE,
    YESNO,
} from '@/types/client-types'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { TypeOf } from 'zod'
import {
    CheckboxList,
    RadioChoice,
    RadioWithOther,
    ServicesWithIncome,
} from '../../../../_components/MakeOptions'
interface Props {}

const Page = (props: Props) => {
    const { form: loadedForm, updateForm } = useIntakeFormStore()
    type FamilyType = TypeOf<typeof FamilySchema>
    const [warnings, setWarnings] = useState<string[]>([])
    const [invalidIncome, setInvalidIncome] = useState<string[]>([])

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
        defaultValues: loadedForm,
    })

    const router = useRouter()

    useEffect(() => {
        reset(loadedForm)
    }, [loadedForm, reset])

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
        console.log(loadedForm)
        console.log(errors)

        return unsubscribe
    }, [watch, loadedForm])

    useEffect(() => {
        if (loadedForm.maritalStatus != 'Married' && loadedForm.spouse) {
            removeSpouse()
        }
    }, [loadedForm.maritalStatus])

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

        const familyNum = parseFamSize(loadedForm.familySize)
        console.log('FamilySize as an int', familyNum)

        // default for if a client is not the head of household, and has spouse who is
        let servicedVal = '1'

        if (loadedForm.headOfHousehold === 'No') {
            // if a client is not head of household but has a non-ICV client spouse
            servicedVal = loadedForm.spouseClientStatus === 'Yes' ? '1' : '2'
        } else if (familyNum === 1) {
            servicedVal = '1'
        } else if (loadedForm.spouseClientStatus === 'Yes') {
            servicedVal = (familyNum - 1).toString()
        } else {
            servicedVal = familyNum.toString()
        }
        updateForm({ familyMembersServiced: servicedVal })
        console.log('Serviced', servicedVal)

        // if user filled out spouse info but switches to yes, ICV client, remove spouse info
        if (loadedForm.spouseClientStatus === 'Yes' && loadedForm.spouse) {
            removeSpouse()
        }
    }, [
        loadedForm.spouseClientStatus,
        loadedForm.familySize,
        loadedForm.headOfHousehold,
    ])

    useEffect(() => {
        const warnings: string[] = []

        const parseIncome = (label: string, value: any, depIndex: number) => {
            if (value === undefined || value === '') return 0

            const cleaned = String(value).replace(/,/g, '')
            const num = parseFloat(cleaned)

            if (isNaN(num) || cleaned !== num.toString()) {
                warnings.push(
                    `Dependent ${depIndex + 1}: "${value}" is not a valid income for ${label}.`,
                )
                return 0
            }

            return num
        }

        const updatedDependents = (loadedForm.dependent || []).map(
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
            JSON.stringify(loadedForm.dependent) !==
            JSON.stringify(updatedDependents)

        if (shouldUpdate) {
            setInvalidIncome(warnings)
            updateForm({ ...loadedForm, dependent: updatedDependents })
        }
    }, [loadedForm.dependent])

    const onSubmit = (data: FamilyType) => {
        console.log('in submit...', data)
        updateForm(data)
        router.push('/intake/background/family/services')
    }

    // Function to clear spouse information
    const removeSpouse = () => {
        console.log('Remove in progress!')

        setValue('spouse.spouseFirstName', '')
        setValue('spouse.spouseLastName', '')
        setValue('spouse.spouseDOB', '')
        setValue('spouse.spouseIncome', '')
        setValue('spouse.spouseGender', '')

        setValue('spouse', undefined)
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

    return (
        <form
            className="space-y-[24px]"
            style={{ padding: '24px' }}
            onSubmit={handleSubmit(onSubmit)}
        >
            <div className="flex min-h-screen items-center justify-center">
                <div className="min-w-[800px] space-y-[60px]">
                    <div className="space-y-[24px]">
                        <label className="block text-center font-['Epilogue'] text-[40px] font-bold leading-[56px] text-neutral-900">
                            Family
                        </label>
                    </div>

                    {/* Spouse Section */}
                    <div className="flex flex-col space-y-[24px]">
                        <label className="font-['Epilogue'] text-[28px] font-semibold leading-[40px] text-neutral-900">
                            Spouse
                        </label>
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
                        {loadedForm.maritalStatus === 'Married' && (
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

                        {loadedForm.maritalStatus === 'Married' &&
                        loadedForm.spouseClientStatus === 'No' ? (
                            <div className="relative mt-4 space-y-[24px] rounded-[10px] border-[1px] border-solid border-[#DBD8E4] p-[24px]">
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
                                            {...register(`spouse.spouseDOB`)}
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
                                            watch(`spouse.spouseGender`) ?? ''
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
                        ) : (
                            <></>
                        )}
                    </div>

                    {/* Dependent Section */}
                    <div className="flex flex-col space-y-[24px]">
                        <label className="font-['Epilogue'] text-[28px] font-semibold leading-[40px] text-neutral-900">
                            Dependents
                        </label>
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
                        {watch('dependent')?.map((dependent, index) => (
                            <div
                                key={index}
                                className="relative mt-4 space-y-[24px] rounded-[10px] border-[1px] border-solid border-[#DBD8E4] p-[24px]"
                            >
                                <div className="flex justify-end">
                                    <button
                                        type="button"
                                        onClick={() => removeChild(index)}
                                    >
                                        Remove x
                                    </button>
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
                                        {...register(`dependent.${index}.dob`)}
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
                                                register as (field: string) => {
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
                                                register as (field: string) => {
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
                                                register as (field: string) => {
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
                                                register as (field: string) => {
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
                                                register as (field: string) => {
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
                                                register as (field: string) => {
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
                                                register as (field: string) => {
                                                    [key: string]: any
                                                }
                                            }
                                        />
                                    </div>
                                </div>
                                <div className="flex grid grid-cols-2 items-center gap-[12px]">
                                    <div>
                                        <label className="font-['Epilogue'] text-[28px] font-semibold leading-[40px] text-neutral-900">
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
                                            .filter((msg, i) => i === index)
                                            .map((msg, i) => (
                                                <div key={i}>{msg}</div>
                                            ))}
                                    </div>
                                )}
                            </div>
                        ))}
                        <button
                            type="button"
                            onClick={addChild}
                            disabled={
                                loadedForm.familySize === undefined ||
                                loadedForm.familySize === ''
                            }
                            className="h-[52px] w-[200px] rounded-[5px] bg-[#27262A] px-4 py-2 text-white disabled:cursor-not-allowed disabled:bg-gray-400"
                        >
                            + Add dependent
                        </button>
                    </div>

                    {/* Pets Section */}
                    <div className="flex flex-col space-y-[24px]">
                        <label className="font-['Epilogue'] text-[28px] font-semibold leading-[40px] text-neutral-900">
                            Pets
                        </label>

                        {watch('pets')?.map((pet, index) => (
                            <div
                                key={index}
                                className="relative mt-4 space-y-[24px] rounded-[10px] border-[1px] border-solid border-[#DBD8E4] p-[24px]"
                            >
                                <div className="flex justify-end">
                                    <button
                                        type="button"
                                        onClick={() => removePet(index)}
                                    >
                                        Remove x
                                    </button>
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
                    <div className="flex justify-between">
                        <button
                            type="button"
                            onClick={() => router.push('/intake/background')}
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
                </div>
            </div>
        </form>
    )
}

export default Page
