'use client'
import { createClient } from '@/api/make-cases/make-case'
import {
    LoadedSignature,
    SignaturePopup,
} from '@/app/_components/SignatureModal'
import { storage } from '@/data/firebase'
import { ClientIntakeSchema, WaiverSchema } from '@/types/client-types'
import { zodResolver } from '@hookform/resolvers/zod'
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage'
import html2pdf from 'html2pdf.js'
import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import SignatureCanvas from 'react-signature-canvas'
import { TypeOf } from 'zod'
import { useIntakeFormStore } from '../../../../../../../_lib/useIntakeFormStore'

const Page = () => {
    const { form: loadedForm, updateForm, clearForm } = useIntakeFormStore()
    const [openSignature1, setOpenSignature1] = useState(false)
    const [openSignature2, setOpenSignature2] = useState(false)
    const [openGuardianSig, setOpenGuardianSig] = useState(false)
    const [isExporting, setIsExporting] = useState(false)
    type WaiverType = TypeOf<typeof WaiverSchema>
    type ClientType = TypeOf<typeof ClientIntakeSchema>

    const {
        register,
        setValue,
        handleSubmit,
        reset,
        watch,
        formState: { errors },
    } = useForm<WaiverType>({
        mode: 'onChange',
        resolver: zodResolver(WaiverSchema),
        defaultValues: loadedForm,
    })

    const router = useRouter()

    useEffect(() => {
        reset(loadedForm)
    }, [loadedForm, reset])

    useEffect(() => {
        const unsubscribe = watch((data) => {
            console.log('in watch...', data)
            updateForm({
                ...data,
                waiverPDFUri: data.waiverPDFUri?.filter(
                    (uri): uri is string => !!uri,
                ),
            })
        }).unsubscribe
        console.log(loadedForm)
        console.log(errors)

        return unsubscribe
    }, [watch, loadedForm])

    const clientSig1 = useRef<SignatureCanvas | null>(null)
    const clientSig2 = useRef<SignatureCanvas | null>(null)
    const guardianSig = useRef<SignatureCanvas | null>(null)

    const formRef = useRef<HTMLDivElement | null>(null)

    const exportPDF = async () => {
        try {
            setIsExporting(true)
            const element = document.getElementById('formToExport')
            if (!element) throw new Error('Element not found')

            const opt = {
                margin: 1,
                filename: `${loadedForm.clientCode}_${Date.now()}.pdf`,
                image: { type: 'jpeg', quality: 0.95 },
                html2canvas: { scale: 3, useCORS: true, scrollY: 0 },
                jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' },
            }

            const pdf = html2pdf().set(opt).from(element)
            const blob = await pdf.outputPdf('blob')

            const storageRef = ref(storage, `waivers/${opt.filename}`)
            await uploadBytes(storageRef, blob)

            const url = await getDownloadURL(storageRef)

            return url
        } catch (err) {
            console.error('Export failed:', err)
            setIsExporting(false)
        }
    }

    const onSubmit = async (data: ClientType) => {
        console.log('in submit...', data)
        const url = await exportPDF()
        updateForm({
            ...loadedForm,
            waiverPDFUri: [...(loadedForm.waiverPDFUri ?? []), url ?? ''],
        })

        updateForm({
            clientSig1: '',
            clientSig2: '',
            guardianSig: '',
            thirdParties: '',
            disclosurePurpose: '',
            signDate: '',
        })
        const newClientID = await createClient({ ...loadedForm, ...data })
        clearForm()
        if (newClientID) {
            clearForm()
            router.push(`/completedProfile?clientID=${newClientID}`)
        } else {
            console.error('Failed to create client')
        }
    }

    return (
        <form
            className="space-y-[24px]"
            style={{ padding: '24px' }}
            onSubmit={handleSubmit(onSubmit)}
        >
            <div className="mt-[24px] flex min-h-screen items-center justify-center">
                <div className="max-w-[800px] space-y-[48px]">
                    <label className="block text-center font-['Epilogue'] text-[40px] font-bold leading-[56px] text-neutral-900">
                        Waivers
                    </label>
                    <div id="formToExport" className="space-y-[60px]">
                        <div className="page-break-after flex flex-col space-y-[24px]">
                            <label className="font-['Epilogue'] text-[24px] font-semibold leading-[28px] text-[#1A1D20]">
                                Consent Form
                            </label>
                            <p>
                                By signing below, I consent to recieve services
                                through the Inner-City Visions Homeless Outreach
                                Program.
                            </p>
                            <p>
                                I consent to participate with Inner-City Visions
                                and receive services provided by the
                                organization. I understand that services may
                                include but are not limited to the following: 
                            </p>
                            <div className="flex flex-row items-center justify-center space-x-[60px]">
                                <ul className="list-disc space-y-[4px] pl-6">
                                    <li>Informal Case Management</li>
                                    <li>Shelter Support</li>
                                    <li>Hygiene Kits/Snack Packs</li>
                                    <li>Drug & Alcohol Referral Services</li>
                                </ul>
                                <ul className="list-disc space-y-[4px] pl-6">
                                    <li>Personal & Job Development</li>
                                    <li>Transportation</li>
                                    <li>Departmental Mental Health</li>
                                    <li>Advocacy</li>
                                </ul>
                            </div>
                            <p>
                                I understand that all information collected will
                                be kept locked at 1440 E. Florence Ave. Los
                                Angeles, Ca 90001 and only authorized personnel
                                will have access to these records.
                            </p>
                            <p>
                                I understand that all information collected will
                                be kept confidential and that laws require that
                                Inner City Visions and its programs receive
                                written consent from my behalf before releasing
                                information. The exception to this would be if
                                there is suspected child abuse or neglect, or if
                                I am thought to be a danger to others or myself.
                            </p>
                            <p>
                                I also give permission for pictures of myself to
                                be taken and placed in my file and displayed at
                                Inner City Visions Intervention Program sites. I
                                also understand that these photos may be used
                                for program outreach and publicity. 
                            </p>
                            <div className="space-y-[8px]">
                                <label className="font-bold">
                                    Client Signature
                                </label>
                                <LoadedSignature
                                    fieldKey={'clientSig1'}
                                    formData={loadedForm}
                                    updateForm={updateForm}
                                    isExporting={isExporting}
                                />

                                <SignaturePopup
                                    data={loadedForm}
                                    fieldKey="clientSig1"
                                    padRef={clientSig1}
                                    updateForm={updateForm}
                                    open={openSignature1}
                                    setOpen={setOpenSignature1}
                                />
                            </div>
                        </div>
                        <div>
                            <label className="font-['Epilogue'] text-[24px] font-semibold leading-[28px] text-[#1A1D20]">
                                Authorization to Release Information
                            </label>
                        </div>

                        <div className="flex flex-col space-y-[24px]">
                            <div className="grid grid-cols-2 gap-x-5 gap-y-3">
                                <div className="flex flex-col space-y-1">
                                    <label className="font-['Epilogue'] text-[16px] font-bold leading-[18px] text-neutral-900">
                                        Name
                                    </label>
                                    <div className="flex flex-row space-x-[4px]">
                                        {loadedForm.firstName && (
                                            <p>{loadedForm.firstName}</p>
                                        )}
                                        {loadedForm.lastName && (
                                            <p>{loadedForm.lastName}</p>
                                        )}
                                    </div>
                                </div>
                                <div className="flex flex-col space-y-1">
                                    <label className="font-['Epilogue'] text-[16px] font-bold leading-[18px] text-neutral-900">
                                        DOB
                                    </label>
                                    <div>
                                        {loadedForm.dateOfBirth || <p>N/A</p>}
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col space-y-1">
                                <label className="font-['Epilogue'] text-[16px] font-bold leading-[18px] text-neutral-900">
                                    Street Address/Point of Contact
                                </label>
                                <div>
                                    {loadedForm.streetAddress ? (
                                        loadedForm.streetAddress
                                    ) : (
                                        <p>N/A</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="space-y-[24px]">
                            <p>
                                I do herby consent the exchange of information
                                and / or disclosure of information contained in
                                my file. 
                            </p>
                            <p>
                                Between <strong>INNER CITY VISIONS</strong> and:
                            </p>

                            <div className="flex flex-col space-y-[4px]">
                                <label className="font-['Epilogue'] text-[16px] font-normal leading-[18px] text-neutral-900">
                                    3rd Party Organization(s)
                                </label>
                                <textarea
                                    {...register('thirdParties')}
                                    rows={3}
                                    placeholder="Text"
                                    className="w-full rounded border p-2"
                                />
                            </div>
                            <p>1440 E. Florence Ave Los Angeles, CA 90001</p>
                        </div>

                        <div className="flex flex-col space-y-[4px]">
                            <label className="font-['Epilogue'] text-[16px] font-normal leading-[18px] text-neutral-900">
                                The disclosure of this information and records
                                authorized herein is required for the following
                                purpose:
                            </label>
                            <textarea
                                {...register('disclosurePurpose')}
                                placeholder="Text"
                                rows={5}
                                className="w-full rounded border p-2"
                            />
                        </div>

                        <div className="space-y-[24px]">
                            <p>
                                I have the right to revoke this authorization to
                                release and/or exchange information at any time.
                                This authorization to exchange information will
                                expire one year after the signature date. A
                                photocopy or fax is considered as effective as
                                the original. 
                            </p>
                            <div className="flex flex-col space-y-[4px]">
                                <label className="font-['Epilogue'] text-[16px] font-normal leading-[18px] text-neutral-900">
                                    Date
                                </label>
                                <input
                                    {...register('signDate')}
                                    type="date"
                                    placeholder="MM/DD/YYYY"
                                    className="w-[30%] rounded border p-2"
                                />
                            </div>
                            <div className="space-y-[8px]">
                                <label className="font-bold">
                                    Client Signature
                                </label>
                                <LoadedSignature
                                    fieldKey={'clientSig2'}
                                    formData={loadedForm}
                                    updateForm={updateForm}
                                    isExporting={isExporting}
                                />

                                <SignaturePopup
                                    data={loadedForm}
                                    fieldKey="clientSig2"
                                    padRef={clientSig2}
                                    updateForm={updateForm}
                                    open={openSignature2}
                                    setOpen={setOpenSignature2}
                                />
                            </div>
                            <div className="space-y-[8px]">
                                <label className="font-bold">
                                    Guardian Signature
                                </label>
                                <LoadedSignature
                                    fieldKey="guardianSig"
                                    formData={loadedForm}
                                    updateForm={updateForm}
                                    isExporting={isExporting}
                                />

                                <SignaturePopup
                                    data={loadedForm}
                                    fieldKey="guardianSig"
                                    padRef={guardianSig}
                                    updateForm={updateForm}
                                    open={openGuardianSig}
                                    setOpen={setOpenGuardianSig}
                                />
                            </div>
                        </div>
                        {!isExporting && (
                            <div className="flex justify-between">
                                <button
                                    type="button"
                                    onClick={() =>
                                        router.push(
                                            '/intake/background/family/services/confirmation',
                                        )
                                    }
                                    className="rounded-[5px] bg-neutral-900 px-4 py-2 text-white"
                                >
                                    Back
                                </button>
                                <button
                                    type="submit"
                                    className="rounded-[5px] bg-neutral-900 px-4 py-2 text-white"
                                >
                                    Submit
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </form>
    )
}

export default Page
