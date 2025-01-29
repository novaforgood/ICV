'use client'

import { CaseEventSchema, ContactType } from '@/types/event-types'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'

export default function ClientEvents() {
    // register takes all input and makes it into a single object to return as data
    // handleSubmit prevents default form submission behavior; it validates the form, collects values, calls custom func, etc.
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        mode: 'onChange',
        resolver: zodResolver(CaseEventSchema),
    })

    const onSubmit = (data: any) => {
        console.log(data) // just prints the data collected into console
    }

    return (
        <div>
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="space-y-4"
                style={{ padding: '50px' }}
            >
                <h2> Client Case Notes </h2>

                {/* Field 1: Date of Intake */}
                <div className="flex space-x-3">
                    <label>Date of Intake:</label>
                    <input
                        type="date"
                        {...register('date')}
                        className="w-[30%]rounded border p-2"
                    />
                </div>

                {/* Field 2: Contact Type (Dropdown) */}
                <div className="flex space-x-3">
                    <label>Contact Code:</label>
                    <select
                        {...register('contactType')}
                        className="w-[10%] rounded border p-2"
                    >
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

                {/* Field 3: Notes */}
                <div className="flex space-x-3">
                    <label>Notes:</label>
                    <input
                        type="text"
                        {...register('description')}
                        placeholder="Enter details..."
                        className="w-[70%] rounded border p-4"
                    />
                </div>

                {errors && <PrintComponent stuffToprint={errors} />}
                <button
                    type="submit"
                    className="mt-4 rounded bg-blue-500 p-2 text-white"
                >
                    Add Event
                </button>
            </form>
        </div>
    )
}

function PrintComponent(stuffToprint: any) {
    console.log(stuffToprint)
    return <div>printed</div>
}
