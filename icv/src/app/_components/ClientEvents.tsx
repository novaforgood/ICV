'use client'

import { createEvent } from '@/api/make-cases/make-event'
import { useLocalStorageForm } from '@/hooks/saveFormLocally'
import { CaseEventSchema, ContactType } from '@/types/event-types'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'

interface ClientEventsProps {
    clientID: string // Accept clientId as a prop
    refetchEvents: () => Promise<void>
}

export default function ClientEvents({
    clientID,
    refetchEvents,
}: ClientEventsProps) {
    const storageKey = 'client-event-form${clientID}' // changes when different client is loaded

    // register takes all input and makes it into a single object to return as data
    // handleSubmit prevents default form submission behavior; it validates the form, collects values, calls custom func, etc.
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset,
        watch, // track form changes
        setValue, // used to set the values of the form when loading saved info
        // onChange makes error messages appear/disappear dynamically
    } = useForm({ mode: 'onChange', resolver: zodResolver(CaseEventSchema) })

    useLocalStorageForm({
        storageKey: `client-events-${clientID}`, // Unique storage key for each client
        watch,
        setValue,
    })

    const onSubmit = async (data: any) => {
        console.log(data) // just prints the data collected into console

        await createEvent({
            clientId: clientID, // Use the clientId passed as a prop
            date: data.date,
            contactType: data.contactType,
            description: data.description,
        })
        // await createDog({
        //     name: data.contactType,
        //     breed: data.description,
        //     age: 1,
        // })

        //localStorage.removeItem(storageKey) // no longer save info to local storage when form is submitted
        reset()
        await refetchEvents()
    }

    return (
        <div>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <h2 className="font-bold"> Client Case Notes: </h2>

                {/* Field 1: Date of Intake */}
                <div className="flex space-x-3">
                    <label>Date of Intake:</label>
                    <input
                        type="date"
                        {...register('date')}
                        className="w-[30%]rounded border p-2"
                    />
                </div>
                {/* Display error message for 'date' field */}
                {errors.date && (
                    <span className="mt-1 text-sm text-red-500">
                        {(errors.date as any)?.message}
                    </span>
                )}

                {/* Field 2: Contact Type (Dropdown) */}
                <div className="flex space-x-3">
                    <label>Contact Code:</label>
                    <select
                        {...register('contactType')}
                        className="w-[25%] rounded border p-2"
                        defaultValue=""
                    >
                        <option value="" disabled>
                            Select Contact Type
                        </option>
                        {/* ContactType is a zod enum; has a .Values property returning an array of all the actual contact types */}
                        {/* loops through each value in the array and returns a new <option> element */}
                        {Object.values(ContactType.Values).map((type) => (
                            // key = unique key for each item, value = the actual value the user selects
                            <option key={type} value={type}>
                                {/* type displays the readable text inside the dropdown */}
                                {type}
                            </option>
                        ))}
                    </select>
                </div>
                {/* Display error message for 'contactType' field */}
                {errors.contactType && (
                    <span className="mt-1 text-sm text-red-500">
                        {(errors.contactType as any)?.message}
                    </span>
                )}

                {/* Field 3: Notes */}
                <div className="flex space-x-3">
                    <label>Notes:</label>
                    <textarea
                        {...register('description')}
                        placeholder="Enter details..."
                        className="w-[70%] rounded border p-4"
                    />
                </div>

                <div className="space-x-4">
                    <button
                        type="submit"
                        className={`mt-4 rounded p-2 text-white ${isSubmitting ? 'cursor-not-allowed bg-gray-400' : 'bg-blue-500'}`}
                        disabled={isSubmitting} // Disable button when form is submitting
                    >
                        {isSubmitting ? 'Submitting...' : 'Add Event'}
                    </button>
                    {/* Cancel Button */}
                    <button
                        type="button"
                        className="`mt-4 rounded bg-blue-500 p-2 text-white"
                        onClick={() => {
                            reset() // Clears form fields
                            localStorage.removeItem(storageKey) // Deletes saved data
                        }}
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    )
}
