import { NewClient } from '@/types/client-types'
import { ColumnDef, createColumnHelper } from '@tanstack/react-table'

const columnHelper = createColumnHelper<NewClient>()

export const CLIENT_TABLE_COLUMNS: ColumnDef<NewClient, any>[] = [
    columnHelper.accessor('clientCode', {
        header: () => <div>Client Code</div>,
        cell: (info) => <div>{info.getValue()}</div>,
    }),
    columnHelper.accessor('firstName', {
        header: () => <div>First Name</div>,
        cell: (info) => <div>{info.getValue()}</div>,
    }),
    columnHelper.accessor('lastName', {
        header: () => <div>Last Name</div>,
        cell: (info) => <div>{info.getValue()}</div>,
    }),
    columnHelper.accessor('email', {
        header: () => <div>Email</div>,
        cell: (info) => <div>{info.getValue()}</div>,
    }),
    // columnHelper.accessor('caseManager', {
    //     header: () => <div>Case Manager</div>,
    //     cell: (info) => <div>{info.getValue()}</div>,
    // }),
    columnHelper.accessor('dateOfBirth', {
        header: () => <div>DOB</div>,
        cell: (info) => <div>{info.getValue()}</div>,
    }),
    columnHelper.accessor('gender', {
        header: () => <div>Gender</div>,
        cell: (info) => <div>{info.getValue()}</div>,
    }),
    columnHelper.accessor('referralSource', {
        header: () => <div>Referral Source</div>,
        cell: (info) => <div>{info.getValue()}</div>,
    }),
    columnHelper.accessor('citizenship', {
        header: () => <div>Citizenship</div>,
        cell: (info) => <div>{info.getValue()}</div>,
    }),
    columnHelper.accessor('homeless', {
        header: () => <div>Homeless</div>,
        cell: (info) => <div>{info.getValue()}</div>,
    }),
    columnHelper.accessor('dependent', {
        header: () => <div>No. Children</div>,
        cell: (info) => <div>{info.getValue()?.length ?? 0}</div>,
    }),
    columnHelper.accessor('mentalHealth', {
        header: () => <div>Mental Health</div>,
        cell: (info) => (
            <div className="no-scrollbar flex max-w-40 gap-1 overflow-scroll">
                {info.getValue()?.map((mh: string) => (
                    <div
                        key={mh}
                        className="mr-1 rounded-full bg-gray-100 px-2 py-1 text-xs"
                    >
                        {mh}
                    </div>
                ))}
            </div>
        ),
    }),
    columnHelper.accessor('pets', {
        header: () => <div>No. Pets</div>,
        cell: (info) => <div>{info.getValue()?.length ?? 0}</div>,
    }),
    columnHelper.accessor('employed', {
        header: () => <div>Employed</div>,
        cell: (info) => <div>{info.getValue()}</div>,
    }),
    columnHelper.accessor('familySize', {
        header: () => <div>Family Size</div>,
        cell: (info) => <div>{info.getValue()}</div>,
    }),
    columnHelper.accessor('educationStatus', {
        header: () => <div>Education</div>,
        cell: (info) => <div>{info.getValue()?.join(', ') || 'N/A'}</div>,
    }),
    columnHelper.accessor('cps', {
        header: () => <div>CPS Case</div>,
        cell: (info) => <div>{info.getValue()}</div>,
    }),
    columnHelper.accessor('probation', {
        header: () => <div>Probation Case</div>,
        cell: (info) => <div>{info.getValue()}</div>,
    }),
    columnHelper.accessor('fosterYouth', {
        header: () => <div>Foster Youth</div>,
        cell: (info) => <div>{info.getValue()}</div>,
    }),
    columnHelper.accessor('sexOffender', {
        header: () => <div>Sex Offender</div>,
        cell: (info) => <div>{info.getValue()}</div>,
    }),
    columnHelper.accessor('substanceAbuse', {
        header: () => <div>Substance Abuse</div>,
        cell: (info) => <div>{info.getValue()?.join(', ') || 'N/A'}</div>,
    }),
    // columnHelper.accessor('program', {
    //     header: () => <div>Program</div>,
    //     cell: (info) => <div>{info.getValue()}</div>,
    // }),
    columnHelper.accessor('dateOfBirth', {
        id: 'age',
        header: () => <div>Age</div>,
        cell: (info) => {
            const dob = info.getValue()
            if (!dob) return 'N/A'
            const birthYear = new Date(dob).getFullYear()
            const currentYear = new Date().getFullYear()
            return currentYear - birthYear
        },
    }),
    columnHelper.accessor('ethnicity', {
        header: () => <div>Ethnicity</div>,
        cell: (info) => <div>{info.getValue()?.join(', ') || 'N/A'}</div>,
    }),
]
