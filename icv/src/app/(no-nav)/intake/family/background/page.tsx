'use client'

import { useIntakeFormStore } from '@/app/_lib/useIntakeFormStore'
import {
    BackgroundSchema,
    EDUSTATUS,
    EMPLOYMENT,
    YESNO,
} from '@/types/client-types'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { TypeOf } from 'zod'
import {
    CheckboxList,
    RadioChoice,
    ServicesWithIncome,
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
    const selectedGenRelief = watch('generalRelief') ?? ''
    const selectedCalFresh = watch('calFresh') ?? ''
    const selectedCalWorks = watch('calWorks') ?? ''
    const selectedSSI = watch('ssi') ?? ''
    const selectedSSA = watch('ssa') ?? ''
    const selectedUnemployment = watch('unemployment') ?? ''
    const selectedOtherService = watch('otherService') ?? ''
    const selectedEduStat = Array.isArray(watch('educationStatus'))
        ? (watch('educationStatus') ?? [])
        : []
    // const selectedCPS = watch('cps') ?? ''
    // const selectedProbation = watch('probation') ?? ''
    // const selectedFoster = watch('fosterYouth') ?? ''
    // const selectedOffender = watch('sexOffender') ?? ''
    // const selectedMH = Array.isArray(watch('mentalHealth'))
    //     ? (watch('mentalHealth') ?? [])
    //     : []
    const selectedSub = Array.isArray(watch('substanceAbuse'))
        ? (watch('substanceAbuse') ?? [])
        : []
    const selectedEmployment = watch('employment') ?? ''

    // mentalHealthConditions: true,
    // medicalConditions: true,
    // substanceAbuse:true,
    // fosterYouth:true,
    // openProbation: true,
    // openCPS:true,
    // sexOffender:true,
    // historyNotes:true,

    const selectedMentalCondition = watch('mentalHealthConditions') ?? ''
    const selectedMedicalCondition = watch('medicalConditions') ?? ''
    const selectedSubstance = watch('substanceAbuse') ?? ''
    const selectedFosterYouth = watch('fosterYouth') ?? ''
    const selectedOpenProbation = watch('openProbation') ?? ''
    const selectedOpenCPS = watch('openCPS') ?? ''
    const selectedSO = watch('sexOffender') ?? ''
    const selectedHistoryNotes = watch('historyNotes') ?? ''

    useEffect(() => {
        reset(loadedForm)
    }, [loadedForm, reset])

    useEffect(() => {
        const unsubscribe = watch((data) => {
            updateForm({
                ...data,
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

                    <div className="space-y-[24px]">
                        <div className="space-y-[8px]">
                            <label className="font-['Epilogue'] text-[28px] font-semibold leading-[40px] text-neutral-900">
                                Employment
                            </label>
                        </div>
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
                                        setValue(
                                            'educationStatus',
                                            updatedEduStat,
                                        )
                                    }
                                    name="eduStat"
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-[12px]">
                            <div className="flex flex-col space-y-[4px]">
                                <label className="font-['Epilogue'] text-[16px] font-normal leading-[18px] text-neutral-900">
                                    Employment
                                </label>
                                <RadioChoice
                                    options={EMPLOYMENT}
                                    selectedValue={selectedEmployment}
                                    onChange={(updatedEMP) =>
                                        setValue('employment', updatedEMP)
                                    }
                                    name="employment"
                                />
                            </div>
                            <div className="flex flex-col space-y-[4px]">
                                <label className="font-['Epilogue'] text-[16px] font-normal leading-[18px] text-neutral-900">
                                    Income
                                </label>
                                <div className="flex items-center rounded border p-2">
                                    <span className="mr-1 text-neutral-900">
                                        $
                                    </span>
                                    <input
                                        {...register('employmentIncome')}
                                        type="text"
                                        placeholder="Text"
                                        className="w-full outline-none"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-[24px]">
                        <div className="space-y-[20px]">
                            <label className="font-['Epilogue'] text-[28px] font-semibold leading-[40px] text-neutral-900">
                                Public Services
                            </label>
                            <ServicesWithIncome
                                selected={selectedGenRelief}
                                serviceTitle="General Relief"
                                incomeFieldName="generalReliefAid"
                                serviceFieldName="generalRelief"
                                setValue={(field, value) =>
                                    setValue(
                                        field as keyof BackgroundInfoType,
                                        value,
                                    )
                                }
                                register={
                                    register as (field: string) => {
                                        [key: string]: any
                                    }
                                }
                            />
                            <ServicesWithIncome
                                selected={selectedCalFresh}
                                serviceTitle="CalFresh (Food Stamps/EBT)"
                                incomeFieldName="calFreshAid"
                                serviceFieldName="calFresh"
                                setValue={(field, value) =>
                                    setValue(
                                        field as keyof BackgroundInfoType,
                                        value,
                                    )
                                }
                                register={
                                    register as (field: string) => {
                                        [key: string]: any
                                    }
                                }
                            />
                            <ServicesWithIncome
                                selected={selectedCalWorks}
                                serviceTitle="CalWorks (Cash Aid)"
                                incomeFieldName="calWorksAid"
                                serviceFieldName="calWorks"
                                setValue={(field, value) =>
                                    setValue(
                                        field as keyof BackgroundInfoType,
                                        value,
                                    )
                                }
                                register={
                                    register as (field: string) => {
                                        [key: string]: any
                                    }
                                }
                            />
                            <ServicesWithIncome
                                selected={selectedSSI}
                                serviceTitle="SSI"
                                incomeFieldName="ssiAid"
                                serviceFieldName="ssi"
                                setValue={(field, value) =>
                                    setValue(
                                        field as keyof BackgroundInfoType,
                                        value,
                                    )
                                }
                                register={
                                    register as (field: string) => {
                                        [key: string]: any
                                    }
                                }
                            />
                            <ServicesWithIncome
                                selected={selectedSSA}
                                serviceTitle="SSA"
                                incomeFieldName="ssaAid"
                                serviceFieldName="ssa"
                                setValue={(field, value) =>
                                    setValue(
                                        field as keyof BackgroundInfoType,
                                        value,
                                    )
                                }
                                register={
                                    register as (field: string) => {
                                        [key: string]: any
                                    }
                                }
                            />
                            <ServicesWithIncome
                                selected={selectedUnemployment}
                                serviceTitle="Unemployment"
                                incomeFieldName="unemploymentAid"
                                serviceFieldName="unemployment"
                                setValue={(field, value) =>
                                    setValue(
                                        field as keyof BackgroundInfoType,
                                        value,
                                    )
                                }
                                register={
                                    register as (field: string) => {
                                        [key: string]: any
                                    }
                                }
                            />
                            <ServicesWithIncome
                                selected={selectedOtherService}
                                serviceTitle="Other"
                                incomeFieldName="otherServiceAid"
                                serviceFieldName="otherService"
                                setValue={(field, value) =>
                                    setValue(
                                        field as keyof BackgroundInfoType,
                                        value,
                                    )
                                }
                                register={
                                    register as (field: string) => {
                                        [key: string]: any
                                    }
                                }
                            />
                        </div>
                    </div>

                    {/* <div className="space-y-[12px]">
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
                    </div> */}

                    {/* <div className="space-y-[12px]">
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
                    </div> */}

                    {/* <div className="space-y-[12px]">
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
                    </div> */}

                    {/* <div className="space-y-[12px]">
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
                    </div> */}

                    {/* Health Information */}
                    {/* <div className="space-y-[12px]">
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
                    </div> */}

                    {/* <div className="space-y-[12px]">
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
                    </div> */}

                    {/* <div className="space-y-[12px]">
                        <div className="space-y-[8px]">
                            <label className="font-['Epilogue'] text-[28px] font-semibold leading-[40px] text-neutral-900">
                                Substance Abuse
                            </label>
                            <div>
                                <RadioChoice
                                    options={YESNO}
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
                    </div> */}

                    <div className="space-y-[24px]">
                        <div className="space-y-[20px]">
                            <label className="font-['Epilogue'] text-[28px] font-semibold leading-[40px] text-neutral-900">
                                Public Services
                            </label>
                            <div className="flex flex-col space-y-[4px]">
                                <label className="font-['Epilogue'] text-[16px] font-normal leading-[18px] text-neutral-900">
                                    Mental health conditions
                                </label>
                                <RadioChoice
                                    options={YESNO}
                                    selectedValue={selectedMentalCondition}
                                    onChange={(updatedMC) =>
                                        setValue(
                                            'mentalHealthConditions',
                                            updatedMC,
                                        )
                                    }
                                    name="mentalHealthConditions"
                                />
                            </div>
                            <div className="flex flex-col space-y-[4px]">
                                <label className="font-['Epilogue'] text-[16px] font-normal leading-[18px] text-neutral-900">
                                    Medical conditions
                                </label>
                                <RadioChoice
                                    options={YESNO}
                                    selectedValue={selectedMedicalCondition}
                                    onChange={(updatedMedCondition) =>
                                        setValue(
                                            'medicalConditions',
                                            updatedMedCondition,
                                        )
                                    }
                                    name="mentalHealthConditions"
                                />
                            </div>
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
