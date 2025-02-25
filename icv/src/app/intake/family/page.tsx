'use client'

import { FamilySchema, Pets } from '@/types/client-types'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { TypeOf } from 'zod'
import { useIntakeFormStore } from '../../lib/useIntakeFormStore'

interface Props {}

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
                children: data.children?.filter((child) => child !== undefined),
                pets: data.pets?.filter((pet) => pet !== undefined),
            })
        }).unsubscribe
        console.log(loadedForm)
        console.log(errors)

        return unsubscribe
    }, [watch, loadedForm])

    const onSubmit = (data: FamilyType) => {
        console.log('in submit...', data)
        updateForm(data)
        router.push('/intake/background')
    }

    const addSpouse = () => {
        const currentSpouse = getValues('spouse') || []
        const newSpouse = {
            spouseFirstName: '',
            spouseLastName: '',
            spouseDOB: '',
            spouseAge: '',
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
        const currentChildren = getValues('children') || []
        const newChild = { name: '', age: undefined }
        setValue('children', [...currentChildren, newChild])
    }

    // Function to remove a child
    const removeChild = (index: number) => {
        const currentChildren = getValues('children')
        if (currentChildren) {
            currentChildren.splice(index, 1)
        }
        setValue('children', [...(currentChildren || [])])
    }

    // Function to add a pet
    const addPet = () => {
        const currentPets = getValues('pets') || []
        const newPet = { breed: undefined }
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
            className="space-y-4"
            style={{ padding: '50px' }}
            onSubmit={handleSubmit(onSubmit)}
        >
            <div>
                <label className="bold text-3xl">Intake Form</label>
            </div>
            <div className="space-y-8">
                <div className="space-y-4">
                    <label className="bold text-2xl">Family</label>
                    <div className="flex flex-col">
                        <label>Family Size</label>
                        <input
                            {...register('familySize')}
                            type="text"
                            placeholder="Text"
                            className="w-[50%] rounded border p-2"
                        />
                    </div>
                </div>

                {/* Spouse Section */}
                <div className="flex flex-col">
                    <label>Spouse</label>
                    <button
                        type="button"
                        onClick={addSpouse}
                        className="mt-4 w-auto self-start rounded bg-blue-900 px-4 py-2 text-white"
                    >
                        + Add Spouse
                    </button>

                    {watch('spouse')?.map((spouse, index) => (
                        <div key={index} className="mt-4 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                {/* First Name and Last Name on the same line */}
                                <div className="flex flex-col">
                                    <label>
                                        Spouse {index + 1}: First Name
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
                                <div className="flex flex-col">
                                    <label>Spouse {index + 1}: Last Name</label>
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
                                {/* Date of Birth and Age on the same line */}
                                <div className="flex flex-col">
                                    <label>
                                        Spouse {index + 1}: Date of Birth
                                    </label>
                                    <input
                                        {...register(
                                            `spouse.${index}.spouseDOB`,
                                        )}
                                        type="date"
                                        className="w-full rounded border p-2"
                                    />
                                </div>
                                <div className="flex flex-col">
                                    <label>Spouse {index + 1}: Age</label>
                                    <input
                                        {...register(
                                            `spouse.${index}.spouseAge`,
                                        )}
                                        type="text"
                                        placeholder="Age"
                                        className="w-full rounded border p-2"
                                    />
                                </div>
                            </div>

                            <button
                                type="button"
                                onClick={() => removeSpouse(index)}
                                className="mt-4 rounded bg-red-900 p-2 text-white"
                            >
                                - Remove Spouse
                            </button>
                        </div>
                    ))}
                </div>

                {/* Children Section */}
                <div className="flex flex-col">
                    <label>Children</label>
                    <button
                        type="button"
                        onClick={addChild}
                        className="mt-4 w-auto self-start rounded bg-blue-900 px-4 py-2 text-white"
                    >
                        + Add Child
                    </button>

                    {watch('children')?.map((child, index) => (
                        <div key={index} className="mt-4 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="flex flex-col">
                                    <label>Child {index + 1}: Name</label>
                                    <input
                                        {...register(`children.${index}.name`)}
                                        placeholder="Text"
                                        className="w-full rounded border p-2"
                                    />
                                </div>
                                <div className="flex flex-col">
                                    <label>Child {index + 1}: Age</label>
                                    <input
                                        {...register(`children.${index}.age`)}
                                        placeholder="Text"
                                        className="w-[30%] rounded border p-2"
                                    />
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={() => removeChild(index)}
                                className="mt-4 rounded bg-red-900 p-2 text-white"
                            >
                                - Remove Child
                            </button>
                        </div>
                    ))}
                </div>

                {/* Pets Section */}
                <div className="flex flex-col">
                    <label>Pets</label>
                    <button
                        type="button"
                        onClick={addPet}
                        className="mt-4 w-auto self-start rounded bg-blue-900 px-4 py-2 text-white"
                    >
                        + Add Pet
                    </button>

                    {watch('pets')?.map((pet, index) => (
                        <div key={index} className="mt-4 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="flex flex-col">
                                    <label>Pet {index + 1}: Breed</label>
                                    <select
                                        {...register(`pets.${index}.breed`)}
                                        className="w-full rounded border p-2"
                                    >
                                        <option value="">Select Breed</option>
                                        {Pets.options.map((breed) => (
                                            <option key={breed} value={breed}>
                                                {breed}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={() => removePet(index)}
                                className="mt-4 rounded bg-red-900 p-2 text-white"
                            >
                                - Remove Pet
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            <div className="flex justify-between">
                <button
                    type="button"
                    onClick={() => router.push('/intake/background')}
                    className="mt-4 rounded bg-blue-500 p-2 text-white"
                >
                    Back
                </button>
                <button
                    type="submit"
                    className="mt-4 rounded bg-blue-500 p-2 text-white"
                >
                    Continue
                </button>
            </div>
        </form>
    )
}

export default Page
