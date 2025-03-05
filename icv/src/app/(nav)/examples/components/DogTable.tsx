'use client'

import { getAllDogs } from '@/api/examples/examples'
import { Dog } from '@/types/example-types'
import {
    flexRender,
    getCoreRowModel,
    useReactTable,
} from '@tanstack/react-table'
import React, { useMemo } from 'react'
import useSWR from 'swr'

// SWR fetcher function
const fetchDogs = async (): Promise<Dog[]> => {
    const dogs = await getAllDogs()
    return dogs
}

const DogTable: React.FC = () => {
    // Use SWR for fetching dogs
    const { data: dogs, error, isLoading } = useSWR('dogs', fetchDogs)

    // Define table columns
    const columns = useMemo(
        () => [
            {
                accessorKey: 'name', // Access key in the data object
                header: 'Name',
            },
            {
                accessorKey: 'age',
                header: 'Age',
            },
            {
                accessorKey: 'breed',
                header: 'Breed',
                cell: ({ row }: any) => row.original.breed || 'Unknown', // Handle optional field
            },
            {
                accessorKey: 'isGoodBoy',
                header: 'Is Good Boy?',
                cell: ({ row }: any) => (row.original.isGoodBoy ? 'Yes' : 'No'),
            },
        ],
        [],
    )

    // Table instance
    const table = useReactTable({
        data: dogs || [], // Ensure data is an array even if SWR hasn't loaded yet
        columns,
        getCoreRowModel: getCoreRowModel(),
    })

    // Handle loading and error states
    if (isLoading) return <div>Loading...</div>
    if (error) return <div>Error loading data: {error.message}</div>

    return (
        <div>
            <h1>Dogs Table</h1>
            <table>
                <thead>
                    {table.getHeaderGroups().map((headerGroup) => (
                        <tr key={headerGroup.id}>
                            {headerGroup.headers.map((header) => (
                                <th key={header.id}>
                                    {flexRender(
                                        header.column.columnDef.header,
                                        header.getContext(),
                                    )}
                                </th>
                            ))}
                        </tr>
                    ))}
                </thead>
                <tbody>
                    {table.getRowModel().rows.map((row) => (
                        <tr key={row.id}>
                            {row.getVisibleCells().map((cell) => (
                                <td key={cell.id}>
                                    {flexRender(
                                        cell.column.columnDef.cell,
                                        cell.getContext(),
                                    )}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default DogTable
