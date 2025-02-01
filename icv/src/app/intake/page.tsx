'use client'

import { createClient } from '@/api/make-cases/make-case'
import { Client, ClientSchema } from '@/types/client-types'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'

const page = () => {
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

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-4"
            style={{ padding: '50px' }}
        >
            {/* Basic client details */}
            <div className="flex space-x-5">
                <div>
                    <label>First Name</label>
                    <input
                        {...register('firstName')}
                        type="text"
                        placeholder="First Name"
                        className="w-full rounded border p-2"
                    />
                    {/* Display error message for 'firstName' field */}
                    {errors.firstName && (
                        <span className="mt-1 text-sm text-red-500">
                            {(errors.firstName as any)?.message}
                        </span>
                    )}
                </div>
                <div>
                    <label>Last Name</label>
                    <input
                        {...register('lastName')}
                        type="text"
                        placeholder="Last Name"
                        className="w-full rounded border p-2"
                    />
                    {errors.lastName && (
                        <span className="mt-1 text-sm text-red-500">
                            {(errors.lastName as any)?.message}
                        </span>
                    )}
                </div>
                <div>
                    <label>Middle Initial</label>
                    <input
                        {...register('middleInitial')}
                        type="text"
                        placeholder="Middle Initial"
                        className="w-full rounded border p-2"
                    />
                    {errors.middleInitial && (
                        <span className="mt-1 text-sm text-red-500">
                            {(errors.middleInitial as any)?.message}
                        </span>
                    )}
                </div>
            </div>

            <div className="flex space-x-5">
                <div>
                    <label>Date of Birth</label>
                    <input
                        {...register('dateOfBirth', {
                            valueAsDate: true,
                        })}
                        type="date"
                        className="w-full rounded border p-2"
                    />
                    {errors.dateOfBirth && (
                        <span className="mt-1 text-sm text-red-500">
                            {(errors.dateOfBirth as any)?.message}
                        </span>
                    )}
                </div>
                <div>
                    <label>Age</label>
                    <input
                        {...register('age', {
                            // valueAsNumber: true,
                            setValueAs: (v) =>
                                v === '' ? -1 : parseInt(v, 10),
                        })}
                        type="number"
                        placeholder="Age"
                        className="w-full rounded border p-2"
                    />
                    {errors.age && (
                        <span className="mt-1 text-sm text-red-500">
                            {(errors.age as any)?.message}
                        </span>
                    )}
                </div>
                <div>
                    <label>Gender</label>
                    <select
                        {...register('gender')}
                        className="w-full rounded border p-2"
                    >
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                    </select>
                    {errors.gender && (
                        <span className="mt-1 text-sm text-red-500">
                            {(errors.gender as any)?.message}
                        </span>
                    )}
                </div>
                <div>
                    <label>Other Gender</label>
                    <input
                        {...register('otherGender')}
                        type="text"
                        placeholder="Other Gender"
                        className="w-full rounded border p-2"
                    />
                </div>
            </div>

            {false && (
                <>
                    {/* Spouse information */}
                    <div className="flex space-x-5">
                        <div>
                            <label>Spouse Name</label>
                            <input
                                {...register('spouseName')}
                                type="text"
                                placeholder="Spouse Name"
                                className="w-full rounded border p-2"
                            />
                        </div>
                        <div>
                            <label>Spouse Age</label>
                            <input
                                {...register('spouseAge')}
                                type="number"
                                placeholder="Spouse Age"
                                className="w-full rounded border p-2"
                            />
                        </div>
                        <div>
                            <label>Spouse Gender</label>
                            <select
                                {...register('spouseGender')}
                                className="w-full rounded border p-2"
                            >
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                        <div>
                            <label>Spouse Other Gender</label>
                            <input
                                {...register('spouseOtherGender')}
                                type="text"
                                placeholder="Spouse Other Gender"
                                className="w-full rounded border p-2"
                            />
                        </div>
                    </div>

                    {/* Location and contact details */}
                    <div className="flex space-x-5">
                        <div>
                            <label>Address</label>
                            <input
                                {...register('address')}
                                type="text"
                                placeholder="Address"
                                className="w-full rounded border p-2"
                            />
                            {errors.address && (
                                <span className="mt-1 text-sm text-red-500">
                                    {(errors.address as any)?.message}
                                </span>
                            )}
                        </div>
                        <div>
                            <label>Apt Number</label>
                            <input
                                {...register('aptNumber')}
                                type="text"
                                placeholder="Apt Number"
                                className="w-full rounded border p-2"
                            />
                        </div>
                        <div>
                            <label>City</label>
                            <input
                                {...register('city')}
                                type="text"
                                placeholder="City"
                                className="w-full rounded border p-2"
                            />
                            {errors.city && (
                                <span className="mt-1 text-sm text-red-500">
                                    {(errors.city as any)?.message}
                                </span>
                            )}
                        </div>
                        <div>
                            <label>Zip Code</label>
                            <input
                                {...register('zipCode')}
                                type="text"
                                placeholder="Zip Code"
                                className="w-full rounded border p-2"
                            />
                        </div>
                        <div>
                            <label>Phone Number</label>
                            <input
                                {...register('phoneNumber')}
                                type="text"
                                placeholder="Phone Number"
                                className="w-full rounded border p-2"
                            />
                        </div>
                        <div>
                            <label>Email</label>
                            <input
                                {...register('email')}
                                type="email"
                                placeholder="Email"
                                className="w-full rounded border p-2"
                            />
                        </div>
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

                    {/* Family and demographic details */}
                    <div className="flex space-x-5">
                        <div>
                            <label>Family Size</label>
                            <input
                                {...register('familySize')}
                                type="number"
                                placeholder="Family Size"
                                className="w-full rounded border p-2"
                            />
                        </div>
                        <div>
                            <label>Number of Children</label>
                            <input
                                {...register('numberOfChildren')}
                                type="number"
                                placeholder="Number of Children"
                                className="w-full rounded border p-2"
                            />
                        </div>
                        <div>
                            <label>Ethnicity</label>
                            <select
                                {...register('ethnicity')}
                                className="w-full rounded border p-2"
                            >
                                <option value="African American">
                                    African American
                                </option>
                                <option value="Asian">Asian</option>
                                <option value="Latino/Hispanic">
                                    Latino/Hispanic
                                </option>
                                <option value="Native American">
                                    Native American
                                </option>
                                <option value="White/Caucasian">
                                    White/Caucasian
                                </option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                    </div>

                    {/* Public services information */}
                    <div className="flex space-x-5">
                        <div className="space-x-2">
                            <label>General Relief</label>
                            <input
                                {...register('publicServices.generalRelief')}
                                type="checkbox"
                            />
                        </div>
                        <div className="space-x-2">
                            <label>Cal Fresh</label>
                            <input
                                {...register('publicServices.calFresh')}
                                type="checkbox"
                            />
                        </div>
                        <div className="space-x-2">
                            <label>Cal Works</label>
                            <input
                                {...register('publicServices.calWorks')}
                                type="checkbox"
                            />
                        </div>
                        <div className="space-x-2">
                            <label>SSI</label>
                            <input
                                {...register('publicServices.ssi')}
                                type="checkbox"
                            />
                        </div>
                        <div className="space-x-2">
                            <label>SSA</label>
                            <input
                                {...register('publicServices.ssa')}
                                type="checkbox"
                            />
                        </div>
                        <div className="space-x-2">
                            <label>Unemployment</label>
                            <input
                                {...register('publicServices.unemployment')}
                                type="checkbox"
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
                            <label>
                                Open Client with Child/Family Services
                            </label>
                            <select
                                {...register(
                                    'openClientWithChildFamilyServices',
                                )}
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
                </>
            )}

            {/* Client management */}
            <div className="flex space-x-5">
                <div>
                    <label>Assigned Client Manager</label>
                    <input
                        {...register('assignedClientManager')}
                        type="text"
                        placeholder="Assigned Client Manager"
                        className="w-full rounded border p-2"
                    />
                </div>
                <div>
                    <label>Assigned Date</label>
                    <input
                        {...register('assignedDate')}
                        type="date"
                        className="w-full rounded border p-2"
                    />
                </div>
                <div>
                    <label>Status</label>
                    <select
                        {...register('status')}
                        className="w-full rounded border p-2"
                    >
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                    </select>
                </div>
            </div>

            {/* Additional notes */}
            <div>
                <label>Notes</label>
                <textarea
                    {...register('notes')}
                    placeholder="Additional Notes"
                    className="w-full rounded border p-2"
                />
            </div>

            <button
                type="submit"
                className="mt-4 rounded bg-blue-500 p-2 text-white"
            >
                Submit
            </button>
        </form>
    )
}

export default page
