'use client'
import {SubmitHandler, useForm} from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {ClientSchema, ClientType} from '@/types/case-types';

const page = () => {
    const { register, handleSubmit, formState: {errors} } = useForm<ClientType>({
        // resolver: zodResolver(ClientSchema),
    });

    const onSubmit = (data: ClientType) => {
        console.log(data);
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            {/* Basic client details */}
            <input {...register("firstName")} type="text" placeholder="First Name" />
            <input {...register("lastName")} type="text" placeholder="Last Name" />
            <input {...register("middleInitial")} type="text" placeholder="Middle Initial" />
            <input {...register("dateOfBirth")} type="date" placeholder="Date of Birth" />
            <select {...register("gender")}>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
            </select>
            <input {...register("otherGender")} type="text" placeholder="Other Gender" />
            <input {...register("age")} type="number" placeholder="Age" />

            {/* Spouse information */}
            <input {...register("spouseName")} type="text" placeholder="Spouse Name" />
            <input {...register("spouseAge")} type="number" placeholder="Spouse Age" />
            <select {...register("spouseGender")}>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
            </select>
            <input {...register("spouseOtherGender")} type="text" placeholder="Spouse Other Gender" />

            {/* Location and contact details */}
            <input {...register("address")} type="text" placeholder="Address" />
            <input {...register("aptNumber")} type="text" placeholder="Apt Number" />
            <input {...register("city")} type="text" placeholder="City" />
            <input {...register("zipCode")} type="text" placeholder="Zip Code" />
            <input {...register("phoneNumber")} type="text" placeholder="Phone Number" />
            <input {...register("email")} type="email" placeholder="Email" />

            {/* Program and intake details */}
            <input {...register("program")} type="text" placeholder="Program" />
            <input {...register("intakeDate")} type="date" placeholder="Intake Date" />
            <input {...register("primaryLanguage")} type="text" placeholder="Primary Language" />
            <input {...register("clientCode")} type="text" placeholder="Client Code" />

            {/* Housing and referral details */}
            <input {...register("housingType")} type="text" placeholder="Housing Type" />
            <input {...register("birthplace")} type="text" placeholder="Birthplace" />
            <input {...register("referralSource")} type="text" placeholder="Referral Source" />

            {/* Family and demographic details */}
            <input {...register("familySize")} type="number" placeholder="Family Size" />
            <input {...register("numberOfChildren")} type="number" placeholder="Number of Children" />
            {/* Children details - Array */}
            <input {...register("childrenDetails.0.name")} type="text" placeholder="Child Name" />
            <input {...register("childrenDetails.0.age")} type="number" placeholder="Child Age" />
            <select {...register("ethnicity")}>
                <option value="African American">African American</option>
                <option value="Asian">Asian</option>
                <option value="Latino/Hispanic">Latino/Hispanic</option>
                <option value="Native American">Native American</option>
                <option value="White/Caucasian">White/Caucasian</option>
                <option value="Other">Other</option>
            </select>

            {/* Public services information */}
            <label>General Relief</label>
            <input {...register("publicServices.generalRelief")} type="checkbox" />
            <label>Cal Fresh</label>
            <input {...register("publicServices.calFresh")} type="checkbox" />
            <label>Cal Works</label>
            <input {...register("publicServices.calWorks")} type="checkbox" />
            <label>SSI</label>
            <input {...register("publicServices.ssi")} type="checkbox" />
            <label>SSA</label>
            <input {...register("publicServices.ssa")} type="checkbox" />
            <label>Unemployment</label>
            <input {...register("publicServices.unemployment")} type="checkbox" />

            {/* Assessment and client details */}
            <input {...register("needsAssessment")} type="text" placeholder="Needs Assessment" />
            <select {...register("openClientWithChildFamilyServices")}>
                <option value="Yes, Currently">Yes, Currently</option>
                <option value="Yes, Previously">Yes, Previously</option>
                <option value="No">No</option>
            </select>
            <input {...register("previousArrests")} type="checkbox" />
            <select {...register("probationStatus")}>
                <option value="No">No</option>
                <option value="Yes, Previously">Yes, Previously</option>
                <option value="Yes, Currently">Yes, Currently</option>
            </select>

            {/* Education and employment */}
            <input {...register("education.hasHighSchoolDiploma")} type="checkbox" />
            <select {...register("education.fosterYouthStatus")}>
                <option value="Yes, Currently">Yes, Currently</option>
                <option value="Yes, Previously">Yes, Previously</option>
                <option value="No">No</option>
            </select>
            <select {...register("employmentStatus")}>
                <option value="No">No</option>
                <option value="Yes, Part-Time">Yes, Part-Time</option>
                <option value="Yes, Full-Time">Yes, Full-Time</option>
            </select>

            {/* Medical and mental health information */}
            <input {...register("substanceAbuseDetails")} type="text" placeholder="Substance Abuse Details" />
            <input {...register("medicalConditions")} type="text" placeholder="Medical Conditions" />
            <input {...register("mentalHealthDiagnosis")} type="text" placeholder="Mental Health Diagnosis" />

            {/* Client management */}
            <input {...register("assignedClientManager")} type="text" placeholder="Assigned Client Manager" />
            <input {...register("assignedDate")} type="date" placeholder="Assigned Date" />
            <select {...register("status")}>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
            </select>

            {/* Additional notes */}
            <textarea {...register("notes")} placeholder="Additional Notes" />

            {errors && <p>{JSON.stringify(errors)}</p>}
            <button type="submit">Submit</button>
        </form>
    );
};

export default page;