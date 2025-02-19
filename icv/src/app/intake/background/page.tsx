'use client'

import { BackgroundSchema } from '@/types/client-types'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { TypeOf } from 'zod'
import { useNewIntake } from '../../lib/useNewIntake'

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
    const otherService =
        selectedServices.find((s) => !PUBLIC_SERVICES.includes(s)) ?? ''

    const selectedEthnicities = Array.isArray(watch('ethnicity'))
        ? (watch('ethnicity') ?? [])
        : []
    const otherEthnicity =
        selectedEthnicities.find((s) => !ETHNICITY.includes(s)) ?? ''

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
        // updateForm(data)
        router.push('/intake/demographics')
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
                        {ETHNICITY.map((ethnicity) => (
                            <div
                                key={ethnicity}
                                className="flex items-center space-x-2"
                            >
                                <input
                                    type="checkbox"
                                    value={ethnicity}
                                    checked={selectedEthnicities.includes(
                                        ethnicity,
                                    )}
                                    onChange={(e) => {
                                        const updatedEthnicities = e.target
                                            .checked
                                            ? [
                                                  ...selectedEthnicities,
                                                  ethnicity,
                                              ]
                                            : selectedEthnicities.filter(
                                                  (e) => e !== ethnicity,
                                              )

                                        setValue(
                                            'ethnicity',
                                            updatedEthnicities.length > 0
                                                ? updatedEthnicities
                                                : undefined,
                                        )
                                    }}
                                    id={ethnicity}
                                />
                                <label htmlFor={ethnicity}>{ethnicity}</label>
                            </div>
                        ))}
                        <div className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                checked={!!otherEthnicity} // Keep checked if there is input
                                onChange={(e) => {
                                    if (!e.target.checked) {
                                        // Remove "Other" when unchecked
                                        setValue(
                                            'ethnicity',
                                            selectedEthnicities.filter((e) =>
                                                ETHNICITY.includes(e),
                                            ),
                                        )
                                    } else {
                                        // Keep "Other" as an identifiable placeholder
                                        setValue('ethnicity', [
                                            ...selectedEthnicities,
                                            'Other: ',
                                        ])
                                    }
                                }}
                                id="other"
                            />
                            <label htmlFor="other">Other</label>
                        </div>
                        {selectedEthnicities.some((e) =>
                            e.startsWith('Other: '),
                        ) && (
                            <input
                                type="text"
                                placeholder="Specify other service"
                                className="border p-2"
                                value={otherEthnicity.replace('Other: ', '')} // Remove "Other: " prefix for user display
                                onChange={(e) => {
                                    const updatedValue = e.target.value
                                    const filteredEthnicities =
                                        selectedEthnicities.filter((e) =>
                                            ETHNICITY.includes(e),
                                        ) // Keep only predefined options

                                    if (updatedValue) {
                                        setValue('ethnicity', [
                                            ...filteredEthnicities,
                                            `Other: ${updatedValue}`,
                                        ]) // Store with "Other: " prefix
                                    } else {
                                        setValue(
                                            'ethnicity',
                                            filteredEthnicities,
                                        ) // Remove "Other" when empty
                                    }
                                }}
                            />
                        )}
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
                        {PUBLIC_SERVICES.map((service) => (
                            <div
                                key={service}
                                className="flex items-center space-x-2"
                            >
                                <input
                                    type="checkbox"
                                    value={service}
                                    checked={selectedServices.includes(service)}
                                    onChange={(e) => {
                                        const updatedServices = e.target.checked
                                            ? [...selectedServices, service]
                                            : selectedServices.filter(
                                                  (s) => s !== service,
                                              )

                                        setValue(
                                            'publicServices',
                                            updatedServices.length > 0
                                                ? updatedServices
                                                : undefined,
                                        )
                                    }}
                                    id={service}
                                />
                                <label htmlFor={service}>{service}</label>
                            </div>
                        ))}
                        <div className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                checked={!!otherService} // Keep checked if there is input
                                onChange={(e) => {
                                    if (!e.target.checked) {
                                        // Remove "Other" when unchecked
                                        setValue(
                                            'publicServices',
                                            selectedServices.filter((s) =>
                                                PUBLIC_SERVICES.includes(s),
                                            ),
                                        )
                                    } else {
                                        // Keep "Other" as an identifiable placeholder
                                        setValue('publicServices', [
                                            ...selectedServices,
                                            'Other: ',
                                        ])
                                    }
                                }}
                                id="other"
                            />
                            <label htmlFor="other">Other</label>
                        </div>
                        {selectedServices.some((s) =>
                            s.startsWith('Other: '),
                        ) && (
                            <input
                                type="text"
                                placeholder="Specify other service"
                                className="border p-2"
                                value={otherService.replace('Other: ', '')} // Remove "Other: " prefix for user display
                                onChange={(e) => {
                                    const updatedValue = e.target.value
                                    const filteredServices =
                                        selectedServices.filter((s) =>
                                            PUBLIC_SERVICES.includes(s),
                                        ) // Keep only predefined options

                                    if (updatedValue) {
                                        setValue('publicServices', [
                                            ...filteredServices,
                                            `Other: ${updatedValue}`,
                                        ]) // Store with "Other: " prefix
                                    } else {
                                        setValue(
                                            'publicServices',
                                            filteredServices,
                                        ) // Remove "Other" when empty
                                    }
                                }}
                            />
                        )}
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
