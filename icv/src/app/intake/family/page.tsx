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
            <div className="space-y-8">
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

                <div className="flex flex-col">
                    <label>Spouse</label>
                    <div className="mt-2 flex flex-col gap-2">
                        <label className="flex items-center gap-2">
                            <input type="checkbox" {...register('hasSpouse')} />
                            Yes
                        </label>
                        <label className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                checked={!watch('hasSpouse')}
                                onChange={() => {
                                    setValue('hasSpouse', false) // Set to 'No'
                                    // Reset spouse information when 'No' is selected
                                    setValue('spouseFirstName', '')
                                    setValue('spouseLastName', '')
                                    setValue('spouseDOB', '')
                                    setValue('spouseAge', undefined)
                                }}
                            />
                            No
                        </label>
                    </div>

                    {watch('hasSpouse') && (
                        <div className="mt-6 space-y-5">
                            <div className="space-y-4">
                                {/* First Name and Last Name on the same row */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="flex flex-col">
                                        <label>Spouse First Name</label>
                                        <input
                                            {...register('spouseFirstName')}
                                            type="text"
                                            placeholder="First Name"
                                            className="w-full rounded border p-2"
                                        />
                                    </div>
                                    <div className="flex flex-col">
                                        <label>Spouse Last Name</label>
                                        <input
                                            {...register('spouseLastName')}
                                            type="text"
                                            placeholder="Last Name"
                                            className="w-full rounded border p-2"
                                        />
                                    </div>
                                </div>

                                {/* Date of Birth and Age on the same row */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="flex flex-col">
                                        <label>Spouse Date of Birth</label>
                                        <input
                                            {...register('spouseDOB')}
                                            type="date"
                                            className="w-full rounded border p-2"
                                        />
                                    </div>
                                    <div className="flex flex-col">
                                        <label>Spouse Age</label>
                                        <input
                                            {...register('spouseAge')}
                                            type="text"
                                            placeholder="Text"
                                            className="w-full rounded border p-2"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Children Section */}
                <div className="flex flex-col">
                    <label>Children</label>
                    <button
                        type="button"
                        onClick={addChild}
                        className="mt-4 w-auto self-start rounded bg-blue-500 px-4 py-2 text-white"
                    >
                        Add Child
                    </button>

                    {watch('children')?.map((child, index) => (
                        <div key={index} className="mt-4 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="flex flex-col">
                                    <label>Child {index + 1} Name</label>
                                    <input
                                        {...register(`children.${index}.name`)}
                                        placeholder="Text"
                                        className="w-full rounded border p-2"
                                    />
                                </div>
                                <div className="flex flex-col">
                                    <label>Child {index + 1} Age</label>
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
                                className="mt-4 rounded bg-blue-500 p-2 text-white"
                            >
                                Remove Child
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
                        className="mt-4 w-auto self-start rounded bg-blue-500 px-4 py-2 text-white"
                    >
                        Add Pet
                    </button>

                    {watch('pets')?.map((pet, index) => (
                        <div key={index} className="mt-4 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="flex flex-col">
                                    <label>Pet {index + 1} Breed</label>
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
                                className="mt-4 rounded bg-blue-500 p-2 text-white"
                            >
                                Remove Pet
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            <button
                type="submit"
                className="mt-4 rounded bg-blue-500 p-2 text-white"
            >
                Continue
            </button>
        </form>
    )
}

export default Page
