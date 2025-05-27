'use client'

import {
    BackgroundSchema,
    EDUSTATUS,
    EMPLOYMENT,
    NewClient,
    YESNO,
} from '@/types/client-types'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { TypeOf } from 'zod'
import {
    CheckboxList,
    RadioChoice,
    ServicesWithIncome,
} from '../../_components/MakeOptions'

interface Props {
    formType: Partial<NewClient>
    updateForm: (form: Partial<NewClient>) => void
    onSubmitNew?: (data: NewClient) => void
    onSubmitEdit?: (data: NewClient) => void
    onCancel?: () => void
    submitType: 'save' | 'new'
    titleStyle: string
}

type BackgroundInfoType = TypeOf<typeof BackgroundSchema>
export const BackgroundSection: React.FC<Props> = ({
    formType,
    updateForm,
    onSubmitNew,
    onSubmitEdit,
    onCancel,
    submitType,
    titleStyle,
}) => {
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
        defaultValues: formType,
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
    const selectedEmployment = watch('employment') ?? ''
    const selectedMentalCondition = watch('mentalHealthConditions') ?? ''
    const selectedMedicalCondition = watch('medicalConditions') ?? ''
    const selectedSubstance = watch('substanceAbuse') ?? ''
    const selectedFosterYouth = watch('fosterYouth') ?? ''
    const selectedOpenProbation = watch('openProbation') ?? ''
    const selectedOpenCPS = watch('openCPS') ?? ''
    const selectedSO = watch('sexOffender') ?? ''

    const [invalidIncome, setInvalidIncome] = useState<string[]>([])

    useEffect(() => {
        reset(formType)
    }, [formType, reset])

    useEffect(() => {
        const warnings: string[] = []

        const parseIncome = (label: string, value: any) => {
            console.log('value', value)
            if (value === undefined || value === '') {
                return 0
            }

            const cleanedValue = String(value).replace(/,/g, '')
            const num = parseFloat(cleanedValue)
            if (isNaN(num) || cleanedValue != num.toString()) {
                warnings.push(`${value} is not a valid income for ${label}.`)
                return 0
            }

            return num
        }
        const totalSum =
            parseIncome('Employment Income', formType.employmentIncome) +
            parseIncome('General Relief Aid', formType.generalReliefAid) +
            parseIncome('CalFresh Aid', formType.calFreshAid) +
            parseIncome('CalWorks Aid', formType.calWorksAid) +
            parseIncome('SSI Aid', formType.ssiAid) +
            parseIncome('SSA Aid', formType.ssaAid) +
            parseIncome('Unemployment Aid', formType.unemploymentAid) +
            parseIncome('Other Aid', formType.otherServiceAid)

        setInvalidIncome(warnings)
        updateForm({ totalIncome: totalSum.toString() })
    }, [
        formType.employmentIncome,
        formType.generalReliefAid,
        formType.calFreshAid,
        formType.calWorksAid,
        formType.ssiAid,
        formType.ssaAid,
        formType.unemploymentAid,
        formType.otherServiceAid,
    ])

    useEffect(() => {
        const unsubscribe = watch((data) => {
            updateForm({
                ...data,
                educationStatus: data.educationStatus?.filter(
                    (edu): edu is string => !!edu,
                ),
            })
        }).unsubscribe
        console.log(formType)
        console.log(errors)

        return unsubscribe
    }, [watch, formType])

    const handleSubmitType = (data: BackgroundInfoType) => {
        if (submitType === 'save' && onSubmitEdit) {
            onSubmitEdit(data)
        } else if (submitType === 'new' && onSubmitNew) {
            onSubmitNew(data)
        }
    }

    return (
        <form
            className="space-y-[24px]"
            onSubmit={handleSubmit(handleSubmitType)}
        >
            <div className="flex min-h-screen items-center justify-center">
                <div className="w-full space-y-[48px]">
                    <div className="space-y-[24px]">
                        <div className="space-y-[8px]">
                            <label className={titleStyle}>Education</label>
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
                    </div>

                    <div className="space-y-[24px]">
                        <div className="space-y-[24px]">
                            <label className={titleStyle}>
                                Public Services
                            </label>
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

                            <div className="space-y-[8px]">
                                <div className="grid grid-cols-2 gap-[12px]">
                                    <div className="flex flex-col">
                                        <label className="font-['Epilogue'] text-[16px] font-normal leading-[18px] text-neutral-900">
                                            Service
                                        </label>
                                    </div>
                                    <div className="flex flex-col">
                                        <label className="font-['Epilogue'] text-[16px] font-normal leading-[18px] text-neutral-900">
                                            Aid
                                        </label>
                                    </div>
                                </div>
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
                    </div>

                    <div className="flex grid grid-cols-2 items-center gap-[12px]">
                        <div>
                            <label className={titleStyle}>Total Income</label>
                        </div>
                        <div className="flex items-center rounded border p-2">
                            <span className="mr-1 text-neutral-900">$</span>
                            <input
                                {...register('totalIncome')}
                                type="text"
                                placeholder="Text"
                                className="w-full outline-none"
                            />
                        </div>
                    </div>
                    {invalidIncome.length > 0 && (
                        <div style={{ color: 'red', marginTop: '1rem' }}>
                            {invalidIncome.map((msg, index) => (
                                <div key={index}>{msg}</div>
                            ))}
                        </div>
                    )}

                    <div className="space-y-[24px]">
                        <div className="space-y-[20px]">
                            <label className={titleStyle}>History</label>
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
                                    name="medicalConditions"
                                />
                            </div>
                            <div className="flex flex-col space-y-[4px]">
                                <label className="font-['Epilogue'] text-[16px] font-normal leading-[18px] text-neutral-900">
                                    Substance abuse
                                </label>
                                <RadioChoice
                                    options={YESNO}
                                    selectedValue={selectedSubstance}
                                    onChange={(updatedSub) =>
                                        setValue('substanceAbuse', updatedSub)
                                    }
                                    name="substanceAbuse"
                                />
                            </div>
                            <div className="flex flex-col space-y-[4px]">
                                <label className="font-['Epilogue'] text-[16px] font-normal leading-[18px] text-neutral-900">
                                    Foster youth
                                </label>
                                <RadioChoice
                                    options={YESNO}
                                    selectedValue={selectedFosterYouth}
                                    onChange={(updatedFoster) =>
                                        setValue('fosterYouth', updatedFoster)
                                    }
                                    name="fosterYouth"
                                />
                            </div>
                            <div className="flex flex-col space-y-[4px]">
                                <label className="font-['Epilogue'] text-[16px] font-normal leading-[18px] text-neutral-900">
                                    Open probation case
                                </label>
                                <RadioChoice
                                    options={YESNO}
                                    selectedValue={selectedOpenProbation}
                                    onChange={(updatedProbation) =>
                                        setValue(
                                            'openProbation',
                                            updatedProbation,
                                        )
                                    }
                                    name="openProbation"
                                />
                            </div>
                            <div className="flex flex-col space-y-[4px]">
                                <label className="font-['Epilogue'] text-[16px] font-normal leading-[18px] text-neutral-900">
                                    Open CPS case
                                </label>
                                <RadioChoice
                                    options={YESNO}
                                    selectedValue={selectedOpenCPS}
                                    onChange={(updatedCPS) =>
                                        setValue('openCPS', updatedCPS)
                                    }
                                    name="openCPSCase"
                                />
                            </div>
                            <div className="flex flex-col space-y-[4px]">
                                <label className="font-['Epilogue'] text-[16px] font-normal leading-[18px] text-neutral-900">
                                    Sex offender
                                </label>
                                <RadioChoice
                                    options={YESNO}
                                    selectedValue={selectedSO}
                                    onChange={(updatedSO) =>
                                        setValue('sexOffender', updatedSO)
                                    }
                                    name="sexOffender"
                                />
                            </div>
                            <div className="flex flex-col space-y-[4px]">
                                <label className="font-['Epilogue'] text-[16px] font-normal leading-[18px] text-neutral-900">
                                    Notes on History
                                </label>
                                <textarea
                                    {...register('historyNotes')}
                                    placeholder="Text"
                                    className="min-h-[100px] w-full resize-y overflow-auto rounded border p-2"
                                    rows={4}
                                />
                            </div>
                        </div>
                    </div>

                    {submitType === 'new' && (
                        <div className="flex justify-between">
                            <button
                                type="button"
                                onClick={() => router.push('/intake')}
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
                    )}
                    {submitType == 'save' && (
                        <div className="flex justify-start space-x-[24px]">
                            <button
                                type="submit"
                                className="rounded-[5px] bg-[#4EA0C9] px-[20px] py-[16px] text-white hover:bg-[#246F95]"
                            >
                                <div className="flex flex-row space-x-[8px]">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        height="20px"
                                        viewBox="0 -960 960 960"
                                        width="20px"
                                        fill="#FFFFFF"
                                    >
                                        <path d="M389-267 195-460l51-52 143 143 325-324 51 51-376 375Z" />
                                    </svg>
                                    Save
                                </div>
                            </button>
                            <button
                                type="button"
                                onClick={onCancel}
                                className="rounded-[5px] bg-[#1A1D20] px-[20px] py-[16px] text-white hover:bg-[#6D757F]"
                            >
                                <div className="flex flex-row space-x-[8px]">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        height="20px"
                                        viewBox="0 -960 960 960"
                                        width="20px"
                                        fill="#FFFFFF"
                                    >
                                        <path d="m291-240-51-51 189-189-189-189 51-51 189 189 189-189 51 51-189 189 189 189-51 51-189-189-189 189Z" />
                                    </svg>
                                    Cancel
                                </div>
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </form>
    )
}
