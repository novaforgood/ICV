'use client'

import { BackgroundSchema } from '@/types/client-types'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { TypeOf } from 'zod'
import { useNewIntake } from '../../lib/useNewIntake'
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
    const { form: loadedForm, updateForm } = useNewIntake()
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
            className="space-y-4"
            style={{ padding: '50px' }}
            onSubmit={handleSubmit(onSubmit)}
        >
            <div className="space-y-8">
                <label className="bold text-2xl">Background</label>
                {/* Demographics */}
                <div>
                    <label>Ethnicity</label>
                    <div className="flex flex-col space-y-2">
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
                <div>
                    <label>Mental Health History</label>
                    <div>
                        <textarea
                            {...register('mentalHealth')}
                            placeholder="Text"
                            className="w-[80%] rounded border p-2"
                        />
                    </div>
                </div>
                <div>
                    <label>Disabilities</label>
                    <div>
                        <textarea
                            {...register('disabilities')}
                            placeholder="Text"
                            className="w-[80%] rounded border p-2"
                        />
                    </div>
                </div>
                <div>
                    <label>Substance Abuse History</label>
                    <div>
                        <textarea
                            {...register('substanceAbuse')}
                            placeholder="Text"
                            className="w-[80%] rounded border p-2"
                        />
                    </div>
                </div>
                <div>
                    <label>Sexual Offense History</label>
                    <div>
                        <textarea
                            {...register('sexualOffenses')}
                            placeholder="Text"
                            className="w-[80%] rounded border p-2"
                        />
                    </div>
                </div>
                {/* Public Services */}
                <div>
                    <label>Public Services</label>
                    <div className="flex flex-col space-y-2">
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
