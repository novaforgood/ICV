'use client'

import { useIntakeFormStore } from '@/app/_lib/useIntakeFormStore'
import { FamilySchema } from '@/types/client-types'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { TypeOf } from 'zod'
import {
    CheckboxList,
    CheckboxListWithOther,
    RadioChoice,
    RadioWithOther,
} from '../components/MakeOptions'
interface Props {}

const GENDER = ['Male', 'Female', 'Nonbinary']
const PUBLIC_SERVICES = [
    'General Relief',
    'CalFresh (Food Stamps/EBT)',
    'CalWorks',
    'SSI',
    'SSA',
    'Unemployment Benefits',
]
const PETSIZE = ['Small', 'Medium', 'Large']
const PURPOSE = ['Emotional support animal', 'Service animal']

const Page = (props: Props) => {
    const { form: loadedForm, updateForm } = useIntakeFormStore()
    type FamilyType = TypeOf<typeof FamilySchema>

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
                spouse: data.spouse?.filter((spouse) => spouse !== undefined),
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

    const onSubmit = (data: FamilyType) => {
        console.log('in submit...', data)
        updateForm(data)
        router.push('/intake/family/background')
    }

    const addSpouse = () => {
        const currentSpouse = getValues('spouse') || []
        const newSpouse = {
            spouseFirstName: '',
            spouseLastName: '',
            spouseDOB: '',
            spouseIncome: '',
        }
        setValue('spouse', [...currentSpouse, newSpouse])
    }

    // Function to remove a child
    const removeSpouse = (index: number) => {
        const currentSpouse = getValues('spouse')
        if (currentSpouse) {
            currentSpouse.splice(index, 1)
        }
        setValue('spouse', [...(currentSpouse || [])])
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
                    </div>

                    {/* Spouse Section */}
                    <div className="flex flex-col space-y-[24px]">
                        <label className="font-['Epilogue'] text-[28px] font-semibold leading-[40px] text-neutral-900">
                            Spouse
                        </label>
                        {watch('spouse')?.map((spouse, index) => (
                            <div
                                key={index}
                                className="relative mt-4 space-y-[24px] rounded-[10px] border-[1px] border-solid border-[#DBD8E4] p-[24px]"
                            >
                                <div className="flex justify-end">
                                    <button
                                        type="button"
                                        onClick={() => removeSpouse(index)}
                                    >
                                        Remove x
                                    </button>
                                </div>

                                <div className="grid grid-cols-2 gap-[12px]">
                                    <div className="flex flex-col space-y-[4px]">
                                        <label className="font-['Epilogue'] text-[16px] font-normal leading-[18px] text-neutral-900">
                                            First Name
                                        </label>
                                        <input
                                            {...register(
                                                `spouse.${index}.spouseFirstName`,
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
                                                `spouse.${index}.spouseLastName`,
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
                                                `spouse.${index}.spouseDOB`,
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
                                                    `spouse.${index}.spouseIncome`,
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
                                            watch(
                                                `spouse.${index}.spouseGender`,
                                            ) ?? ''
                                        }
                                        onChange={(updatedGender) =>
                                            setValue(
                                                `spouse.${index}.spouseGender`,
                                                updatedGender,
                                            )
                                        }
                                        name={`spouse.${index}.spouseGender`}
                                        otherLabel="Other"
                                        otherPlaceholder="Other"
                                    />
                                </div>
                            </div>
                        ))}
                        <button
                            type="button"
                            onClick={addSpouse}
                            className="h-[52px] w-[150px] rounded-[5px] bg-[#27262A] px-4 py-2 text-white"
                        >
                            + Add Spouse
                        </button>
                    </div>

                    {/* Dependent Section */}
                    <div className="flex flex-col space-y-[24px]">
                        <label className="font-['Epilogue'] text-[28px] font-semibold leading-[40px] text-neutral-900">
                            Dependent
                        </label>
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

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="flex flex-col space-y-[4px]">
                                        <label className="font-['Epilogue'] text-[16px] font-normal leading-[18px] text-neutral-900">
                                            Date of Birth
                                        </label>
                                        <input
                                            {...register(
                                                `dependent.${index}.dob`,
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
                                                    `dependent.${index}.income`,
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
                                <div className="flex flex-col space-y-[4px]">
                                    <label className="font-['Epilogue'] text-[16px] font-normal leading-[18px] text-neutral-900">
                                        Public Services?
                                    </label>
                                    <div className="flex flex-col space-y-[8px]">
                                        <CheckboxListWithOther
                                            options={PUBLIC_SERVICES}
                                            selectedValues={(
                                                watch(
                                                    `dependent.${index}.publicServices`,
                                                ) ?? []
                                            ).filter(
                                                (service) =>
                                                    service !== undefined,
                                            )}
                                            onChange={(updatedServices) =>
                                                setValue(
                                                    `dependent.${index}.publicServices`,
                                                    updatedServices,
                                                )
                                            }
                                            name="services"
                                            otherLabel="Other"
                                            otherPlaceholder="Other"
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                        <button
                            type="button"
                            onClick={addChild}
                            className="h-[52px] w-[200px] rounded-[5px] bg-[#27262A] px-4 py-2 text-white"
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
                                        options={PURPOSE}
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
                            onClick={() => router.push('/intake')}
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
