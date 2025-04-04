'use client'

import { useIntakeFormStore } from '@/app/_lib/useIntakeFormStore'
import {
    BackgroundSchema,
    EDUSTATUS,
    MENTALHEALTH,
    PUBLIC_SERVICES,
    SUBSTANCES,
    YESNO,
} from '@/types/client-types'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { TypeOf } from 'zod'
import {
    CheckboxList,
    CheckboxListWithOther,
    RadioChoice,
} from '../../components/MakeOptions'

interface Props {}

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
    const selectedEduStat = Array.isArray(watch('educationStatus'))
        ? (watch('educationStatus') ?? [])
        : []
    const selectedCPS = watch('cps') ?? ''
    const selectedProbation = watch('probation') ?? ''
    const selectedFoster = watch('fosterYouth') ?? ''
    const selectedOffender = watch('sexOffender') ?? ''
    const selectedMH = Array.isArray(watch('mentalHealth'))
        ? (watch('mentalHealth') ?? [])
        : []
    const selectedSub = Array.isArray(watch('substanceAbuse'))
        ? (watch('substanceAbuse') ?? [])
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
                educationStatus: data.educationStatus?.filter(
                    (edu): edu is string => !!edu,
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
        router.push('/intake/family/background/services')
    }

    return (
        <form
            className="space-y-[24px]"
            style={{ padding: '24px' }}
            onSubmit={handleSubmit(onSubmit)}
        >
            <div className="flex min-h-screen items-center justify-center">
                <div className="min-w-[800px] space-y-[48px]">
                    <label className="block text-center font-['Epilogue'] text-[40px] font-bold leading-[56px] text-neutral-900">
                        Background
                    </label>
                    <div className="space-y-[8px]">
                        <label className="font-['Epilogue'] text-[16px] font-normal leading-[18px] text-neutral-900">
                            Education
                        </label>
                        <div className="flex flex-col space-y-[8px]">
                            <CheckboxList
                                options={EDUSTATUS}
                                selectedValues={selectedEduStat.filter(
                                    (edu): edu is string => !!edu,
                                )}
                                onChange={(updatedEduStat) =>
                                    setValue('educationStatus', updatedEduStat)
                                }
                                name="eduStat"
                            />
                        </div>
                    </div>
                    <div className="space-y-[12px]">
                        <div className="space-y-[8px]">
                            <label className="font-['Epilogue'] text-[16px] font-normal leading-[18px] text-neutral-900">
                                Open case with CPS?
                            </label>
                            <div className="flex flex-col space-y-[8px]">
                                <RadioChoice
                                    options={YESNO}
                                    selectedValue={selectedCPS}
                                    onChange={(updatedCPS) =>
                                        setValue('cps', updatedCPS)
                                    }
                                    name="cps"
                                />
                            </div>
                        </div>
                        <div className="space-y-[8px]">
                            <label className="font-['Epilogue'] text-[16px] font-normal leading-[18px] text-neutral-900">
                                Notes
                            </label>
                            <input
                                {...register('cpsNotes')}
                                type="text"
                                placeholder="Text"
                                className="w-full rounded border p-2"
                            />
                        </div>
                    </div>

                    <div className="space-y-[12px]">
                        <div className="space-y-[8px]">
                            <label className="font-['Epilogue'] text-[16px] font-normal leading-[18px] text-neutral-900">
                                Open case with probation?
                            </label>
                            <div className="flex flex-col space-y-[8px]">
                                <RadioChoice
                                    options={YESNO}
                                    selectedValue={selectedProbation}
                                    onChange={(updatedProbation) =>
                                        setValue('probation', updatedProbation)
                                    }
                                    name="probation"
                                />
                            </div>
                        </div>
                        <div className="space-y-[8px]">
                            <label className="font-['Epilogue'] text-[16px] font-normal leading-[18px] text-neutral-900">
                                Notes
                            </label>
                            <input
                                {...register('probationNotes')}
                                type="text"
                                placeholder="Text"
                                className="w-full rounded border p-2"
                            />
                        </div>
                    </div>

                    <div className="space-y-[12px]">
                        <div className="space-y-[8px]">
                            <label className="font-['Epilogue'] text-[16px] font-normal leading-[18px] text-neutral-900">
                                Foster youth?
                            </label>
                            <div className="flex flex-col space-y-[8px]">
                                <RadioChoice
                                    options={YESNO}
                                    selectedValue={selectedFoster}
                                    onChange={(updatedFoster) =>
                                        setValue('fosterYouth', updatedFoster)
                                    }
                                    name="foster"
                                />
                            </div>
                        </div>
                        <div className="space-y-[8px]">
                            <label className="font-['Epilogue'] text-[16px] font-normal leading-[18px] text-neutral-900">
                                Notes
                            </label>
                            <input
                                {...register('fosterNotes')}
                                type="text"
                                placeholder="Text"
                                className="w-full rounded border p-2"
                            />
                        </div>
                    </div>

                    <div className="space-y-[12px]">
                        <div className="space-y-[8px]">
                            <label className="font-['Epilogue'] text-[16px] font-normal leading-[18px] text-neutral-900">
                                Sex offender?
                            </label>
                            <div className="flex flex-col space-y-[8px]">
                                <RadioChoice
                                    options={YESNO}
                                    selectedValue={selectedOffender}
                                    onChange={(updatedOffender) =>
                                        setValue('sexOffender', updatedOffender)
                                    }
                                    name="sexOffender"
                                />
                            </div>
                        </div>
                        <div className="space-y-[8px]">
                            <label className="font-['Epilogue'] text-[16px] font-normal leading-[18px] text-neutral-900">
                                Notes
                            </label>
                            <input
                                {...register('sexOffNotes')}
                                type="text"
                                placeholder="Text"
                                className="w-full rounded border p-2"
                            />
                        </div>
                    </div>

                    {/* Health Information */}
                    <div className="space-y-[12px]">
                        <div className="space-y-[8px]">
                            <label className="font-['Epilogue'] text-[28px] font-semibold leading-[40px] text-neutral-900">
                                Mental Health
                            </label>
                            <div>
                                <CheckboxList
                                    options={MENTALHEALTH}
                                    selectedValues={selectedMH.filter(
                                        (mh): mh is string => !!mh,
                                    )}
                                    onChange={(updatedMH) =>
                                        setValue('mentalHealth', updatedMH)
                                    }
                                    name="mentalHealth"
                                />
                            </div>
                        </div>
                        <div className="space-y-[8px]">
                            <label className="font-['Epilogue'] text-[16px] font-normal leading-[18px] text-neutral-900">
                                Notes
                            </label>
                            <input
                                {...register('mentalHealthNotes')}
                                type="text"
                                placeholder="Text"
                                className="w-full rounded border p-2"
                            />
                        </div>
                    </div>

                    <div className="space-y-[12px]">
                        <div className="space-y-[8px]">
                            <label className="font-['Epilogue'] text-[28px] font-semibold leading-[40px] text-neutral-900">
                                Medical History
                            </label>
                        </div>
                        <div className="space-y-[8px]">
                            <label className="font-['Epilogue'] text-[16px] font-normal leading-[18px] text-neutral-900">
                                Notes
                            </label>
                            <input
                                {...register('medicalHistory')}
                                type="text"
                                placeholder="Text"
                                className="w-full rounded border p-2"
                            />
                        </div>
                    </div>

                    <div className="space-y-[12px]">
                        <div className="space-y-[8px]">
                            <label className="font-['Epilogue'] text-[28px] font-semibold leading-[40px] text-neutral-900">
                                Substance Abuse
                            </label>
                            <div>
                                <CheckboxList
                                    options={SUBSTANCES}
                                    selectedValues={selectedSub.filter(
                                        (sub): sub is string => !!sub,
                                    )}
                                    onChange={(updatedSub) =>
                                        setValue('substanceAbuse', updatedSub)
                                    }
                                    name="substanceAbuse"
                                />
                            </div>
                        </div>
                        <div className="space-y-[8px]">
                            <label className="font-['Epilogue'] text-[16px] font-normal leading-[18px] text-neutral-900">
                                Notes
                            </label>
                            <input
                                {...register('substanceNotes')}
                                type="text"
                                placeholder="Text"
                                className="w-full rounded border p-2"
                            />
                        </div>
                    </div>
                    {/* Public Services */}
                    <div className="space-y-[8px]">
                        <label className="font-['Epilogue'] text-[28px] font-semibold leading-[40px] text-neutral-900">
                            Public Services?
                        </label>
                        <div className="flex flex-col space-y-[8px]">
                            <CheckboxListWithOther
                                options={PUBLIC_SERVICES}
                                selectedValues={selectedServices.filter(
                                    (service): service is string => !!service,
                                )}
                                onChange={(updatedServices) =>
                                    setValue('publicServices', updatedServices)
                                }
                                name="services"
                                otherLabel="Other"
                                otherPlaceholder="Other"
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
