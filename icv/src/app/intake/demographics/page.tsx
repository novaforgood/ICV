'use client'

import { DemographicIntakeSchema } from '@/types/client-types'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { TypeOf } from 'zod'
import { useIntakeFormStore } from '../../lib/useIntakeFormStore'

interface Props {}

const Page = (props: Props) => {
    const { form: loadedForm, updateForm } = useIntakeFormStore()
    type DemographicIntakeType = TypeOf<typeof DemographicIntakeSchema>

    const {
        register,
        handleSubmit,
        watch,
        reset,
        formState: { errors },
    } = useForm<DemographicIntakeType>({
        mode: 'onChange',
        resolver: zodResolver(DemographicIntakeSchema),
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

    const onSubmit = (data: DemographicIntakeType) => {
        updateForm(data)
        router.push('/intake/assessment')
    }
    return (
        <div>
            <form
                className="space-y-4"
                style={{ padding: '50px' }}
                onSubmit={handleSubmit(onSubmit)}
            >
                {/* Spouse information */}
                <div className="flex space-x-5">
                    <div>
                        <label>Spouse Name</label>
                        <input
                            {...register('spouseName')}
                            type="text"
                            placeholder="Spouse Name"
                            className="w-full rounded border p-2"
                        />
                    </div>
                    {/* <div>
                        <label>Spouse Age</label>
                        <input
                            {...register('spouseAge')}
                            type="number"
                            placeholder="Spouse Age"
                            className="w-full rounded border p-2"
                        />
                    </div> */}
                    {/* <div>
                        <label>Spouse Gender</label>
                        <select
                            {...register('spouseGender')}
                            className="w-full rounded border p-2"
                        >
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                        </select>
                    </div> */}
                    {/* <div>
                        <label>Spouse Other Gender</label>
                        <input
                            {...register('spouseOtherGender')}
                            type="text"
                            placeholder="Spouse Other Gender"
                            className="w-full rounded border p-2"
                        />
                    </div> */}
                </div>

                {/* Family and demographic details */}
                <div className="flex space-x-5">
                    {/* <div>
                        <label>Family Size</label>
                        <input
                            {...register('familySize')}
                            type="number"
                            placeholder="Family Size"
                            className="w-full rounded border p-2"
                        />
                    </div> */}
                    {/* <div>
                        <label>Number of Children</label>
                        <input
                            {...register('numberOfChildren')}
                            type="number"
                            placeholder="Number of Children"
                            className="w-full rounded border p-2"
                        />
                    </div> */}
                    {/* <div>
                        <label>Ethnicity</label>
                        <select
                            {...register('ethnicity')}
                            className="w-full rounded border p-2"
                        >
                            <option value="African American">
                                African American
                            </option>
                            <option value="Asian">Asian</option>
                            <option value="Latino/Hispanic">
                                Latino/Hispanic
                            </option>
                            <option value="Native American">
                                Native American
                            </option>
                            <option value="White/Caucasian">
                                White/Caucasian
                            </option>
                            <option value="Other">Other</option>
                        </select>
                    </div> */}
                </div>

                {/* Public services information */}
                {/* <div className="flex space-x-5">
                    <div className="space-x-2">
                        <label>General Relief</label>
                        <input
                            {...register('publicServices.generalRelief')}
                            type="checkbox"
                        />
                    </div>
                    <div className="space-x-2">
                        <label>Cal Fresh</label>
                        <input
                            {...register('publicServices.calFresh')}
                            type="checkbox"
                        />
                    </div>
                    <div className="space-x-2">
                        <label>Cal Works</label>
                        <input
                            {...register('publicServices.calWorks')}
                            type="checkbox"
                        />
                    </div>
                    <div className="space-x-2">
                        <label>SSI</label>
                        <input
                            {...register('publicServices.ssi')}
                            type="checkbox"
                        />
                    </div>
                    <div className="space-x-2">
                        <label>SSA</label>
                        <input
                            {...register('publicServices.ssa')}
                            type="checkbox"
                        />
                    </div>
                    <div className="space-x-2">
                        <label>Unemployment</label>
                        <input
                            {...register('publicServices.unemployment')}
                            type="checkbox"
                        />
                    </div> */}
                {/* </div> */}
                <div className="space-x-4">
                    <button
                        type="button"
                        onClick={() => router.push('/intake')}
                        className="mt-4 rounded bg-blue-500 p-2 text-white"
                    >
                        Back
                    </button>
                    <button
                        type="submit"
                        className="mt-4 rounded bg-blue-500 p-2 text-white"
                    >
                        Next
                    </button>
                </div>
            </form>
        </div>
    )
}

export default Page
