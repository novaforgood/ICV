'use client'

import { ContactTypeBadge } from '@/app/_components/ContactTypeBadge'
import { roundToNearest10Minutes } from '@/utils/dateUtils'
import { ContactType } from '@/types/event-types'
import Autocomplete from '@mui/material/Autocomplete'
import TextField from '@mui/material/TextField'
import { LocalizationProvider, TimePicker } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import dayjs from 'dayjs'
import React from 'react'

interface CheckInFormFieldsProps {
    date: string
    setDate: (v: string) => void
    startTime: string
    setStartTime: (v: string) => void
    endTime: string
    setEndTime: (v: string) => void
    assigneeId: string
    setAssigneeId: (v: string) => void
    staffNames: string[]
    location: string
    setLocation: (v: string) => void
    contactType: string
    setContactType: (v: string) => void
}

const CheckInFormFields: React.FC<CheckInFormFieldsProps> = ({
    date,
    setDate,
    startTime,
    setStartTime,
    endTime,
    setEndTime,
    assigneeId,
    setAssigneeId,
    staffNames,
    location,
    setLocation,
    contactType,
    setContactType,
}) => {
    return (
        <>
            <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                    Date
                </label>
                <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="focus:ring-blue-500 w-full rounded-lg border border-gray-300 p-3 focus:border-transparent focus:ring-2"
                    required
                />
            </div>

            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <div className="flex flex-col gap-4 sm:flex-row">
                    <div className="min-w-0 flex-1">
                        <TimePicker
                            label="Start time"
                            value={
                                date && startTime
                                    ? dayjs(
                                          roundToNearest10Minutes(
                                              new Date(`${date}T${startTime}`),
                                          ),
                                      )
                                    : null
                            }
                            onChange={(newValue) =>
                                setStartTime(
                                    newValue ? newValue.format('HH:mm') : '',
                                )
                            }
                            minutesStep={5}
                            timeSteps={{ minutes: 5 }}
                            slotProps={{
                                textField: {
                                    required: true,
                                    fullWidth: true,
                                    size: 'small',
                                },
                            }}
                        />
                    </div>
                    <div className="min-w-0 flex-1">
                        <TimePicker
                            label="End time"
                            value={
                                date && endTime
                                    ? dayjs(
                                          roundToNearest10Minutes(
                                              new Date(`${date}T${endTime}`),
                                          ),
                                      )
                                    : null
                            }
                            onChange={(newValue) =>
                                setEndTime(
                                    newValue ? newValue.format('HH:mm') : '',
                                )
                            }
                            minutesStep={5}
                            timeSteps={{ minutes: 5 }}
                            slotProps={{
                                textField: {
                                    required: true,
                                    fullWidth: true,
                                    size: 'small',
                                },
                            }}
                        />
                    </div>
                </div>
            </LocalizationProvider>

            <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                    Staff
                </label>
                <Autocomplete
                    disableClearable
                    value={assigneeId ?? ''}
                    onChange={(_, newValue) => setAssigneeId(newValue ?? '')}
                    options={
                        assigneeId && !staffNames.includes(assigneeId)
                            ? [assigneeId, ...staffNames]
                            : staffNames
                    }
                    getOptionLabel={(option) => option}
                    filterOptions={(options, state) => {
                        const input = state.inputValue.trim().toLowerCase()
                        if (!input) return options
                        return options.filter((option) =>
                            option.toLowerCase().includes(input),
                        )
                    }}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            placeholder="Search staff..."
                            size="small"
                        />
                    )}
                />
            </div>

            <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                    Location
                </label>
                <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Enter location"
                    className="focus:ring-blue-500 w-full rounded-lg border border-gray-300 p-3 focus:border-transparent focus:ring-2"
                />
            </div>

            <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                    Contact code
                </label>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    {Object.values(ContactType.Values).map((type) => (
                        <div key={type} className="flex items-center gap-2">
                            <input
                                type="radio"
                                id={type
                                    .toLowerCase()
                                    .replace(/\s+/g, '-')}
                                name="contact-code"
                                checked={contactType === type}
                                onChange={() => setContactType(type)}
                                className="h-4 w-4"
                            />
                            <label
                                htmlFor={type
                                    .toLowerCase()
                                    .replace(/\s+/g, '-')}
                            >
                                <ContactTypeBadge type={type} />
                            </label>
                        </div>
                    ))}
                </div>
            </div>
        </>
    )
}

export default CheckInFormFields
