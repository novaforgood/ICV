'use client'

import { BasicIntakeSchema } from '@/types/client-types'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { TypeOf } from 'zod'
import { useIntakeFormStore } from '../lib/useIntakeFormStore'

interface Props {}

const Page = (props: Props) => {
    const { form: loadedForm, updateForm } = useIntakeFormStore()
    type BasicIntakeType = TypeOf<typeof BasicIntakeSchema>

    const {
        register,
        handleSubmit,
        watch,
        reset,
        formState: { errors },
    } = useForm<BasicIntakeType>({
        mode: 'onChange',
        resolver: zodResolver(BasicIntakeSchema),
        defaultValues: loadedForm,
    })

    const router = useRouter()

    useEffect(() => {
        // console.log('loadedForm', loadedForm)
        reset(loadedForm)
    }, [loadedForm, reset])

    useEffect(() => {
        const unsubscribe = watch((data) => {
            updateForm(data)
        }).unsubscribe
        console.log(loadedForm)
        console.log(errors)

        return unsubscribe
    }, [watch, loadedForm])

    const onSubmit = (data: BasicIntakeType) => {
        console.log('in submit...')
        updateForm(data)
        router.push('/intake/demographics')
    }

    return (
        <form
            className="space-y-4"
            style={{ padding: '50px' }}
            onSubmit={handleSubmit(onSubmit)}
        >
            {/* Basic client details */}
            <div className="flex space-x-5">
                {/* Client management */}
                <div className="flex space-x-5">
                    <div>
                        <label>Assigned Client Manager</label>
                        <input
                            {...register('assignedClientManager')}
                            type="text"
                            placeholder="Assigned Client Manager"
                            className="w-full rounded border p-2"
                        />
                    </div>
                    {/* <div>
                        <label>Assigned Date</label>
                        <input
                            {...register('assignedDate')}
                            type="date"
                            className="w-full rounded border p-2"
                        />
                    </div> */}
                    <div>
                        <label>Status</label>
                        <select
                            {...register('status')}
                            className="w-full rounded border p-2"
                        >
                            <option value="Active">Active</option>
                            <option value="Inactive">Inactive</option>
                        </select>
                    </div>
                </div>
            </div>

            <label>Client Info:</label>
            <div className="flex space-x-5">
                <div>
                    <label>Last Name</label>
                    <input
                        {...register('lastName')}
                        type="text"
                        placeholder="Last Name"
                        className="w-full rounded border p-2"
                    />
                </div>
                <div>
                    <label>First Name</label>
                    <input
                        {...register('firstName')}
                        type="text"
                        placeholder="First Name"
                        className="w-full rounded border p-2"
                    />
                </div>
                <div>
                    <label>Middle Initial</label>
                    <input
                        {...register('middleInitial')}
                        type="text"
                        placeholder="Middle Initial"
                        className="w-full rounded border p-2"
                    />
                </div>
            </div>

            <div className="flex space-x-5">
                {/* <div>
                    <label>Date of Birth</label>
                    <input
                        {...register('dateOfBirth', {
                            valueAsDate: true,
                        })}
                        type="date"
                        className="w-full rounded border p-2"
                    />
                </div> */}
                <div>
                    <label>Age</label>
                    <input
                        {...register('age', {
                            // valueAsNumber: true,
                            setValueAs: (v) => (v === '' ? 0 : parseInt(v, 10)),
                        })}
                        type="number"
                        placeholder="Age"
                        className="w-full rounded border p-2"
                    />
                </div>
                <div>
                    <label>Gender</label>
                    <select
                        {...register('gender')}
                        className="w-full rounded border p-2"
                    >
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                    </select>
                </div>
                <div>
                    <label>Other Gender</label>
                    <input
                        {...register('otherGender')}
                        type="text"
                        placeholder="Other Gender"
                        className="w-full rounded border p-2"
                    />
                </div>
                <div>
                    <label>Phone Number</label>
                    <input
                        {...register('phoneNumber')}
                        type="text"
                        placeholder="Phone Number"
                        className="w-full rounded border p-2"
                    />
                </div>
                <div>
                    <label>Email</label>
                    <input
                        {...register('email')}
                        type="email"
                        placeholder="Email"
                        className="w-full rounded border p-2"
                    />
                </div>
            </div>

            <label>Housing:</label>
            {/* Location and contact details */}
            <div className="flex space-x-5">
                <div>
                    <label>Street Address</label>
                    <input
                        {...register('address')}
                        type="text"
                        placeholder="Address"
                        className="w-full rounded border p-2"
                    />
                    {errors.address && (
                        <span className="mt-1 text-sm text-red-500">
                            {(errors.address as any)?.message}
                        </span>
                    )}
                </div>
                <div>
                    <label>City</label>
                    <input
                        {...register('city')}
                        type="text"
                        placeholder="City"
                        className="w-full rounded border p-2"
                    />
                    {errors.city && (
                        <span className="mt-1 text-sm text-red-500">
                            {(errors.city as any)?.message}
                        </span>
                    )}
                </div>
                <div>
                    <label>Zip Code</label>
                    <input
                        {...register('zipCode')}
                        type="text"
                        placeholder="Zip Code"
                        className="w-full rounded border p-2"
                    />
                </div>
                <div>
                    <label>Apt Number</label>
                    <input
                        {...register('aptNumber')}
                        type="text"
                        placeholder="Apt Number"
                        className="w-full rounded border p-2"
                    />
                </div>
            </div>

            <button
                type="submit"
                className="mt-4 rounded bg-blue-500 p-2 text-white"
            >
                Next
            </button>
        </form>
    )
}

export default Page
