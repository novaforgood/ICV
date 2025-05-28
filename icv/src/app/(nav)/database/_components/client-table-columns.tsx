import { NewClient } from '@/types/client-types'
import { ColumnDef, createColumnHelper } from '@tanstack/react-table'

const columnHelper = createColumnHelper<NewClient>()

const renderValue = (value: any, tagMode: boolean = false) => {
    const isEmpty =
        value === null ||
        value === undefined ||
        value === '' ||
        (Array.isArray(value) && value.length === 0)

    if (tagMode) {
        let display = value
        let bgColor = 'bg-[#A2AFC3]'

        if (isEmpty) {
            display = 'N/A'
        } else if (value === 'Yes') {
            bgColor = 'bg-[#2AAF6C]'
        } else if (value === 'No') {
            bgColor = 'bg-[#FF394D]'
        }

        return (
            <div className="flex w-full justify-start">
                <div
                    className={`w-[50px] rounded-full px-[12px] py-[4px] ${bgColor} text-center text-white`}
                >
                    {display}
                </div>
            </div>
        )
    }

    if (isEmpty) {
        return <div>N/A</div>
    }

    return Array.isArray(value) ? (
        <div className="flex flex-col">
            {value.map((v, idx) => (
                <div key={idx}>{v}</div>
            ))}
        </div>
    ) : (
        <div>{value}</div>
    )
}

export const CLIENT_TABLE_COLUMNS: ColumnDef<NewClient, any>[] = [
    columnHelper.accessor('clientCode', {
        header: () => <div>Client Code</div>,
        cell: (info) => renderValue(info.getValue()),
        size: 180,
    }),
    columnHelper.accessor('firstName', {
        header: () => <div>First Name</div>,
        cell: (info) => renderValue(info.getValue()),
        size: 200,
    }),
    columnHelper.accessor('lastName', {
        header: () => <div>Last Name</div>,
        cell: (info) => renderValue(info.getValue()),
        size: 200,
    }),
    columnHelper.accessor('intakeDate', {
        header: () => <div>Intake Date</div>,
        cell: (info) => renderValue(info.getValue()),
        size: 180,
    }),
    columnHelper.accessor('caseManager', {
        header: () => <div>Case Manager</div>,
        cell: (info) => renderValue(info.getValue()),
        size: 250,
    }),
    columnHelper.accessor('clientNumber', {
        header: () => <div>Number</div>,
        cell: (info) => renderValue(info.getValue()),
        size: 200,
    }),
    columnHelper.accessor('dateOfBirth', {
        header: () => <div>DOB</div>,
        cell: (info) => renderValue(info.getValue()),
        size: 180,
    }),
    columnHelper.accessor('age', {
        header: () => <div>Age</div>,
        cell: (info) => renderValue(info.getValue()),
        size: 180,
    }),
    columnHelper.accessor('gender', {
        header: () => <div>Gender</div>,
        cell: (info) => renderValue(info.getValue()),
        size: 200,
    }),
    columnHelper.accessor('contactSource', {
        header: () => <div>Contact Source</div>,
        cell: (info) => renderValue(info.getValue()),
        size: 200,
    }),
    columnHelper.accessor('homeless', {
        header: () => <div>Homeless</div>,
        cell: (info) => renderValue(info.getValue()),
        size: 200,
    }),
    columnHelper.accessor('sheltered', {
        header: () => <div>Sheltered</div>,
        cell: (info) => renderValue(info.getValue()),
        size: 180,
    }),
    columnHelper.accessor('zipCode', {
        header: () => <div>Zip Code</div>,
        cell: (info) => renderValue(info.getValue()),
        size: 180,
    }),
    columnHelper.accessor('citizenship', {
        header: () => <div>Citizenship</div>,
        cell: (info) => renderValue(info.getValue()),
        size: 200,
    }),
    columnHelper.accessor('ethnicity', {
        header: () => <div>Ethnicity</div>,
        cell: (info) => renderValue(info.getValue()),
        size: 200,
    }),
    columnHelper.accessor('employment', {
        header: () => <div>Employed</div>,
        cell: (info) => renderValue(info.getValue()),
        size: 200,
    }),
    columnHelper.accessor('familySize', {
        header: () => <div>Family Size</div>,
        cell: (info) => renderValue(info.getValue()),
        size: 200,
    }),
    columnHelper.accessor('mentalHealthConditions', {
        header: () => <div>Mental Health Conditions</div>,
        cell: (info) => renderValue(info.getValue(), true),
        size: 260,
    }),
    columnHelper.accessor('medicalConditions', {
        header: () => <div>Medical Conditions</div>,
        cell: (info) => renderValue(info.getValue(), true),
        size: 230,
    }),
    columnHelper.accessor('substanceAbuse', {
        header: () => <div>Substance Abuse</div>,
        cell: (info) => renderValue(info.getValue(), true),
        size: 230,
    }),
    columnHelper.accessor('fosterYouth', {
        header: () => <div>Foster Youth</div>,
        cell: (info) => renderValue(info.getValue(), true),
        size: 230,
    }),
    columnHelper.accessor('openCPS', {
        header: () => <div>Open Probation Case</div>,
        cell: (info) => renderValue(info.getValue(), true),
        size: 250,
    }),
    columnHelper.accessor('sexOffender', {
        header: () => <div>Sex Offender</div>,
        cell: (info) => renderValue(info.getValue(), true),
        size: 200,
    }),
]
