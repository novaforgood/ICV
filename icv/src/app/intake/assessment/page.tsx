'use client'

import { createClient } from '@/api/make-cases/make-case'
import { Client, ClientSchema } from '@/types/client-types'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'

interface Props {}

const page = (props: Props) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<Client>({
        mode: 'onChange',
        resolver: zodResolver(ClientSchema.partial()),
    })

    const onSubmit = (data: Client) => {
        // console.log('Loading...')
        // console.log(errors)
        createClient(data)
        console.log(data)
    }

    const router = useRouter()
    return (
        <div>
            <form onSubmit={handleSubmit(onSubmit)}>
                {/* Additional notes */}
                <div>
                    <label>Notes</label>
                    <textarea
                        {...register('notes')}
                        placeholder="Additional Notes"
                        className="w-full rounded border p-2"
                    />
                </div>

                {/* Medical and mental health information */}
                <div>
                    <label>Substance Abuse Details</label>
                    <input
                        {...register('substanceAbuseDetails')}
                        type="text"
                        placeholder="Substance Abuse Details"
                        className="w-full rounded border p-2"
                    />
                </div>
                <div>
                    <label>Medical Conditions</label>
                    <input
                        {...register('medicalConditions')}
                        type="text"
                        placeholder="Medical Conditions"
                        className="w-full rounded border p-2"
                    />
                </div>
                <div>
                    <label>Mental Health Diagnosis</label>
                    <input
                        {...register('mentalHealthDiagnosis')}
                        type="text"
                        placeholder="Mental Health Diagnosis"
                        className="w-full rounded border p-2"
                    />
                </div>

                {/* Program and intake details */}
                <div className="flex space-x-5">
                    <div>
                        <label>Program</label>
                        <input
                            {...register('program')}
                            type="text"
                            placeholder="Program"
                            className="w-full rounded border p-2"
                        />
                        {errors.program && (
                            <span className="mt-1 text-sm text-red-500">
                                {(errors.program as any)?.message}
                            </span>
                        )}
                    </div>
                    <div>
                        <label>Intake Date</label>
                        <input
                            {...register('intakeDate')}
                            type="date"
                            className="w-full rounded border p-2"
                        />
                    </div>
                    <div>
                        <label>Primary Language</label>
                        <input
                            {...register('primaryLanguage')}
                            type="text"
                            placeholder="Primary Language"
                            className="w-full rounded border p-2"
                        />
                    </div>
                    <div>
                        <label>Client Code</label>
                        <input
                            {...register('clientCode')}
                            type="text"
                            placeholder="Client Code"
                            className="w-full rounded border p-2"
                        />
                        {errors.clientCode && (
                            <span className="mt-1 text-sm text-red-500">
                                {(errors.clientCode as any)?.message}
                            </span>
                        )}
                    </div>
                </div>

                {/* Housing and referral details */}
                <div className="flex space-x-5">
                    <div>
                        <label>Housing Type</label>
                        <input
                            {...register('housingType')}
                            type="text"
                            placeholder="Housing Type"
                            className="w-full rounded border p-2"
                        />
                    </div>
                    <div>
                        <label>Birthplace</label>
                        <input
                            {...register('birthplace')}
                            type="text"
                            placeholder="Birthplace"
                            className="w-full rounded border p-2"
                        />
                    </div>
                    <div>
                        <label>Referral Source</label>
                        <input
                            {...register('referralSource')}
                            type="text"
                            placeholder="Referral Source"
                            className="w-full rounded border p-2"
                        />
                    </div>
                </div>

                {/* Assessment and client details */}
                <div className="flex space-x-5">
                    <div>
                        <label>Needs Assessment</label>
                        <input
                            {...register('needsAssessment')}
                            type="text"
                            placeholder="Needs Assessment"
                            className="w-full rounded border p-2"
                        />
                    </div>
                    <div>
                        <label>Open Client with Child/Family Services</label>
                        <select
                            {...register('openClientWithChildFamilyServices')}
                            className="w-full rounded border p-2"
                        >
                            <option value="Yes, Currently">
                                Yes, Currently
                            </option>
                            <option value="Yes, Previously">
                                Yes, Previously
                            </option>
                            <option value="No">No</option>
                        </select>
                    </div>
                    <div>
                        <label>Previous Arrests</label>
                        <input
                            {...register('previousArrests')}
                            type="checkbox"
                        />
                    </div>
                    <div>
                        <label>Probation Status</label>
                        <select
                            {...register('probationStatus')}
                            className="w-full rounded border p-2"
                        >
                            <option value="No">No</option>
                            <option value="Yes, Previously">
                                Yes, Previously
                            </option>
                            <option value="Yes, Currently">
                                Yes, Currently
                            </option>
                        </select>
                    </div>
                </div>

                {/* Education and employment */}
                <div className="flex space-x-5">
                    <div>
                        <label>Has High School Diploma</label>
                        <input
                            {...register('education.hasHighSchoolDiploma')}
                            type="checkbox"
                        />
                    </div>
                    <div>
                        <label>Foster Youth Status</label>
                        <select
                            {...register('education.fosterYouthStatus')}
                            className="w-full rounded border p-2"
                        >
                            <option value="Yes, Currently">
                                Yes, Currently
                            </option>
                            <option value="Yes, Previously">
                                Yes, Previously
                            </option>
                            <option value="No">No</option>
                        </select>
                    </div>
                    <div>
                        <label>Employment Status</label>
                        <select
                            {...register('employmentStatus')}
                            className="w-full rounded border p-2"
                        >
                            <option value="No">No</option>
                            <option value="Yes, Part-Time">
                                Yes, Part-Time
                            </option>
                            <option value="Yes, Full-Time">
                                Yes, Full-Time
                            </option>
                        </select>
                    </div>
                </div>
                <div className="space-x-4">
                    <button
                        type="button"
                        onClick={() => router.push('/intake')}
                        className="mt-4 rounded bg-blue-500 p-2 text-white"
                    >
                        Back
                    </button>
                    <button
                        type="submit"
                        className="mt-4 rounded bg-blue-500 p-2 text-white"
                    >
                        Submit
                    </button>
                </div>
            </form>
        </div>
    )
}

export default page
