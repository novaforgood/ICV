'use client'

import Symbol from '@/components/Symbol'
import { MultiCheckbox } from '@/components/ui/multi-checkbox'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
} from '@/components/ui/select'
import { NewClient } from '@/types/client-types'
import { ColumnDef, createColumnHelper } from '@tanstack/react-table'
import { ArrowUpDown, X } from 'lucide-react'

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

const FilterTags = ({
    filters,
    onClear,
}: {
    filters: string[]
    onClear: (filterToRemove: string) => void
}) => {
    if (!filters || filters.length === 0) return null

    return (
        <div className="mt-1 flex flex-wrap gap-1">
            {filters.map((filter, index) => (
                <div
                    key={index}
                    className="flex items-center gap-1 rounded-full bg-gray-100 px-2 py-1 text-sm"
                >
                    <span>{filter}</span>
                    <button
                        onClick={() => onClear(filter)}
                        className="rounded-full p-0.5 hover:bg-gray-200"
                    >
                        <X className="h-3 w-3" />
                    </button>
                </div>
            ))}
        </div>
    )
}

export const CLIENT_TABLE_COLUMNS: ColumnDef<NewClient, any>[] = [
    columnHelper.accessor('clientCode', {
        header: () => <div>Client Code</div>,
        cell: (info) => renderValue(info.getValue()),
        size: 180,
    }),
    columnHelper.accessor('firstName', {
        header: ({ column }) => (
            <div className="flex w-full items-center justify-between">
                <div>First Name</div>
                <Select
                    onValueChange={(value) => {
                        column.toggleSorting(value === 'desc')
                    }}
                >
                    <SelectTrigger className="h-[30px] w-[30px] border-none p-0 shadow-none focus:ring-0">
                        <ArrowUpDown className="h-4 w-4" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="asc">Sort ascending</SelectItem>
                        <SelectItem value="desc">Sort descending</SelectItem>
                    </SelectContent>
                </Select>
            </div>
        ),
        cell: (info) => renderValue(info.getValue()),
        size: 200,
    }),
    columnHelper.accessor('lastName', {
        header: ({ column }) => (
            <div className="flex w-full items-center justify-between">
                <div>Last Name</div>
                <Select
                    onValueChange={(value) => {
                        column.toggleSorting(value === 'desc')
                    }}
                >
                    <SelectTrigger className="h-[30px] w-[30px] border-none p-0 shadow-none focus:ring-0">
                        <ArrowUpDown className="h-4 w-4" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="asc">Sort ascending</SelectItem>
                        <SelectItem value="desc">Sort descending</SelectItem>
                    </SelectContent>
                </Select>
            </div>
        ),
        cell: (info) => renderValue(info.getValue()),
        size: 200,
    }),
    columnHelper.accessor('intakeDate', {
        header: ({ column }) => (
            <div className="flex w-full items-center justify-between">
                <div>Intake Date</div>
                <Select
                    onValueChange={(value) => {
                        column.toggleSorting(value === 'desc')
                    }}
                >
                    <SelectTrigger className="h-[30px] w-[30px] border-none p-0 shadow-none focus:ring-0">
                        <ArrowUpDown className="h-4 w-4" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="asc">Sort ascending</SelectItem>
                        <SelectItem value="desc">Sort descending</SelectItem>
                    </SelectContent>
                </Select>
            </div>
        ),
        cell: (info) => {
            const dateValue = info.getValue()
            const parsedDate = new Date(dateValue)
            return isNaN(parsedDate.getTime())
                ? renderValue(null)
                : renderValue(parsedDate.toLocaleDateString())
        },
        size: 180,
    }),
    columnHelper.accessor('caseManager', {
        header: ({ column, table }) => {
            const caseManagers = Array.from(
                column.getFacetedUniqueValues()?.keys() ?? [],
            )
            const selectedFilters = (column.getFilterValue() as string[]) ?? []

            return (
                <div className="flex w-full flex-col">
                    <div className="flex w-full items-center justify-between">
                        <div>Case Manager</div>
                        <Select
                            onValueChange={(value) => {
                                if (value === 'all') {
                                    column.setFilterValue(undefined)
                                }
                            }}
                        >
                            <SelectTrigger className="h-[30px] w-[30px] border-none p-0 shadow-none focus:ring-0">
                                <Symbol symbol="filter_list" />
                            </SelectTrigger>
                            <SelectContent>
                                <div className="p-2">
                                    <MultiCheckbox
                                        options={caseManagers.map((cm) => ({
                                            label: cm,
                                            value: cm,
                                        }))}
                                        selectedValues={selectedFilters}
                                        onChange={(values) =>
                                            column.setFilterValue(
                                                values.length
                                                    ? values
                                                    : undefined,
                                            )
                                        }
                                    />
                                </div>
                            </SelectContent>
                        </Select>
                    </div>
                    <FilterTags
                        filters={selectedFilters}
                        onClear={(filterToRemove) => {
                            const newFilters = selectedFilters.filter(
                                (f) => f !== filterToRemove,
                            )
                            column.setFilterValue(
                                newFilters.length ? newFilters : undefined,
                            )
                        }}
                    />
                </div>
            )
        },
        cell: (info) => renderValue(info.getValue()),
        size: 250,
        filterFn: (row, columnId, filterValues) => {
            // If no filter selected, show all rows
            if (!filterValues || filterValues.length === 0) return true

            const caseManager = row.original.caseManager

            // Check if case manager matches any of the selected values
            return filterValues.some((filterValue: string) => {
                return caseManager === filterValue
            })
        },
    }),
    columnHelper.accessor('clientNumber', {
        header: () => <div>Number</div>,
        cell: (info) => renderValue(info.getValue()),
        size: 200,
    }),
    columnHelper.accessor('dateOfBirth', {
        header: () => <div>DOB</div>,
        cell: (info) => {
            const dateValue = info.getValue()
            const parsedDate = new Date(dateValue)
            return isNaN(parsedDate.getTime())
                ? renderValue(null)
                : renderValue(parsedDate.toLocaleDateString())
        },
        size: 180,
    }),
    columnHelper.accessor('age', {
        header: ({ column }) => {
            const ageRanges = [
                { label: '<17 yrs', value: 'lessThan17' },
                { label: '18-24 yrs', value: 'between18and24' },
                { label: '25-61 yrs', value: 'between25and61' },
                { label: '>62 yrs', value: 'greaterThan62' },
                { label: 'Unknown', value: 'unknown' },
            ]

            const selectedFilters = (column.getFilterValue() as string[]) ?? []

            return (
                <div className="flex w-full flex-col">
                    <div className="flex w-full items-center justify-between">
                        <div>Age</div>
                        <Select
                            onValueChange={(value) => {
                                if (value === 'all') {
                                    column.setFilterValue(undefined)
                                }
                            }}
                        >
                            <SelectTrigger className="h-[30px] w-[30px] border-none p-0 shadow-none focus:ring-0">
                                <Symbol symbol="filter_list" />
                            </SelectTrigger>
                            <SelectContent>
                                <div className="p-2">
                                    <MultiCheckbox
                                        options={ageRanges}
                                        selectedValues={selectedFilters}
                                        onChange={(values) =>
                                            column.setFilterValue(
                                                values.length
                                                    ? values
                                                    : undefined,
                                            )
                                        }
                                    />
                                </div>
                            </SelectContent>
                        </Select>
                    </div>
                    <FilterTags
                        filters={selectedFilters.map(
                            (filter) =>
                                ageRanges.find(
                                    (range) => range.value === filter,
                                )?.label || filter,
                        )}
                        onClear={(filterToRemove) => {
                            const filterValue = ageRanges.find(
                                (range) => range.label === filterToRemove,
                            )?.value
                            if (filterValue) {
                                const newFilters = selectedFilters.filter(
                                    (f) => f !== filterValue,
                                )
                                column.setFilterValue(
                                    newFilters.length ? newFilters : undefined,
                                )
                            }
                        }}
                    />
                </div>
            )
        },
        cell: (info) => renderValue(info.getValue()),
        size: 180,
        filterFn: (row, columnId, filterValues) => {
            // If no filter selected, show all rows
            if (!filterValues || filterValues.length === 0) return true

            const age = row.original.age
            const numericAge = typeof age === 'string' ? parseInt(age, 10) : age

            // Check if row age matches any selected range
            return filterValues.some((filterValue: string) => {
                if (filterValue === 'unknown') {
                    return age === null || age === undefined
                }
                if (typeof numericAge !== 'number' || isNaN(numericAge)) {
                    return false
                }
                if (filterValue === 'lessThan17') {
                    return numericAge < 17
                } else if (filterValue === 'between18and24') {
                    return numericAge >= 18 && numericAge <= 24
                } else if (filterValue === 'between25and61') {
                    return numericAge >= 25 && numericAge <= 61
                } else if (filterValue === 'greaterThan62') {
                    return numericAge > 62
                }
                return false
            })
        },
    }),
    columnHelper.accessor('gender', {
        header: ({ column }) => {
            const genderOptions = [
                { label: 'Male', value: 'Male' },
                { label: 'Female', value: 'Female' },
                { label: 'Nonbinary', value: 'Nonbinary' },
                { label: 'Other', value: 'Other' },
            ]

            const selectedFilters = (column.getFilterValue() as string[]) ?? []

            return (
                <div className="flex w-full flex-col">
                    <div className="flex w-full items-center justify-between">
                        <div>Gender</div>
                        <Select
                            onValueChange={(value) => {
                                if (value === 'all') {
                                    column.setFilterValue(undefined)
                                }
                            }}
                        >
                            <SelectTrigger className="h-[30px] w-[30px] border-none p-0 shadow-none focus:ring-0">
                                <Symbol symbol="filter_list" />
                            </SelectTrigger>
                            <SelectContent>
                                <div className="p-2">
                                    <MultiCheckbox
                                        options={genderOptions}
                                        selectedValues={selectedFilters}
                                        onChange={(values) =>
                                            column.setFilterValue(
                                                values.length
                                                    ? values
                                                    : undefined,
                                            )
                                        }
                                    />
                                </div>
                            </SelectContent>
                        </Select>
                    </div>
                    <FilterTags
                        filters={selectedFilters}
                        onClear={(filterToRemove) => {
                            const newFilters = selectedFilters.filter(
                                (f) => f !== filterToRemove,
                            )
                            column.setFilterValue(
                                newFilters.length ? newFilters : undefined,
                            )
                        }}
                    />
                </div>
            )
        },
        cell: (info) => renderValue(info.getValue()),
        size: 200,
        filterFn: (row, columnId, filterValues) => {
            // If no filter selected, show all rows
            if (!filterValues || filterValues.length === 0) return true

            const gender = row.original.gender

            // Check if gender matches any of the selected values
            return filterValues.some((filterValue: string) => {
                return gender === filterValue
            })
        },
    }),
    columnHelper.accessor('contactSource', {
        header: ({ column }) => {
            const contactSourceOptions = [
                { label: 'Outreach', value: 'Outreach' },
                { label: 'Police Department', value: 'Police Department' },
                {
                    label: 'City of Huntington Park',
                    value: 'City of Huntington Park',
                },
                { label: 'Community', value: 'Community' },
                { label: 'Service Provider', value: 'Service Provider' },
                { label: 'School Liaison', value: 'School Liaison' },
                { label: 'Other', value: 'Other' },
            ]

            const selectedFilters = (column.getFilterValue() as string[]) ?? []

            return (
                <div className="flex w-full flex-col">
                    <div className="flex w-full items-center justify-between">
                        <div>Contact Source</div>
                        <Select
                            onValueChange={(value) => {
                                if (value === 'all') {
                                    column.setFilterValue(undefined)
                                }
                            }}
                        >
                            <SelectTrigger className="h-[30px] w-[30px] border-none p-0 shadow-none focus:ring-0">
                                <Symbol symbol="filter_list" />
                            </SelectTrigger>
                            <SelectContent>
                                <div className="p-2">
                                    <MultiCheckbox
                                        options={contactSourceOptions}
                                        selectedValues={selectedFilters}
                                        onChange={(values) =>
                                            column.setFilterValue(
                                                values.length
                                                    ? values
                                                    : undefined,
                                            )
                                        }
                                    />
                                </div>
                            </SelectContent>
                        </Select>
                    </div>
                    <FilterTags
                        filters={selectedFilters}
                        onClear={(filterToRemove) => {
                            const newFilters = selectedFilters.filter(
                                (f) => f !== filterToRemove,
                            )
                            column.setFilterValue(
                                newFilters.length ? newFilters : undefined,
                            )
                        }}
                    />
                </div>
            )
        },
        cell: (info) => renderValue(info.getValue()),
        size: 200,
        filterFn: (row, columnId, filterValues) => {
            // If no filter selected, show all rows
            if (!filterValues || filterValues.length === 0) return true

            const contactSource = row.original.contactSource

            // Check if contact source matches any of the selected values
            return filterValues.some((filterValue: string) => {
                return contactSource === filterValue
            })
        },
    }),
    columnHelper.accessor('homeless', {
        header: ({ column }) => {
            const homelessOptions = [
                { label: 'Yes', value: 'Yes' },
                { label: 'No', value: 'No' },
                { label: 'At risk', value: 'At risk' },
            ]

            const selectedFilters = (column.getFilterValue() as string[]) ?? []

            return (
                <div className="flex w-full flex-col">
                    <div className="flex w-full items-center justify-between">
                        <div>Homeless</div>
                        <Select
                            onValueChange={(value) => {
                                if (value === 'all') {
                                    column.setFilterValue(undefined)
                                }
                            }}
                        >
                            <SelectTrigger className="h-[30px] w-[30px] border-none p-0 shadow-none focus:ring-0">
                                <Symbol symbol="filter_list" />
                            </SelectTrigger>
                            <SelectContent>
                                <div className="p-2">
                                    <MultiCheckbox
                                        options={homelessOptions}
                                        selectedValues={selectedFilters}
                                        onChange={(values) =>
                                            column.setFilterValue(
                                                values.length
                                                    ? values
                                                    : undefined,
                                            )
                                        }
                                    />
                                </div>
                            </SelectContent>
                        </Select>
                    </div>
                    <FilterTags
                        filters={selectedFilters}
                        onClear={(filterToRemove) => {
                            const newFilters = selectedFilters.filter(
                                (f) => f !== filterToRemove,
                            )
                            column.setFilterValue(
                                newFilters.length ? newFilters : undefined,
                            )
                        }}
                    />
                </div>
            )
        },
        cell: (info) => renderValue(info.getValue()),
        size: 200,
        filterFn: (row, columnId, filterValues) => {
            // If no filter selected, show all rows
            if (!filterValues || filterValues.length === 0) return true

            const homeless = row.original.homeless

            // Check if homeless status matches any of the selected values
            return filterValues.some((filterValue: string) => {
                return homeless === filterValue
            })
        },
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
        header: ({ column }) => {
            const citizenshipOptions = [
                { label: 'Resident', value: 'Resident' },
                { label: 'Citizen', value: 'Citizen' },
                { label: 'Undocumented', value: 'Undocumented' },
                { label: 'Other', value: 'Other' },
            ]

            const selectedFilters = (column.getFilterValue() as string[]) ?? []

            return (
                <div className="flex w-full flex-col">
                    <div className="flex w-full items-center justify-between">
                        <div>Citizenship</div>
                        <Select
                            onValueChange={(value) => {
                                if (value === 'all') {
                                    column.setFilterValue(undefined)
                                }
                            }}
                        >
                            <SelectTrigger className="h-[30px] w-[30px] border-none p-0 shadow-none focus:ring-0">
                                <Symbol symbol="filter_list" />
                            </SelectTrigger>
                            <SelectContent>
                                <div className="p-2">
                                    <MultiCheckbox
                                        options={citizenshipOptions}
                                        selectedValues={selectedFilters}
                                        onChange={(values) =>
                                            column.setFilterValue(
                                                values.length
                                                    ? values
                                                    : undefined,
                                            )
                                        }
                                    />
                                </div>
                            </SelectContent>
                        </Select>
                    </div>
                    <FilterTags
                        filters={selectedFilters}
                        onClear={(filterToRemove) => {
                            const newFilters = selectedFilters.filter(
                                (f) => f !== filterToRemove,
                            )
                            column.setFilterValue(
                                newFilters.length ? newFilters : undefined,
                            )
                        }}
                    />
                </div>
            )
        },
        cell: (info) => renderValue(info.getValue()),
        size: 200,
        filterFn: (row, columnId, filterValues) => {
            // If no filter selected, show all rows
            if (!filterValues || filterValues.length === 0) return true

            const citizenship = row.original.citizenship

            // Check if citizenship matches any of the selected values
            return filterValues.some((filterValue: string) => {
                return citizenship === filterValue
            })
        },
    }),
    columnHelper.accessor('ethnicity', {
        header: ({ column }) => {
            const ethnicityOptions = [
                { label: 'African American', value: 'African American' },
                { label: 'Asian', value: 'Asian' },
                { label: 'Latino/Hispanic', value: 'Latino/Hispanic' },
                { label: 'Native American', value: 'Native American' },
                { label: 'White/Caucasian', value: 'White/Caucasian' },
                { label: 'Other', value: 'Other' },
            ]

            const selectedFilters = (column.getFilterValue() as string[]) ?? []

            return (
                <div className="flex w-full flex-col">
                    <div className="flex w-full items-center justify-between">
                        <div>Ethnicity</div>
                        <Select
                            onValueChange={(value) => {
                                if (value === 'all') {
                                    column.setFilterValue(undefined)
                                }
                            }}
                        >
                            <SelectTrigger className="h-[30px] w-[30px] border-none p-0 shadow-none focus:ring-0">
                                <Symbol symbol="filter_list" />
                            </SelectTrigger>
                            <SelectContent>
                                <div className="p-2">
                                    <MultiCheckbox
                                        options={ethnicityOptions}
                                        selectedValues={selectedFilters}
                                        onChange={(values) =>
                                            column.setFilterValue(
                                                values.length
                                                    ? values
                                                    : undefined,
                                            )
                                        }
                                    />
                                </div>
                            </SelectContent>
                        </Select>
                    </div>
                    <FilterTags
                        filters={selectedFilters}
                        onClear={(filterToRemove) => {
                            const newFilters = selectedFilters.filter(
                                (f) => f !== filterToRemove,
                            )
                            column.setFilterValue(
                                newFilters.length ? newFilters : undefined,
                            )
                        }}
                    />
                </div>
            )
        },
        cell: (info) => renderValue(info.getValue()),
        size: 200,
        filterFn: (row, columnId, filterValues) => {
            // If no filter selected, show all rows
            if (!filterValues || filterValues.length === 0) return true

            const ethnicity = row.original.ethnicity // This is potentially string[] or undefined

            // If the row has no ethnicities, it cannot match any filter values
            if (!ethnicity || (ethnicity as string[]).length === 0) return false

            // Check if any of the row's ethnicities are present in the selected filterValues
            return (ethnicity as string[]).some((rowEthnicity) => {
                return (filterValues as string[]).includes(rowEthnicity)
            })
        },
    }),
    columnHelper.accessor('employment', {
        header: ({ column }) => {
            const employmentOptions = [
                { label: 'Part time', value: 'Part time' },
                { label: 'Full time', value: 'Full time' },
                { label: 'Unemployed', value: 'Unemployed' },
            ]

            const selectedFilters = (column.getFilterValue() as string[]) ?? []

            return (
                <div className="flex w-full flex-col">
                    <div className="flex w-full items-center justify-between">
                        <div>Employed</div>
                        <Select
                            onValueChange={(value) => {
                                if (value === 'all') {
                                    column.setFilterValue(undefined)
                                }
                            }}
                        >
                            <SelectTrigger className="h-[30px] w-[30px] border-none p-0 shadow-none focus:ring-0">
                                <Symbol symbol="filter_list" />
                            </SelectTrigger>
                            <SelectContent>
                                <div className="p-2">
                                    <MultiCheckbox
                                        options={employmentOptions}
                                        selectedValues={selectedFilters}
                                        onChange={(values) =>
                                            column.setFilterValue(
                                                values.length
                                                    ? values
                                                    : undefined,
                                            )
                                        }
                                    />
                                </div>
                            </SelectContent>
                        </Select>
                    </div>
                    <FilterTags
                        filters={selectedFilters}
                        onClear={(filterToRemove) => {
                            const newFilters = selectedFilters.filter(
                                (f) => f !== filterToRemove,
                            )
                            column.setFilterValue(
                                newFilters.length ? newFilters : undefined,
                            )
                        }}
                    />
                </div>
            )
        },
        cell: (info) => renderValue(info.getValue()),
        size: 200,
        filterFn: (row, columnId, filterValues) => {
            // If no filter selected, show all rows
            if (!filterValues || filterValues.length === 0) return true

            const employment = row.original.employment

            // Check if employment matches any of the selected values
            return (filterValues as string[]).some((filterValue: string) => {
                return employment === filterValue
            })
        },
    }),
    columnHelper.accessor('familySize', {
        header: ({ column }) => {
            const familySizeOptions = [
                { label: '1', value: '1' },
                { label: '2', value: '2' },
                { label: '3', value: '3' },
                { label: '4+', value: '4+' },
            ]

            const selectedFilters = (column.getFilterValue() as string[]) ?? []

            return (
                <div className="flex w-full flex-col">
                    <div className="flex w-full items-center justify-between">
                        <div>Family Size</div>
                        <Select
                            onValueChange={(value) => {
                                if (value === 'all') {
                                    column.setFilterValue(undefined)
                                }
                            }}
                        >
                            <SelectTrigger className="h-[30px] w-[30px] border-none p-0 shadow-none focus:ring-0">
                                <Symbol symbol="filter_list" />
                            </SelectTrigger>
                            <SelectContent>
                                <div className="p-2">
                                    <MultiCheckbox
                                        options={familySizeOptions}
                                        selectedValues={selectedFilters}
                                        onChange={(values) =>
                                            column.setFilterValue(
                                                values.length
                                                    ? values
                                                    : undefined,
                                            )
                                        }
                                    />
                                </div>
                            </SelectContent>
                        </Select>
                    </div>
                    <FilterTags
                        filters={selectedFilters}
                        onClear={(filterToRemove) => {
                            const newFilters = selectedFilters.filter(
                                (f) => f !== filterToRemove,
                            )
                            column.setFilterValue(
                                newFilters.length ? newFilters : undefined,
                            )
                        }}
                    />
                </div>
            )
        },
        cell: (info) => renderValue(info.getValue()),
        size: 200,
        filterFn: (row, columnId, filterValues) => {
            // If no filter selected, show all rows
            if (!filterValues || filterValues.length === 0) return true

            const familySize = row.original.familySize
            const numericFamilySize =
                typeof familySize === 'string'
                    ? parseInt(familySize, 10)
                    : familySize

            // Check if family size matches any selected range/value
            return (filterValues as string[]).some((filterValue: string) => {
                if (filterValue === '4+') {
                    return (
                        typeof numericFamilySize === 'number' &&
                        !isNaN(numericFamilySize) &&
                        numericFamilySize >= 4
                    )
                } else {
                    return (
                        typeof numericFamilySize === 'number' &&
                        !isNaN(numericFamilySize) &&
                        numericFamilySize === parseInt(filterValue, 10)
                    )
                }
            })
        },
    }),
    columnHelper.accessor('mentalHealthConditions', {
        header: ({ column }) => {
            const options = [
                { label: 'Yes', value: 'Yes' },
                { label: 'No', value: 'No' },
            ]

            const selectedFilters = (column.getFilterValue() as string[]) ?? []

            return (
                <div className="flex w-full flex-col">
                    <div className="flex w-full items-center justify-between">
                        <div>Mental Health Conditions</div>
                        <Select
                            onValueChange={(value) => {
                                if (value === 'all') {
                                    column.setFilterValue(undefined)
                                }
                            }}
                        >
                            <SelectTrigger className="h-[30px] w-[30px] border-none p-0 shadow-none focus:ring-0">
                                <Symbol symbol="filter_list" />
                            </SelectTrigger>
                            <SelectContent>
                                <div className="p-2">
                                    <MultiCheckbox
                                        options={options}
                                        selectedValues={selectedFilters}
                                        onChange={(values) =>
                                            column.setFilterValue(
                                                values.length
                                                    ? values
                                                    : undefined,
                                            )
                                        }
                                    />
                                </div>
                            </SelectContent>
                        </Select>
                    </div>
                    <FilterTags
                        filters={selectedFilters}
                        onClear={(filterToRemove) => {
                            const newFilters = selectedFilters.filter(
                                (f) => f !== filterToRemove,
                            )
                            column.setFilterValue(
                                newFilters.length ? newFilters : undefined,
                            )
                        }}
                    />
                </div>
            )
        },
        cell: (info) => renderValue(info.getValue(), true),
        size: 260,
        filterFn: (row, columnId, filterValues) => {
            if (!filterValues || filterValues.length === 0) return true
            const value = row.original.mentalHealthConditions
            return filterValues.some(
                (filterValue: string) => value === filterValue,
            )
        },
    }),
    columnHelper.accessor('medicalConditions', {
        header: ({ column }) => {
            const options = [
                { label: 'Yes', value: 'Yes' },
                { label: 'No', value: 'No' },
            ]

            const selectedFilters = (column.getFilterValue() as string[]) ?? []

            return (
                <div className="flex w-full flex-col">
                    <div className="flex w-full items-center justify-between">
                        <div>Medical Conditions</div>
                        <Select
                            onValueChange={(value) => {
                                if (value === 'all') {
                                    column.setFilterValue(undefined)
                                }
                            }}
                        >
                            <SelectTrigger className="h-[30px] w-[30px] border-none p-0 shadow-none focus:ring-0">
                                <Symbol symbol="filter_list" />
                            </SelectTrigger>
                            <SelectContent>
                                <div className="p-2">
                                    <MultiCheckbox
                                        options={options}
                                        selectedValues={selectedFilters}
                                        onChange={(values) =>
                                            column.setFilterValue(
                                                values.length
                                                    ? values
                                                    : undefined,
                                            )
                                        }
                                    />
                                </div>
                            </SelectContent>
                        </Select>
                    </div>
                    <FilterTags
                        filters={selectedFilters}
                        onClear={(filterToRemove) => {
                            const newFilters = selectedFilters.filter(
                                (f) => f !== filterToRemove,
                            )
                            column.setFilterValue(
                                newFilters.length ? newFilters : undefined,
                            )
                        }}
                    />
                </div>
            )
        },
        cell: (info) => renderValue(info.getValue(), true),
        size: 230,
        filterFn: (row, columnId, filterValues) => {
            if (!filterValues || filterValues.length === 0) return true
            const value = row.original.medicalConditions
            return filterValues.some(
                (filterValue: string) => value === filterValue,
            )
        },
    }),
    columnHelper.accessor('substanceAbuse', {
        header: ({ column }) => {
            const options = [
                { label: 'Yes', value: 'Yes' },
                { label: 'No', value: 'No' },
            ]

            const selectedFilters = (column.getFilterValue() as string[]) ?? []

            return (
                <div className="flex w-full flex-col">
                    <div className="flex w-full items-center justify-between">
                        <div>Substance Abuse</div>
                        <Select
                            onValueChange={(value) => {
                                if (value === 'all') {
                                    column.setFilterValue(undefined)
                                }
                            }}
                        >
                            <SelectTrigger className="h-[30px] w-[30px] border-none p-0 shadow-none focus:ring-0">
                                <Symbol symbol="filter_list" />
                            </SelectTrigger>
                            <SelectContent>
                                <div className="p-2">
                                    <MultiCheckbox
                                        options={options}
                                        selectedValues={selectedFilters}
                                        onChange={(values) =>
                                            column.setFilterValue(
                                                values.length
                                                    ? values
                                                    : undefined,
                                            )
                                        }
                                    />
                                </div>
                            </SelectContent>
                        </Select>
                    </div>
                    <FilterTags
                        filters={selectedFilters}
                        onClear={(filterToRemove) => {
                            const newFilters = selectedFilters.filter(
                                (f) => f !== filterToRemove,
                            )
                            column.setFilterValue(
                                newFilters.length ? newFilters : undefined,
                            )
                        }}
                    />
                </div>
            )
        },
        cell: (info) => renderValue(info.getValue(), true),
        size: 230,
        filterFn: (row, columnId, filterValues) => {
            if (!filterValues || filterValues.length === 0) return true
            const value = row.original.substanceAbuse
            return filterValues.some(
                (filterValue: string) => value === filterValue,
            )
        },
    }),
    columnHelper.accessor('fosterYouth', {
        header: ({ column }) => {
            const options = [
                { label: 'Yes', value: 'Yes' },
                { label: 'No', value: 'No' },
            ]

            const selectedFilters = (column.getFilterValue() as string[]) ?? []

            return (
                <div className="flex w-full flex-col">
                    <div className="flex w-full items-center justify-between">
                        <div>Foster Youth</div>
                        <Select
                            onValueChange={(value) => {
                                if (value === 'all') {
                                    column.setFilterValue(undefined)
                                }
                            }}
                        >
                            <SelectTrigger className="h-[30px] w-[30px] border-none p-0 shadow-none focus:ring-0">
                                <Symbol symbol="filter_list" />
                            </SelectTrigger>
                            <SelectContent>
                                <div className="p-2">
                                    <MultiCheckbox
                                        options={options}
                                        selectedValues={selectedFilters}
                                        onChange={(values) =>
                                            column.setFilterValue(
                                                values.length
                                                    ? values
                                                    : undefined,
                                            )
                                        }
                                    />
                                </div>
                            </SelectContent>
                        </Select>
                    </div>
                    <FilterTags
                        filters={selectedFilters}
                        onClear={(filterToRemove) => {
                            const newFilters = selectedFilters.filter(
                                (f) => f !== filterToRemove,
                            )
                            column.setFilterValue(
                                newFilters.length ? newFilters : undefined,
                            )
                        }}
                    />
                </div>
            )
        },
        cell: (info) => renderValue(info.getValue(), true),
        size: 230,
        filterFn: (row, columnId, filterValues) => {
            if (!filterValues || filterValues.length === 0) return true
            const value = row.original.fosterYouth
            return filterValues.some(
                (filterValue: string) => value === filterValue,
            )
        },
    }),
    columnHelper.accessor('openCPS', {
        header: ({ column }) => {
            const options = [
                { label: 'Yes', value: 'Yes' },
                { label: 'No', value: 'No' },
            ]

            const selectedFilters = (column.getFilterValue() as string[]) ?? []

            return (
                <div className="flex w-full flex-col">
                    <div className="flex w-full items-center justify-between">
                        <div>Open CPS Case</div>
                        <Select
                            onValueChange={(value) => {
                                if (value === 'all') {
                                    column.setFilterValue(undefined)
                                }
                            }}
                        >
                            <SelectTrigger className="h-[30px] w-[30px] border-none p-0 shadow-none focus:ring-0">
                                <Symbol symbol="filter_list" />
                            </SelectTrigger>
                            <SelectContent>
                                <div className="p-2">
                                    <MultiCheckbox
                                        options={options}
                                        selectedValues={selectedFilters}
                                        onChange={(values) =>
                                            column.setFilterValue(
                                                values.length
                                                    ? values
                                                    : undefined,
                                            )
                                        }
                                    />
                                </div>
                            </SelectContent>
                        </Select>
                    </div>
                    <FilterTags
                        filters={selectedFilters}
                        onClear={(filterToRemove) => {
                            const newFilters = selectedFilters.filter(
                                (f) => f !== filterToRemove,
                            )
                            column.setFilterValue(
                                newFilters.length ? newFilters : undefined,
                            )
                        }}
                    />
                </div>
            )
        },
        cell: (info) => renderValue(info.getValue(), true),
        size: 250,
        filterFn: (row, columnId, filterValues) => {
            if (!filterValues || filterValues.length === 0) return true
            const value = row.original.openCPS
            return filterValues.some(
                (filterValue: string) => value === filterValue,
            )
        },
    }),
    columnHelper.accessor('openProbation', {
        header: ({ column }) => {
            const options = [
                { label: 'Yes', value: 'Yes' },
                { label: 'No', value: 'No' },
            ]

            const selectedFilters = (column.getFilterValue() as string[]) ?? []

            return (
                <div className="flex w-full flex-col">
                    <div className="flex w-full items-center justify-between">
                        <div>Open Probation Case</div>
                        <Select
                            onValueChange={(value) => {
                                if (value === 'all') {
                                    column.setFilterValue(undefined)
                                }
                            }}
                        >
                            <SelectTrigger className="h-[30px] w-[30px] border-none p-0 shadow-none focus:ring-0">
                                <Symbol symbol="filter_list" />
                            </SelectTrigger>
                            <SelectContent>
                                <div className="p-2">
                                    <MultiCheckbox
                                        options={options}
                                        selectedValues={selectedFilters}
                                        onChange={(values) =>
                                            column.setFilterValue(
                                                values.length
                                                    ? values
                                                    : undefined,
                                            )
                                        }
                                    />
                                </div>
                            </SelectContent>
                        </Select>
                    </div>
                    <FilterTags
                        filters={selectedFilters}
                        onClear={(filterToRemove) => {
                            const newFilters = selectedFilters.filter(
                                (f) => f !== filterToRemove,
                            )
                            column.setFilterValue(
                                newFilters.length ? newFilters : undefined,
                            )
                        }}
                    />
                </div>
            )
        },
        cell: (info) => renderValue(info.getValue(), true),
        size: 250,
        filterFn: (row, columnId, filterValues) => {
            if (!filterValues || filterValues.length === 0) return true
            const value = row.original.openProbation
            return filterValues.some(
                (filterValue: string) => value === filterValue,
            )
        },
    }),
    columnHelper.accessor('sexOffender', {
        header: ({ column }) => {
            const options = [
                { label: 'Yes', value: 'Yes' },
                { label: 'No', value: 'No' },
            ]

            const selectedFilters = (column.getFilterValue() as string[]) ?? []

            return (
                <div className="flex w-full flex-col">
                    <div className="flex w-full items-center justify-between">
                        <div>Sex Offender</div>
                        <Select
                            onValueChange={(value) => {
                                if (value === 'all') {
                                    column.setFilterValue(undefined)
                                }
                            }}
                        >
                            <SelectTrigger className="h-[30px] w-[30px] border-none p-0 shadow-none focus:ring-0">
                                <Symbol symbol="filter_list" />
                            </SelectTrigger>
                            <SelectContent>
                                <div className="p-2">
                                    <MultiCheckbox
                                        options={options}
                                        selectedValues={selectedFilters}
                                        onChange={(values) =>
                                            column.setFilterValue(
                                                values.length
                                                    ? values
                                                    : undefined,
                                            )
                                        }
                                    />
                                </div>
                            </SelectContent>
                        </Select>
                    </div>
                    <FilterTags
                        filters={selectedFilters}
                        onClear={(filterToRemove) => {
                            const newFilters = selectedFilters.filter(
                                (f) => f !== filterToRemove,
                            )
                            column.setFilterValue(
                                newFilters.length ? newFilters : undefined,
                            )
                        }}
                    />
                </div>
            )
        },
        cell: (info) => renderValue(info.getValue(), true),
        size: 200,
        filterFn: (row, columnId, filterValues) => {
            if (!filterValues || filterValues.length === 0) return true
            const value = row.original.sexOffender
            return filterValues.some(
                (filterValue: string) => value === filterValue,
            )
        },
    }),
]
