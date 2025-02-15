'use client'

import { BackgroundSchema, Ethnicity } from '@/types/client-types'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { TypeOf } from 'zod'
import { useIntakeFormStore } from '../../lib/useIntakeFormStore'

interface Props {}

const Page = (props: Props) => {
    const { form: loadedForm, updateForm } = useIntakeFormStore()
    type BackgroundInfoType = TypeOf<typeof BackgroundSchema>

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<BackgroundInfoType>({
        mode: 'onChange',
        resolver: zodResolver(BackgroundSchema),
        defaultValues: loadedForm,
    })

    const router = useRouter()

    useEffect(() => {
        reset(loadedForm)
    }, [loadedForm, reset])

    const onSubmit = (data: BackgroundInfoType) => {
        console.log('in submit...', data)
        // updateForm(data)
        router.push('/intake/demographics')
    }

    const publicServiceOptions: {
        key:
            | 'generalRelief'
            | 'calFresh'
            | 'calWorks'
            | 'ssi'
            | 'ssa'
            | 'unemployment'
            | 'other'
        label: string
    }[] = [
        { key: 'generalRelief', label: 'General Relief' },
        { key: 'calFresh', label: 'CalFresh (Food Stamps/EBT)' },
        { key: 'calWorks', label: 'CalWorks' },
        { key: 'ssi', label: 'SSI (Supplemental Security Income)' },
        { key: 'ssa', label: 'SSA (Social Security Administration)' },
        { key: 'unemployment', label: 'Unemployment Benefits' },
        { key: 'other', label: 'Other' },
    ]

    return (
        <form
            className="space-y-4"
            style={{ padding: '50px' }}
            onSubmit={handleSubmit(onSubmit)}
        >
            <div className="space-y-10">
                {/* Demographics */}
                <div className="flex items-start space-x-20">
                    <label className="w-32 font-semibold">Demographic</label>
                    <div>
                        <label className="mb-2 block font-semibold">
                            Ethnicity?
                        </label>
                        <div className="flex flex-col space-y-2">
                            {Ethnicity.options.map((option) => (
                                <div
                                    key={option}
                                    className="flex items-center space-x-2"
                                >
                                    <input
                                        {...register('ethnicity')}
                                        type="checkbox"
                                        value={option}
                                        id={option}
                                    />
                                    <label htmlFor={option}>{option}</label>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Public Services */}
                <div className="flex items-start space-x-20">
                    <label className="w-32 font-semibold">
                        Public Services
                    </label>
                    <div>
                        <label className="mb-2 block font-semibold">
                            Public Services?
                        </label>
                        <div className="flex flex-col space-y-2">
                            {publicServiceOptions.map(({ key, label }) => (
                                <div
                                    key={key}
                                    className="flex items-center space-x-2"
                                >
                                    <input
                                        type="checkbox"
                                        id={key}
                                        {...register(
                                            `publicServices.${key}` as const,
                                        )}
                                    />
                                    <label htmlFor={key}>{label}</label>
                                </div>
                            ))}
                        </div>
                    </div>
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
