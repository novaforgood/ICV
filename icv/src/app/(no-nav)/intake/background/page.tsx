'use client'

import { BackgroundSchema } from '@/types/client-types'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { TypeOf } from 'zod'
import { useIntakeFormStore } from '../../../_lib/useIntakeFormStore'
import { CheckboxListWithOther } from '../components/MakeOptions'

interface Props {}

const PUBLIC_SERVICES = [
    'General Relief',
    'CalFresh (Food Stamps/EBT)',
    'CalWorks',
    'SSI',
    'SSA',
    'Unemployment Benefits',
]

const ETHNICITY = [
    'White',
    'Black or African American',
    'Hispanic, Latino, or Spanish Origin',
    'Asian',
    'Native American',
    'Middle Eastern',
    'Hawaiian or Pacific Islander',
]

const Page = (props: Props) => {
    const { form: loadedForm, updateForm } = useIntakeFormStore()
    type BackgroundInfoType = TypeOf<typeof BackgroundSchema>

    const {
        register,
        handleSubmit,
        reset,
        watch,
        setValue,
        formState: { errors },
    } = useForm<BackgroundInfoType>({
        mode: 'onChange',
        resolver: zodResolver(BackgroundSchema),
        defaultValues: loadedForm,
    })

    const router = useRouter()
    const selectedServices = watch('publicServices') ?? []
    const selectedEthnicities = Array.isArray(watch('ethnicity'))
        ? (watch('ethnicity') ?? [])
        : []

    useEffect(() => {
        reset(loadedForm)
    }, [loadedForm, reset])

    useEffect(() => {
        const unsubscribe = watch((data) => {
            updateForm({
                ...data,
                publicServices: data.publicServices?.filter(
                    (service): service is string => !!service,
                ),
                ethnicity: data.ethnicity?.filter(
                    (eth): eth is string => !!eth,
                ),
            })
        }).unsubscribe
        console.log(loadedForm)
        console.log(errors)

        return unsubscribe
    }, [watch, loadedForm])

    const onSubmit = (data: BackgroundInfoType) => {
        console.log('in submit...', data)
        updateForm(data)
        router.push('/intake/services')
    }

    return (
        <form
            className="space-y-[24px]"
            style={{ padding: '24px' }}
            onSubmit={handleSubmit(onSubmit)}
        >
            <div className="space-y-[24px]">
                <label className="font-['Epilogue'] text-[56px] font-bold leading-[72px] text-neutral-900">
                    Intake Form
                </label>
            </div>
            <div className="flex min-h-screen items-center justify-center">
                <div className="min-w-[800px] space-y-[48px]">
                    <label className="font-['Epilogue'] text-[40px] font-bold leading-[56px] text-neutral-900">
                        Background
                    </label>
                    <div className="space-y-[8px]">
                        {/* Demographics */}
                        <label className="font-['Epilogue'] text-[16px] font-normal leading-[18px] text-neutral-900">
                            Ethnicity
                        </label>
                        <div className="flex flex-col space-y-[8px]">
                            <CheckboxListWithOther
                                options={ETHNICITY}
                                selectedValues={selectedEthnicities}
                                onChange={(updatedEthnicities) =>
                                    setValue('ethnicity', updatedEthnicities)
                                }
                                name="ethnicity"
                                otherLabel="Other"
                                otherPlaceholder="Specify other ethnicity"
                            />
                        </div>
                    </div>
                    {/* Health Information */}
                    <div className="space-y-[8px]">
                        <label className="font-['Epilogue'] text-[28px] font-semibold leading-[40px] text-neutral-900">
                            Mental Health History
                        </label>
                        <div>
                            <textarea
                                {...register('mentalHealth')}
                                placeholder="Text"
                                className="w-[80%] rounded border p-2"
                            />
                        </div>
                    </div>
                    <div className="space-y-[8px]">
                        <label className="font-['Epilogue'] text-[28px] font-semibold leading-[40px] text-neutral-900">
                            Disabilities
                        </label>
                        <div>
                            <textarea
                                {...register('disabilities')}
                                placeholder="Text"
                                className="w-[80%] rounded border p-2"
                            />
                        </div>
                    </div>
                    <div className="space-y-[8px]">
                        <label className="font-['Epilogue'] text-[28px] font-semibold leading-[40px] text-neutral-900">
                            Substance Abuse History
                        </label>
                        <div>
                            <textarea
                                {...register('substanceAbuse')}
                                placeholder="Text"
                                className="w-[80%] rounded border p-2"
                            />
                        </div>
                    </div>
                    <div className="space-y-[8px]">
                        <label className="font-['Epilogue'] text-[28px] font-semibold leading-[40px] text-neutral-900">
                            Sexual Offense History
                        </label>
                        <div>
                            <textarea
                                {...register('sexualOffenses')}
                                placeholder="Text"
                                className="w-[80%] rounded border p-2"
                            />
                        </div>
                    </div>
                    {/* Public Services */}
                    <div className="space-y-[8px]">
                        <label className="font-['Epilogue'] text-[16px] font-normal leading-[18px] text-neutral-900">
                            Public Services
                        </label>
                        <div className="flex flex-col space-y-[8px]">
                            <CheckboxListWithOther
                                options={PUBLIC_SERVICES}
                                selectedValues={selectedServices}
                                onChange={(updatedServices) =>
                                    setValue('publicServices', updatedServices)
                                }
                                name="services"
                                otherLabel="Other"
                                otherPlaceholder="Specify other service"
                            />
                        </div>
                    </div>

                    <div className="flex justify-between">
                        <button
                            type="button"
                            onClick={() => router.push('/intake/family')}
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
