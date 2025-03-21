'use client'

import { getAllEvents } from '@/api/events'
import { CaseEventType } from '@/types/event-types'
import {
    flexRender,
    getCoreRowModel,
    useReactTable,
} from '@tanstack/react-table'
import React, { useMemo } from 'react'
import useSWR from 'swr'
import useClientNames from '../_hooks/useClientNames'

// SWR fetcher function
const fetchEvents = async (): Promise<CaseEventType[]> => {
    const events = await getAllEvents()
    return events
}

const EventsTable: React.FC = () => {
    const { data: events, error, isLoading } = useSWR('events', fetchEvents)
    const { clientNames, error: clientNamesError } = useClientNames(events)

    // Define table columns
    const columns = useMemo(
        () => [
            {
                accessorKey: 'clientId', // Use clientId to access client names
                header: 'Client Name',
                cell: ({ row }: any) =>
                    clientNames.get(String(row.original.clientId)) ||
                    'Loading...', // Use clientNames map
            },
            {
                accessorKey: 'name',
                header: 'Event Name',
            },
            {
                accessorKey: 'location',
                header: 'Location',
            },
            {
                accessorKey: 'date',
                header: 'Start Time',
                cell: ({ row }: any) =>
                    new Date(row.original.date).toLocaleString(), // Format start time
            },
            {
                accessorKey: 'endTime',
                header: 'End Time',
                cell: ({ row }: any) => {
                    const startTime = new Date(row.original.date)
                    const endTime = new Date(
                        startTime.getTime() +
                            (row.original.duration || 0) * 60 * 60 * 1000,
                    )
                    return endTime.toLocaleString()
                },
            },
            {
                accessorKey: 'employeeId',
                header: 'Employee ID',
            },
        ],
        [clientNames],
    )

    // Table instance
    const table = useReactTable({
        data: events || [], // Ensure data is an array even if SWR hasn't loaded yet
        columns,
        getCoreRowModel: getCoreRowModel(),
    })

    // Handle loading and error states
    if (isLoading) return <div>Loading...</div>
    if (error) return <div>Error loading data: {error.message}</div>
    if (clientNamesError)
        return <div>Error loading client names: {clientNamesError.message}</div>

    return (
        <div>
            <h1>Events</h1>
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

export default EventsTable
