'use client'
import { ClientIntakeSchema } from '@/types/client-types'
import { useRouter } from 'next/navigation'
import { TypeOf } from 'zod'

type ClientType = TypeOf<typeof ClientIntakeSchema>

interface ClientProps {
    data: ClientType
}

// Profile Section

export const ClientBio = ({ data }: ClientProps) => {
    return (
        <div className="space-y-[24px]">
            {/* Row 1: Name & Gender */}
            <div className="grid grid-cols-2 gap-x-5 gap-y-3">
                <div className="flex flex-col space-y-1">
                    <label className="font-['Epilogue'] text-[16px] font-bold leading-[18px] text-neutral-900">
                        Name
                    </label>
                    <div className="flex flex-row space-x-[4px]">
                        {data.firstName && <p>{data.firstName}</p>}
                        {data.lastName && <p>{data.lastName}</p>}
                    </div>
                </div>
                <div className="flex flex-col space-y-1">
                    <label className="font-['Epilogue'] text-[16px] font-bold leading-[18px] text-neutral-900">
                        Gender
                    </label>
                    <div>{data.gender || <p>N/A</p>}</div>
                </div>
            </div>

            {/* Row 2: DOB & Age */}
            <div className="grid grid-cols-2 gap-x-5 gap-y-3">
                <div className="flex flex-col space-y-1">
                    <label className="font-['Epilogue'] text-[16px] font-bold leading-[18px] text-neutral-900">
                        DOB
                    </label>
                    <div>{data.dateOfBirth || <p>None provided.</p>}</div>
                </div>
                <div className="flex flex-col space-y-1">
                    <label className="font-['Epilogue'] text-[16px] font-bold leading-[18px] text-neutral-900">
                        Age
                    </label>
                    <div>{data.age || <p>N/A</p>}</div>
                </div>
            </div>

            {/* Row 3: Intake Date & Client Code */}
            <div className="grid grid-cols-2 gap-x-5 gap-y-3">
                <div className="flex flex-col space-y-1">
                    <label className="font-['Epilogue'] text-[16px] font-bold leading-[18px] text-neutral-900">
                        Intake Date
                    </label>
                    <div>{data.intakeDate || <p>N/A</p>}</div>
                </div>
                <div className="flex flex-col space-y-1">
                    <label className="font-['Epilogue'] text-[16px] font-bold leading-[18px] text-neutral-900">
                        Client Code
                    </label>
                    <div>{data.clientCode || <p>N/A</p>}</div>
                </div>
            </div>

            {/* Row 4: Contact Source */}
            <div className="flex flex-col space-y-1">
                <label className="font-['Epilogue'] text-[16px] font-bold leading-[18px] text-neutral-900">
                    Contact Source
                </label>
                <div>{data.contactSource || <p>N/A</p>}</div>
            </div>
        </div>
    )
}

export const ClientContactInfo = ({ data }: ClientProps) => {
    return (
        <div className="space-y-[24px]">
            <div className="grid grid-cols-2 gap-x-5 gap-y-3">
                <div className="flex flex-col space-y-1">
                    <label className="font-['Epilogue'] text-[16px] font-bold leading-[18px] text-neutral-900">
                        Email Address
                    </label>
                    <div>{data.email ? data.email : <p>N/A</p>}</div>
                </div>
                <div className="flex flex-col space-y-1">
                    <label className="font-['Epilogue'] text-[16px] font-bold leading-[18px] text-neutral-900">
                        Phone Number
                    </label>
                    <div>
                        {data.phoneNumber ? data.phoneNumber : <p>N/A</p>}
                    </div>
                </div>
            </div>
        </div>
    )
}

export const ClientCitizenship = ({ data }: ClientProps) => {
    return (
        <div className="space-y-[24px]">
            <div className="grid grid-cols-2 gap-x-5 gap-y-3">
                {/* Row: */}
                <div className="flex flex-col space-y-1">
                    <label className="font-['Epilogue'] text-[16px] font-bold leading-[18px] text-neutral-900">
                        Place of Origin
                    </label>
                    <div>
                        {data.placeOrigin ? data.placeOrigin : <p>N/A</p>}
                    </div>
                </div>
                <div className="flex flex-col space-y-1">
                    <label className="font-['Epilogue'] text-[16px] font-bold leading-[18px] text-neutral-900">
                        Citizenship
                    </label>
                    <div>
                        {data.citizenship ? data.citizenship : <p>N/A</p>}
                    </div>
                </div>
            </div>
        </div>
    )
}

export const ClientEthnicity = ({ data }: ClientProps) => {
    return (
        <div className="space-y-[24px]">
            <div>
                {data.ethnicity && data.ethnicity.length > 0 ? (
                    <ul>
                        {data.ethnicity.map((item, index) => (
                            <li key={index}>{item}</li>
                        ))}
                    </ul>
                ) : (
                    <p>N/A</p>
                )}
            </div>
        </div>
    )
}

export const ClientHousing = ({ data }: ClientProps) => {
    return (
        <div className="space-y-[24px]">
            <div className="grid grid-cols-2 gap-x-5 gap-y-3">
                {/* Row: */}
                <div className="flex flex-col space-y-1">
                    <label className="font-['Epilogue'] text-[16px] font-bold leading-[18px] text-neutral-900">
                        Homeless
                    </label>
                    <div>{data.homeless ? data.homeless : <p>N/A</p>}</div>
                </div>
                <div className="flex flex-col space-y-1">
                    <label className="font-['Epilogue'] text-[16px] font-bold leading-[18px] text-neutral-900">
                        Sheltered
                    </label>
                    <div>{data.sheltered ? data.sheltered : <p>N/A</p>}</div>
                </div>
            </div>
            <div className="grid grid-cols-2 gap-x-5 gap-y-3">
                <div className="flex flex-col space-y-1">
                    <label className="font-['Epilogue'] text-[16px] font-bold leading-[18px] text-neutral-900">
                        Street Address/Point of Contact
                    </label>
                    <div>
                        {data.streetAddress ? data.streetAddress : <p>N/A</p>}
                    </div>
                </div>
                <div className="flex flex-col space-y-1">
                    <label className="font-['Epilogue'] text-[16px] font-bold leading-[18px] text-neutral-900">
                        Apartment No.
                    </label>
                    <div>{data.aptNumber ? data.aptNumber : <p>N/A</p>}</div>
                </div>
            </div>
            <div className="grid grid-cols-2 gap-x-5 gap-y-3">
                {/* Row: */}
                <div className="flex flex-col space-y-1">
                    <label className="font-['Epilogue'] text-[16px] font-bold leading-[18px] text-neutral-900">
                        City
                    </label>
                    <div>{data.city ? data.city : <p>N/A</p>}</div>
                </div>
                <div className="flex flex-col space-y-1">
                    <label className="font-['Epilogue'] text-[16px] font-bold leading-[18px] text-neutral-900">
                        Postal/Zip Code
                    </label>
                    <div>{data.zipCode ? data.zipCode : <p>N/A</p>}</div>
                </div>
            </div>
        </div>
    )
}

// Background Section

export const ClientEducation = ({ data }: ClientProps) => {
    return (
        <div className="space-y-[24px]">
            <div className="flex flex-col space-y-1">
                <div>
                    {data.educationStatus && data.educationStatus.length > 0 ? (
                        <ul>
                            {data.educationStatus.map((item, index) => (
                                <li key={index}>{item}</li>
                            ))}
                        </ul>
                    ) : (
                        <p>N/A</p>
                    )}
                </div>
            </div>
        </div>
    )
}

export const ClientIncome = ({ data }: ClientProps) => {
    return (
        <div className="space-y-[24px]">
            <div className="grid grid-cols-2 gap-x-5 gap-y-3">
                {/* Row: */}
                <div className="flex flex-col space-y-1">
                    <label className="font-['Epilogue'] text-[16px] font-bold leading-[18px] text-neutral-900">
                        Employment
                    </label>
                    <div>{data.employment ? data.employment : <p>N/A</p>}</div>
                </div>
                <div className="flex flex-col space-y-1">
                    <label className="font-['Epilogue'] text-[16px] font-bold leading-[18px] text-neutral-900">
                        Income
                    </label>
                    <div>
                        {data.employmentIncome ? (
                            <span>${data.employmentIncome}</span>
                        ) : (
                            <p>N/A</p>
                        )}
                    </div>
                </div>
            </div>
            <div className="space-y-1">
                <div className="grid grid-cols-2 gap-x-5 gap-y-3">
                    {/* Row: */}
                    <div className="flex flex-col space-y-1">
                        <label className="font-['Epilogue'] text-[16px] font-bold leading-[18px] text-neutral-900">
                            Public Services
                        </label>
                    </div>
                    <div className="flex flex-col space-y-1">
                        <label className="font-['Epilogue'] text-[16px] font-bold leading-[18px] text-neutral-900">
                            Aid
                        </label>
                    </div>
                </div>
                {data.generalRelief == 'Recipient' && (
                    <div className="grid grid-cols-2 gap-x-5 gap-y-3">
                        <div className="flex flex-col space-y-1">
                            <label className="font-['Epilogue'] text-[16px] leading-[18px] text-neutral-900">
                                General Relief
                            </label>
                        </div>
                        <div className="flex flex-col space-y-1">
                            <label className="font-['Epilogue'] text-[16px] leading-[18px] text-neutral-900">
                                $
                                {data.generalReliefAid == ''
                                    ? 0
                                    : data.generalReliefAid}
                            </label>
                        </div>
                    </div>
                )}
                {data.calFresh == 'Recipient' && (
                    <div className="grid grid-cols-2 gap-x-5 gap-y-3">
                        <div className="flex flex-col space-y-1">
                            <label className="font-['Epilogue'] text-[16px] leading-[18px] text-neutral-900">
                                CalFresh (Food Stamps/EBT)
                            </label>
                        </div>
                        <div className="flex flex-col space-y-1">
                            <label className="font-['Epilogue'] text-[16px] leading-[18px] text-neutral-900">
                                ${data.calFreshAid == '' ? 0 : data.calFreshAid}
                            </label>
                        </div>
                    </div>
                )}
                {data.calWorks == 'Recipient' && (
                    <div className="grid grid-cols-2 gap-x-5 gap-y-3">
                        <div className="flex flex-col space-y-1">
                            <label className="font-['Epilogue'] text-[16px] leading-[18px] text-neutral-900">
                                CalWorks (Cash Aid)
                            </label>
                        </div>
                        <div className="flex flex-col space-y-1">
                            <label className="font-['Epilogue'] text-[16px] leading-[18px] text-neutral-900">
                                ${data.calWorksAid == '' ? 0 : data.calWorksAid}
                            </label>
                        </div>
                    </div>
                )}
                {data.ssi == 'Recipient' && (
                    <div className="grid grid-cols-2 gap-x-5 gap-y-3">
                        <div className="flex flex-col space-y-1">
                            <label className="font-['Epilogue'] text-[16px] leading-[18px] text-neutral-900">
                                SSI
                            </label>
                        </div>
                        <div className="flex flex-col space-y-1">
                            <label className="font-['Epilogue'] text-[16px] leading-[18px] text-neutral-900">
                                ${data.ssiAid == '' ? 0 : data.ssiAid}
                            </label>
                        </div>
                    </div>
                )}
                {data.ssa == 'Recipient' && (
                    <div className="grid grid-cols-2 gap-x-5 gap-y-3">
                        <div className="flex flex-col space-y-1">
                            <label className="font-['Epilogue'] text-[16px] leading-[18px] text-neutral-900">
                                SSA
                            </label>
                        </div>
                        <div className="flex flex-col space-y-1">
                            <label className="font-['Epilogue'] text-[16px] leading-[18px] text-neutral-900">
                                ${data.ssaAid == '' ? 0 : data.ssaAid}
                            </label>
                        </div>
                    </div>
                )}
                {data.unemployment == 'Recipient' && (
                    <div className="grid grid-cols-2 gap-x-5 gap-y-3">
                        <div className="flex flex-col space-y-1">
                            <label className="font-['Epilogue'] text-[16px] leading-[18px] text-neutral-900">
                                Unemployment
                            </label>
                        </div>
                        <div className="flex flex-col space-y-1">
                            <label className="font-['Epilogue'] text-[16px] leading-[18px] text-neutral-900">
                                $
                                {data.unemploymentAid == ''
                                    ? 0
                                    : data.unemploymentAid}
                            </label>
                        </div>
                    </div>
                )}
                {data.otherService == 'Recipient' && (
                    <div className="grid grid-cols-2 gap-x-5 gap-y-3">
                        <div className="flex flex-col space-y-1">
                            <label className="font-['Epilogue'] text-[16px] leading-[18px] text-neutral-900">
                                Other
                            </label>
                        </div>
                        <div className="flex flex-col space-y-1">
                            <label className="font-['Epilogue'] text-[16px] leading-[18px] text-neutral-900">
                                $
                                {data.otherServiceAid == ''
                                    ? 0
                                    : data.otherServiceAid}
                            </label>
                        </div>
                    </div>
                )}
            </div>
            <div className="grid grid-cols-2 gap-x-5 gap-y-3">
                {/* Row: */}
                <div className="flex flex-col space-y-1">
                    <label className="font-['Epilogue'] text-[16px] font-bold leading-[18px] text-neutral-900">
                        Total Income
                    </label>
                </div>
                <div className="flex flex-col space-y-1">
                    <label className="font-['Epilogue'] text-[16px] leading-[18px] text-neutral-900">
                        ${data.totalIncome == '' ? 'N/A' : data.totalIncome}
                    </label>
                </div>
            </div>
        </div>
    )
}

export const ClientHistory = ({ data }: ClientProps) => {
    return (
        <div className="space-y-[24px]">
            <div className="space-y-1">
                {data.mentalHealthConditions && (
                    <div className="grid grid-cols-2 gap-x-5 gap-y-3">
                        {/* Row: */}
                        <div className="flex flex-col space-y-1">
                            <label className="font-['Epilogue'] text-[16px] leading-[18px] text-neutral-900">
                                Mental health conditions
                            </label>
                        </div>
                        <div className="flex flex-col space-y-1">
                            <label className="font-['Epilogue'] text-[16px] leading-[18px] text-neutral-900">
                                {data.mentalHealthConditions}
                            </label>
                        </div>
                    </div>
                )}
                {data.medicalConditions && (
                    <div className="grid grid-cols-2 gap-x-5 gap-y-3">
                        {/* Row: */}
                        <div className="flex flex-col space-y-1">
                            <label className="font-['Epilogue'] text-[16px] leading-[18px] text-neutral-900">
                                Medical conditions
                            </label>
                        </div>
                        <div className="flex flex-col space-y-1">
                            <label className="font-['Epilogue'] text-[16px] leading-[18px] text-neutral-900">
                                {data.medicalConditions}
                            </label>
                        </div>
                    </div>
                )}
                {data.substanceAbuse && (
                    <div className="grid grid-cols-2 gap-x-5 gap-y-3">
                        {/* Row: */}
                        <div className="flex flex-col space-y-1">
                            <label className="font-['Epilogue'] text-[16px] leading-[18px] text-neutral-900">
                                Substance abuse
                            </label>
                        </div>
                        <div className="flex flex-col space-y-1">
                            <label className="font-['Epilogue'] text-[16px] leading-[18px] text-neutral-900">
                                {data.substanceAbuse}
                            </label>
                        </div>
                    </div>
                )}
                {data.fosterYouth && (
                    <div className="grid grid-cols-2 gap-x-5 gap-y-3">
                        {/* Row: */}
                        <div className="flex flex-col space-y-1">
                            <label className="font-['Epilogue'] text-[16px] leading-[18px] text-neutral-900">
                                Foster youth
                            </label>
                        </div>
                        <div className="flex flex-col space-y-1">
                            <label className="font-['Epilogue'] text-[16px] leading-[18px] text-neutral-900">
                                {data.fosterYouth}
                            </label>
                        </div>
                    </div>
                )}
                {data.openProbation && (
                    <div className="grid grid-cols-2 gap-x-5 gap-y-3">
                        {/* Row: */}
                        <div className="flex flex-col space-y-1">
                            <label className="font-['Epilogue'] text-[16px] leading-[18px] text-neutral-900">
                                Open probation case
                            </label>
                        </div>
                        <div className="flex flex-col space-y-1">
                            <label className="font-['Epilogue'] text-[16px] leading-[18px] text-neutral-900">
                                {data.openProbation}
                            </label>
                        </div>
                    </div>
                )}
                {data.openCPS && (
                    <div className="grid grid-cols-2 gap-x-5 gap-y-3">
                        {/* Row: */}
                        <div className="flex flex-col space-y-1">
                            <label className="font-['Epilogue'] text-[16px] leading-[18px] text-neutral-900">
                                Open CPS case
                            </label>
                        </div>
                        <div className="flex flex-col space-y-1">
                            <label className="font-['Epilogue'] text-[16px] leading-[18px] text-neutral-900">
                                {data.openCPS}
                            </label>
                        </div>
                    </div>
                )}
                {data.sexOffender && (
                    <div className="grid grid-cols-2 gap-x-5 gap-y-3">
                        {/* Row: */}
                        <div className="flex flex-col space-y-1">
                            <label className="font-['Epilogue'] text-[16px] leading-[18px] text-neutral-900">
                                Sex offender
                            </label>
                        </div>
                        <div className="flex flex-col space-y-1">
                            <label className="font-['Epilogue'] text-[16px] leading-[18px] text-neutral-900">
                                {data.sexOffender}
                            </label>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

// Family Section

export const ClientSpouse = ({ data }: ClientProps) => {
    const router = useRouter()
    return (
        <div className="space-y-[24px]">
            <div className="grid grid-cols-2 gap-x-5 gap-y-3">
                {/* ROW */}
                <div className="flex flex-col space-y-1">
                    <label className="font-['Epilogue'] text-[16px] font-bold leading-[18px] text-neutral-900">
                        Marital Status
                    </label>
                    <div>
                        {data.maritalStatus ? data.maritalStatus : <p>N/A</p>}
                    </div>
                </div>
                {/* ROW */}
                <div className="flex flex-col space-y-1">
                    <label className="font-['Epilogue'] text-[16px] font-bold leading-[18px] text-neutral-900">
                        If married, is spouse an ICV client?
                    </label>
                    <div>
                        {data.spouseClientStatus ? (
                            data.spouseClientStatus
                        ) : (
                            <p>N/A</p>
                        )}
                    </div>
                </div>
            </div>

            {data.spouse && !data.associatedSpouseID && (
                <div className="relative mt-4 space-y-[24px] rounded-[10px] border-[1px] border-solid border-[#DBD8E4] p-[24px]">
                    {/* Name + Gender Row */}
                    <div className="grid grid-cols-2 gap-x-5 gap-y-3">
                        <div className="flex flex-col space-y-1">
                            <label className="font-['Epilogue'] text-[16px] font-bold text-neutral-900">
                                Name
                            </label>
                            <div className="flex flex-row space-x-[4px]">
                                {data.spouse.spouseFirstName && (
                                    <p>{data.spouse.spouseFirstName}</p>
                                )}
                                {data.spouse.spouseLastName && (
                                    <p>{data.spouse.spouseLastName}</p>
                                )}
                            </div>
                        </div>
                        <div className="flex flex-col space-y-1">
                            <label className="font-['Epilogue'] text-[16px] font-bold text-neutral-900">
                                Gender
                            </label>
                            <div>
                                {data.spouse.spouseGender ? (
                                    <p>{data.spouse.spouseGender}</p>
                                ) : (
                                    <p>N/A</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* DOB + Age Row */}
                    <div className="grid grid-cols-2 gap-x-5">
                        <div className="flex flex-col space-y-1">
                            <label className="font-['Epilogue'] text-[16px] font-bold text-neutral-900">
                                DOB
                            </label>
                            <div>
                                {data.spouse.spouseDOB ? (
                                    <p>{data.spouse.spouseDOB}</p>
                                ) : (
                                    <p>N/A</p>
                                )}
                            </div>
                        </div>
                        <div className="flex flex-col space-y-1">
                            <label className="font-['Epilogue'] text-[16px] font-bold text-neutral-900">
                                Age
                            </label>
                            <div>
                                {data.spouse.spouseAge ? (
                                    <p>{data.spouse.spouseAge}</p>
                                ) : (
                                    <p>N/A</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Income Row */}
                    <div className="flex flex-col space-y-1">
                        <label className="font-['Epilogue'] text-[16px] font-bold text-neutral-900">
                            Income
                        </label>
                        <div>
                            {data.spouse.spouseIncome ? (
                                <p>
                                    {'$'}
                                    {data.spouse.spouseIncome}
                                </p>
                            ) : (
                                <p>N/A</p>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {data.associatedSpouseID && (
                <div className="mt-4 w-full space-y-[24px] rounded-[10px] border-[1px] border-solid border-[#DBD8E4] p-[24px]">
                    <button
                        onClick={() =>
                            router.push(`/clients/${data.associatedSpouseID}`)
                        }
                        className="flex h-[32px] min-w-[96px] items-center gap-[4px] rounded-[5px] bg-[#4EA0C9] px-[12px] py-[8px] text-white"
                    >
                        View Spouse
                    </button>
                </div>
            )}
        </div>
    )
}

export const ClientDependents = ({ data }: ClientProps) => {
    return (
        <div className="space-y-[24px]">
            <div className="grid grid-cols-2 gap-x-5">
                <div className="flex flex-col space-y-1">
                    <label className="font-['Epilogue'] text-[16px] font-bold text-neutral-900">
                        Head of Household?
                    </label>
                    <div>
                        {data.headOfHousehold ? (
                            data.headOfHousehold
                        ) : (
                            <p>N/A</p>
                        )}
                    </div>
                </div>
                <div className="flex flex-col space-y-1">
                    <label className="font-['Epilogue'] text-[16px] font-bold text-neutral-900">
                        Family Size
                    </label>
                    <div>{data.familySize ? data.familySize : <p>N/A</p>}</div>
                </div>
            </div>
            {data.dependent &&
                data.dependent.length > 0 &&
                data.dependent.map((child, index) => (
                    <div
                        key={index}
                        className="mt-4 space-y-[24px] rounded-[10px] border-[1px] border-solid border-[#DBD8E4] p-[24px]"
                    >
                        <label className="font-epilogue text-[22px] font-medium leading-[24px] text-[#1A1D20]">
                            Dependent {index + 1}:
                        </label>
                        <div className="grid grid-cols-2 gap-x-5 gap-y-3">
                            {/* ROW */}
                            <div className="flex flex-col space-y-1">
                                <label className="font-['Epilogue'] text-[16px] font-bold leading-[18px] text-neutral-900">
                                    Name
                                </label>
                                <div className="flex flex-row space-x-[4px]">
                                    {child.firstName && (
                                        <p>{child.firstName}</p>
                                    )}
                                    {child.lastName && <p>{child.lastName}</p>}
                                </div>
                            </div>
                            <div className="flex flex-col space-y-1">
                                <label className="font-['Epilogue'] text-[16px] font-bold leading-[18px] text-neutral-900">
                                    Gender
                                </label>
                                <div>
                                    {child.gender ? child.gender : <p>N/A</p>}
                                </div>
                            </div>
                        </div>

                        {/* Second Row: DOB & Income */}
                        <div className="grid grid-cols-2 gap-x-5 gap-y-3">
                            <div className="flex flex-col space-y-1">
                                <label className="font-['Epilogue'] text-[16px] font-bold leading-[18px] text-neutral-900">
                                    DOB
                                </label>
                                <div>{child.dob ? child.dob : <p>N/A</p>}</div>
                            </div>
                            <div className="flex flex-col space-y-1">
                                <label className="font-['Epilogue'] text-[16px] font-bold leading-[18px] text-neutral-900">
                                    Age
                                </label>
                                <div>{child.age ? child.age : <p>N/A</p>}</div>
                            </div>
                        </div>

                        {/* Third Row: Income */}
                        <div className="grid grid-cols-2 gap-x-5 gap-y-3">
                            <div className="flex flex-col space-y-1">
                                <label className="font-['Epilogue'] text-[16px] font-bold leading-[18px] text-neutral-900">
                                    Income
                                </label>
                            </div>
                            <div className="flex flex-col space-y-1">
                                <div>
                                    {child.income ? child.income : <p>N/A</p>}
                                </div>
                            </div>
                        </div>

                        {/* Public Services */}
                        <div className="space-y-1">
                            <div className="grid grid-cols-2 gap-x-5 gap-y-3">
                                {/* Row: */}
                                <div className="flex flex-col space-y-1">
                                    <label className="font-['Epilogue'] text-[16px] font-bold leading-[18px] text-neutral-900">
                                        Public Services
                                    </label>
                                </div>
                                <div className="flex flex-col space-y-1">
                                    <label className="font-['Epilogue'] text-[16px] font-bold leading-[18px] text-neutral-900">
                                        Aid
                                    </label>
                                </div>
                            </div>
                            {child.generalRelief == 'Recipient' && (
                                <div className="grid grid-cols-2 gap-x-5 gap-y-3">
                                    <div className="flex flex-col space-y-1">
                                        <label className="font-['Epilogue'] text-[16px] leading-[18px] text-neutral-900">
                                            General Relief
                                        </label>
                                    </div>
                                    <div className="flex flex-col space-y-1">
                                        <label className="font-['Epilogue'] text-[16px] leading-[18px] text-neutral-900">
                                            $
                                            {child.generalReliefAid == ''
                                                ? 0
                                                : child.generalReliefAid}
                                        </label>
                                    </div>
                                </div>
                            )}
                            {child.calFresh == 'Recipient' && (
                                <div className="grid grid-cols-2 gap-x-5 gap-y-3">
                                    <div className="flex flex-col space-y-1">
                                        <label className="font-['Epilogue'] text-[16px] leading-[18px] text-neutral-900">
                                            CalFresh (Food Stamps/EBT)
                                        </label>
                                    </div>
                                    <div className="flex flex-col space-y-1">
                                        <label className="font-['Epilogue'] text-[16px] leading-[18px] text-neutral-900">
                                            $
                                            {child.calFreshAid == ''
                                                ? 0
                                                : child.calFreshAid}
                                        </label>
                                    </div>
                                </div>
                            )}
                            {child.calWorks == 'Recipient' && (
                                <div className="grid grid-cols-2 gap-x-5 gap-y-3">
                                    <div className="flex flex-col space-y-1">
                                        <label className="font-['Epilogue'] text-[16px] leading-[18px] text-neutral-900">
                                            CalWorks (Cash Aid)
                                        </label>
                                    </div>
                                    <div className="flex flex-col space-y-1">
                                        <label className="font-['Epilogue'] text-[16px] leading-[18px] text-neutral-900">
                                            $
                                            {child.calWorksAid == ''
                                                ? 0
                                                : child.calWorksAid}
                                        </label>
                                    </div>
                                </div>
                            )}
                            {child.ssi == 'Recipient' && (
                                <div className="grid grid-cols-2 gap-x-5 gap-y-3">
                                    <div className="flex flex-col space-y-1">
                                        <label className="font-['Epilogue'] text-[16px] leading-[18px] text-neutral-900">
                                            SSI
                                        </label>
                                    </div>
                                    <div className="flex flex-col space-y-1">
                                        <label className="font-['Epilogue'] text-[16px] leading-[18px] text-neutral-900">
                                            $
                                            {child.ssiAid == ''
                                                ? 0
                                                : child.ssiAid}
                                        </label>
                                    </div>
                                </div>
                            )}
                            {child.ssa == 'Recipient' && (
                                <div className="grid grid-cols-2 gap-x-5 gap-y-3">
                                    <div className="flex flex-col space-y-1">
                                        <label className="font-['Epilogue'] text-[16px] leading-[18px] text-neutral-900">
                                            SSA
                                        </label>
                                    </div>
                                    <div className="flex flex-col space-y-1">
                                        <label className="font-['Epilogue'] text-[16px] leading-[18px] text-neutral-900">
                                            $
                                            {child.ssaAid == ''
                                                ? 0
                                                : child.ssaAid}
                                        </label>
                                    </div>
                                </div>
                            )}
                            {child.unemployment == 'Recipient' && (
                                <div className="grid grid-cols-2 gap-x-5 gap-y-3">
                                    <div className="flex flex-col space-y-1">
                                        <label className="font-['Epilogue'] text-[16px] leading-[18px] text-neutral-900">
                                            Unemployment
                                        </label>
                                    </div>
                                    <div className="flex flex-col space-y-1">
                                        <label className="font-['Epilogue'] text-[16px] leading-[18px] text-neutral-900">
                                            $
                                            {child.unemploymentAid == ''
                                                ? 0
                                                : child.unemploymentAid}
                                        </label>
                                    </div>
                                </div>
                            )}
                            {child.otherService == 'Recipient' && (
                                <div className="grid grid-cols-2 gap-x-5 gap-y-3">
                                    <div className="flex flex-col space-y-1">
                                        <label className="font-['Epilogue'] text-[16px] leading-[18px] text-neutral-900">
                                            Other
                                        </label>
                                    </div>
                                    <div className="flex flex-col space-y-1">
                                        <label className="font-['Epilogue'] text-[16px] leading-[18px] text-neutral-900">
                                            $
                                            {child.otherServiceAid == ''
                                                ? 0
                                                : child.otherServiceAid}
                                        </label>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Fifth Row: Total Income */}
                        <div className="grid grid-cols-2 gap-x-5 gap-y-3">
                            <div className="flex flex-col space-y-1">
                                <label className="font-['Epilogue'] text-[16px] font-bold leading-[18px] text-neutral-900">
                                    Total Income
                                </label>
                            </div>
                            <div className="flex flex-col space-y-1">
                                <div>
                                    <label className="font-['Epilogue'] text-[16px] leading-[18px] text-neutral-900">
                                        $
                                        {child.totalIncome == ''
                                            ? 'N/A'
                                            : child.totalIncome}
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
        </div>
    )
}

export const ClientPets = ({ data }: ClientProps) => {
    return (
        <div className="space-y-[24px]">
            {data.pets && data.pets.length > 0 ? (
                data.pets.map((pet, index) => (
                    <div
                        key={index}
                        className="mt-4 space-y-[24px] rounded-[10px] border-[1px] border-solid border-[#DBD8E4] p-[24px]"
                    >
                        <label className="font-epilogue text-[22px] font-medium leading-[24px] text-[#1A1D20]">
                            Pet {index + 1}:
                        </label>
                        <div className="grid grid-cols-2 gap-x-5 gap-y-3">
                            {/* First Row: Name & Gender */}
                            <div className="flex flex-col space-y-1">
                                <label className="font-['Epilogue'] text-[16px] font-bold leading-[18px] text-neutral-900">
                                    Species
                                </label>
                                <div>{pet.species || <p>N/A</p>}</div>
                            </div>
                            <div className="flex flex-col space-y-1">
                                <label className="font-['Epilogue'] text-[16px] font-bold leading-[18px] text-neutral-900">
                                    Size
                                </label>
                                <div>{pet.size || <p>N/A</p>}</div>
                            </div>
                        </div>

                        {/* Second Row: Purpose */}
                        <div className="space-y-[4px]">
                            <label className="font-['Epilogue'] text-[16px] font-bold leading-[18px] text-neutral-900">
                                Purpose
                            </label>
                            <div>
                                {pet.purpose?.length ? ( // Optional chaining used here
                                    pet.purpose.map((purpose, index) => (
                                        <div key={index} className="space-y-4">
                                            <label>{purpose}</label>
                                        </div>
                                    ))
                                ) : (
                                    <p>N/A</p>
                                )}
                            </div>
                        </div>
                    </div>
                ))
            ) : (
                <p>N/A</p>
            )}
        </div>
    )
}

export const ClientServices = ({ data }: ClientProps) => {
    return (
        <div className="space-y-[24px]">
            <div className="grid grid-cols-2 gap-[12px]">
                <div>
                    <label className="font-['Epilogue'] text-[16px] font-bold leading-[18px] text-neutral-900">
                        Mentoring
                    </label>
                    {data.mentoring?.length ? ( // Optional chaining used here
                        data.mentoring.map((mentor, index) => (
                            <div key={index} className="space-y-4">
                                <label>{mentor}</label>
                            </div>
                        ))
                    ) : (
                        <p>N/A</p>
                    )}
                </div>
                <div>
                    <label className="font-['Epilogue'] text-[16px] font-bold leading-[18px] text-neutral-900">
                        Personal Development
                    </label>
                    {data.personalDev?.length ? ( // Optional chaining used here
                        data.personalDev.map((dev, index) => (
                            <div key={index} className="space-y-4">
                                <label>{dev}</label>
                            </div>
                        ))
                    ) : (
                        <p>N/A</p>
                    )}
                </div>
            </div>
            <div className="grid grid-cols-2 gap-[12px]">
                <div>
                    <label className="font-['Epilogue'] text-[16px] font-bold leading-[18px] text-neutral-900">
                        Housing Assistance
                    </label>
                    {data.housing?.length ? ( // Optional chaining used here
                        data.housing.map((house, index) => (
                            <div key={index} className="space-y-4">
                                <label>{house}</label>
                            </div>
                        ))
                    ) : (
                        <p>N/A</p>
                    )}
                </div>
                <div>
                    <label className="font-['Epilogue'] text-[16px] font-bold leading-[18px] text-neutral-900">
                        Redirection Program
                    </label>
                    {data.redirection?.length ? ( // Optional chaining used here
                        data.redirection.map((dir, index) => (
                            <div key={index} className="space-y-4">
                                <label>{dir}</label>
                            </div>
                        ))
                    ) : (
                        <p>N/A</p>
                    )}
                </div>
            </div>
            <div className="grid grid-cols-2 gap-[12px]">
                <div>
                    <label className="font-['Epilogue'] text-[16px] font-bold leading-[18px] text-neutral-900">
                        Education & Training Support
                    </label>
                    {data.education?.length ? ( // Optional chaining used here
                        data.education.map((edu, index) => (
                            <div key={index} className="space-y-4">
                                <label>{edu}</label>
                            </div>
                        ))
                    ) : (
                        <p>N/A</p>
                    )}
                </div>
                <div>
                    <label className="font-['Epilogue'] text-[16px] font-bold leading-[18px] text-neutral-900">
                        Health & Wellness Support
                    </label>
                    {data.healthWellness?.length ? ( // Optional chaining used here
                        data.healthWellness.map((health, index) => (
                            <div key={index} className="space-y-4">
                                <label>{health}</label>
                            </div>
                        ))
                    ) : (
                        <p>N/A</p>
                    )}
                </div>
            </div>
            <div>
                <label className="font-['Epilogue'] text-[16px] font-bold leading-[18px] text-neutral-900">
                    Referrals/Linkages Services
                </label>
                {data.referral?.length ? ( // Optional chaining used here
                    data.referral.map((ref, index) => (
                        <div key={index} className="space-y-4">
                            <label>{ref}</label>
                        </div>
                    ))
                ) : (
                    <p>N/A</p>
                )}
            </div>
        </div>
    )
}

export const ClientNotes = ({ data }: ClientProps) => {
    return (
        <div className="space-y-[24px]">
            <div className="flex flex-col space-y-1">
                <label className="font-['Epilogue'] text-[16px] font-bold leading-[18px] text-neutral-900">
                    Notes on Housing
                </label>
                <div>{data.housingNotes ? data.housingNotes : <p>N/A</p>}</div>
            </div>
            <div className="flex flex-col space-y-1">
                <label className="font-['Epilogue'] text-[16px] font-bold leading-[18px] text-neutral-900">
                    Notes on History
                </label>
                <div>{data.historyNotes ? data.historyNotes : <p>N/A</p>}</div>
            </div>
            <div className="flex flex-col space-y-1">
                <label className="font-['Epilogue'] text-[16px] font-bold leading-[18px] text-neutral-900">
                    Additional Notes
                </label>
                <div>
                    {data.additionalNotes ? data.additionalNotes : <p>N/A</p>}
                </div>
            </div>
        </div>
    )
}

export const ClientPic = ({ data }: ClientProps) => {
    return (
        <div className="space-y-[24px]">
            <div className="gap-y-[4px]">
                {/* Row: */}
                <div>
                    {Array.isArray(data.clientPic) &&
                    data.clientPic.length > 0 ? ( // Optional chaining used here
                        data.clientPic.map((file, index) => (
                            <div key={index} className="space-y-4">
                                <label>{file.name}</label>
                            </div>
                        ))
                    ) : (
                        <p>No file(s) uploaded.</p>
                    )}
                </div>
            </div>
        </div>
    )
}

export const ClientDocs = ({ data }: ClientProps) => {
    // console.log('data', data.clientIDocs)
    // {
    //     Array.isArray(data.clientIDocs) && data.clientIDocs.length > 0 // Optional chaining used here
    //         ? data.clientIDocs.map((file, index) =>
    //               console.log('HERES INFO ON FILES', file.name, file.uri),
    //           )
    //         : console.log('ERROR FILES')
    // }
    return (
        <div className="space-y-[24px]">
            <div className="flex flex-col space-y-1">
                <label className="font-['Epilogue'] text-[16px] font-bold leading-[18px] text-neutral-900">
                    ID
                </label>
                <div>
                    {Array.isArray(data.clientIDocs) ? (
                        data.clientIDocs.map((file, index) => (
                            <div key={index} className="mt-4 space-y-4">
                                <label className="flex h-[36px] flex-row items-center gap-3 self-stretch rounded-lg bg-gray-200 px-3 py-1.5 text-sm text-gray-800">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        height="24px"
                                        viewBox="0 -960 960 960"
                                        width="24px"
                                        fill="#000000"
                                    >
                                        <path d="M330-250h300v-60H330v60Zm0-160h300v-60H330v60Zm-77.69 310Q222-100 201-121q-21-21-21-51.31v-615.38Q180-818 201-839q21-21 51.31-21H570l210 210v477.69Q780-142 759-121q-21 21-51.31 21H252.31ZM540-620v-180H252.31q-4.62 0-8.46 3.85-3.85 3.84-3.85 8.46v615.38q0 4.62 3.85 8.46 3.84 3.85 8.46 3.85h455.38q4.62 0 8.46-3.85 3.85-3.84 3.85-8.46V-620H540ZM240-800v180-180V-160v-640Z" />
                                    </svg>
                                    <a
                                        href={file.uri}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-600 underline"
                                    >
                                        {file.name}
                                    </a>
                                </label>
                            </div>
                        ))
                    ) : (
                        <p>No file(s) uploaded.</p>
                    )}
                </div>
            </div>
            <div className="flex flex-col space-y-1">
                <label className="font-['Epilogue'] text-[16px] font-bold leading-[18px] text-neutral-900">
                    Passport
                </label>
                <div>
                    {Array.isArray(data.clientPassport) &&
                    data.clientPassport?.length ? ( // Optional chaining used here
                        data.clientPassport.map((file, index) => (
                            <div key={index} className="mt-4 space-y-4">
                                <label className="flex h-[36px] flex-row items-center gap-3 self-stretch rounded-lg bg-gray-200 px-3 py-1.5 text-sm text-gray-800">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        height="24px"
                                        viewBox="0 -960 960 960"
                                        width="24px"
                                        fill="#000000"
                                    >
                                        <path d="M330-250h300v-60H330v60Zm0-160h300v-60H330v60Zm-77.69 310Q222-100 201-121q-21-21-21-51.31v-615.38Q180-818 201-839q21-21 51.31-21H570l210 210v477.69Q780-142 759-121q-21 21-51.31 21H252.31ZM540-620v-180H252.31q-4.62 0-8.46 3.85-3.85 3.84-3.85 8.46v615.38q0 4.62 3.85 8.46 3.84 3.85 8.46 3.85h455.38q4.62 0 8.46-3.85 3.85-3.84 3.85-8.46V-620H540ZM240-800v180-180V-160v-640Z" />
                                    </svg>{' '}
                                    <a
                                        href={file.uri}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-600 underline"
                                    >
                                        {file.name}
                                    </a>
                                </label>
                            </div>
                        ))
                    ) : (
                        <p>No file(s) uploaded.</p>
                    )}
                </div>
            </div>

            <div className="flex flex-col space-y-1">
                <label className="font-['Epilogue'] text-[16px] font-bold leading-[18px] text-neutral-900">
                    MediCal
                </label>
                <div>
                    {Array.isArray(data.clientMediCal) &&
                    data.clientMediCal.length ? ( // Optional chaining used here
                        data.clientMediCal.map((file, index) => (
                            <div key={index} className="mt-4 space-y-4">
                                <label className="flex h-[36px] flex-row items-center gap-3 self-stretch rounded-lg bg-gray-200 px-3 py-1.5 text-sm text-gray-800">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        height="24px"
                                        viewBox="0 -960 960 960"
                                        width="24px"
                                        fill="#000000"
                                    >
                                        <path d="M330-250h300v-60H330v60Zm0-160h300v-60H330v60Zm-77.69 310Q222-100 201-121q-21-21-21-51.31v-615.38Q180-818 201-839q21-21 51.31-21H570l210 210v477.69Q780-142 759-121q-21 21-51.31 21H252.31ZM540-620v-180H252.31q-4.62 0-8.46 3.85-3.85 3.84-3.85 8.46v615.38q0 4.62 3.85 8.46 3.84 3.85 8.46 3.85h455.38q4.62 0 8.46-3.85 3.85-3.84 3.85-8.46V-620H540ZM240-800v180-180V-160v-640Z" />
                                    </svg>{' '}
                                    <a
                                        href={file.uri}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-600 underline"
                                    >
                                        {file.name}
                                    </a>
                                </label>
                            </div>
                        ))
                    ) : (
                        <p>No file(s) uploaded.</p>
                    )}
                </div>
            </div>

            <div className="flex flex-col space-y-1">
                <label className="font-['Epilogue'] text-[16px] font-bold leading-[18px] text-neutral-900">
                    SSN
                </label>
                <div>
                    {Array.isArray(data.clientSSN) && data.clientSSN?.length ? ( // Optional chaining used here
                        data.clientSSN.map((file, index) => (
                            <div key={index} className="mt-4 space-y-4">
                                <label className="flex h-[36px] flex-row items-center gap-3 self-stretch rounded-lg bg-gray-200 px-3 py-1.5 text-sm text-gray-800">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        height="24px"
                                        viewBox="0 -960 960 960"
                                        width="24px"
                                        fill="#000000"
                                    >
                                        <path d="M330-250h300v-60H330v60Zm0-160h300v-60H330v60Zm-77.69 310Q222-100 201-121q-21-21-21-51.31v-615.38Q180-818 201-839q21-21 51.31-21H570l210 210v477.69Q780-142 759-121q-21 21-51.31 21H252.31ZM540-620v-180H252.31q-4.62 0-8.46 3.85-3.85 3.84-3.85 8.46v615.38q0 4.62 3.85 8.46 3.84 3.85 8.46 3.85h455.38q4.62 0 8.46-3.85 3.85-3.84 3.85-8.46V-620H540ZM240-800v180-180V-160v-640Z" />
                                    </svg>{' '}
                                    <a
                                        href={file.uri}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-600 underline"
                                    >
                                        {file.name}
                                    </a>
                                </label>
                            </div>
                        ))
                    ) : (
                        <p>No file(s) uploaded.</p>
                    )}
                </div>
            </div>
            <div className="flex flex-col space-y-1">
                <label className="font-['Epilogue'] text-[16px] font-bold leading-[18px] text-neutral-900">
                    Birth Certificate
                </label>
                <div>
                    {Array.isArray(data.clientBC) && data.clientBC?.length ? ( // Optional chaining used here
                        data.clientBC.map((file, index) => (
                            <div key={index} className="mt-4 space-y-4">
                                <label className="flex h-[36px] flex-row items-center gap-3 self-stretch rounded-lg bg-gray-200 px-3 py-1.5 text-sm text-gray-800">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        height="24px"
                                        viewBox="0 -960 960 960"
                                        width="24px"
                                        fill="#000000"
                                    >
                                        <path d="M330-250h300v-60H330v60Zm0-160h300v-60H330v60Zm-77.69 310Q222-100 201-121q-21-21-21-51.31v-615.38Q180-818 201-839q21-21 51.31-21H570l210 210v477.69Q780-142 759-121q-21 21-51.31 21H252.31ZM540-620v-180H252.31q-4.62 0-8.46 3.85-3.85 3.84-3.85 8.46v615.38q0 4.62 3.85 8.46 3.84 3.85 8.46 3.85h455.38q4.62 0 8.46-3.85 3.85-3.84 3.85-8.46V-620H540ZM240-800v180-180V-160v-640Z" />
                                    </svg>{' '}
                                    <a
                                        href={file.uri}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-600 underline"
                                    >
                                        {file.name}
                                    </a>
                                </label>
                            </div>
                        ))
                    ) : (
                        <p>No file(s) uploaded.</p>
                    )}
                </div>
            </div>
            <div className="flex flex-col space-y-1">
                <label className="font-['Epilogue'] text-[16px] font-bold leading-[18px] text-neutral-900">
                    Other
                </label>
                <div>
                    {Array.isArray(data.otherFiles) &&
                    data.otherFiles?.length ? ( // Optional chaining used here
                        data.otherFiles.map((file, index) => (
                            <div key={index} className="mt-4 space-y-4">
                                <label className="flex h-[36px] flex-row items-center gap-3 self-stretch rounded-lg bg-gray-200 px-3 py-1.5 text-sm text-gray-800">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        height="24px"
                                        viewBox="0 -960 960 960"
                                        width="24px"
                                        fill="#000000"
                                    >
                                        <path d="M330-250h300v-60H330v60Zm0-160h300v-60H330v60Zm-77.69 310Q222-100 201-121q-21-21-21-51.31v-615.38Q180-818 201-839q21-21 51.31-21H570l210 210v477.69Q780-142 759-121q-21 21-51.31 21H252.31ZM540-620v-180H252.31q-4.62 0-8.46 3.85-3.85 3.84-3.85 8.46v615.38q0 4.62 3.85 8.46 3.84 3.85 8.46 3.85h455.38q4.62 0 8.46-3.85 3.85-3.84 3.85-8.46V-620H540ZM240-800v180-180V-160v-640Z" />
                                    </svg>{' '}
                                    <a
                                        href={file.uri}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-600 underline"
                                    >
                                        {file.name}
                                    </a>
                                </label>
                            </div>
                        ))
                    ) : (
                        <p>No file(s) uploaded.</p>
                    )}
                </div>
            </div>
        </div>
    )
}
