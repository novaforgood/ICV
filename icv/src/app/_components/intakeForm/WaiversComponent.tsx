'use client'
import {
    LoadedSignature,
    SignaturePopup,
} from '@/app/_components/SignatureModal'
import { storage } from '@/data/firebase'
import {
    ClientIntakeSchema,
    NewClient,
    WaiverSchema,
} from '@/types/client-types'
import { zodResolver } from '@hookform/resolvers/zod'
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage'
import html2pdf from 'html2pdf.js'
import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import SignatureCanvas from 'react-signature-canvas'
import { TypeOf } from 'zod'

interface Props {
    formType: Partial<NewClient>
    updateForm: (form: Partial<NewClient>) => void
    onSubmitNew?: (data: NewClient) => void
    onSubmitEdit?: (data: NewClient) => void
    onCancel?: () => void
    submitType: 'save' | 'new'
}

type WaiverType = TypeOf<typeof WaiverSchema>
type ClientType = TypeOf<typeof ClientIntakeSchema>

const WaiverSection: React.FC<Props> = ({
    formType,
    updateForm,
    onSubmitNew,
    onSubmitEdit,
    onCancel,
    submitType,
}) => {
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
        defaultValues: formType,
    })

    const router = useRouter()
    const [isExporting, setIsExporting] = useState(false)
    const [openSignature1, setOpenSignature1] = useState(false)
    const [openSignature2, setOpenSignature2] = useState(false)
    const [openGuardianSig, setOpenGuardianSig] = useState(false)

    const clientSig1 = useRef<SignatureCanvas | null>(null)
    const clientSig2 = useRef<SignatureCanvas | null>(null)
    const guardianSig = useRef<SignatureCanvas | null>(null)

    useEffect(() => {
        reset(formType)
    }, [formType, reset])

    useEffect(() => {
        const unsub = watch((data) => {
            updateForm({
                ...data,
                waivers: data.waivers?.filter((w) => !!w),
            })
        }).unsubscribe
        return unsub
    }, [watch, formType])

    const exportPDF = async () => {
        try {
            setIsExporting(true)
            const el = document.getElementById('formToExport')
            if (!el) throw new Error('Form element not found')

            const today =
                formType.signDate && formType.signDate != ''
                    ? formType.signDate
                    : new Date().toISOString().split('T')[0]
            const filename = `${formType.clientCode}_${today}.pdf`

            const pdf = html2pdf()
                .set({
                    margin: 1,
                    filename,
                    image: { type: 'jpeg', quality: 0.95 },
                    html2canvas: { scale: 3, useCORS: true, scrollY: 0 },
                    jsPDF: {
                        unit: 'in',
                        format: 'a4',
                        orientation: 'portrait',
                    },
                })
                .from(el)

            const blob = await pdf.outputPdf('blob')
            const fileRef = ref(storage, `waivers/${filename}`)
            await uploadBytes(fileRef, blob)
            const url = await getDownloadURL(fileRef)
            return { name: filename, uri: url }
        } catch (err) {
            console.error('Export failed:', err)
            setIsExporting(false)
            return null
        }
    }

    const handleSubmitType = async (data: ClientType) => {
        const pdf = await exportPDF()

        const finalData = {
            ...formType,
            ...data,
            waivers: [...(formType.waivers ?? []), ...(pdf ? [pdf] : [])],
            clientSig1: '',
            clientSig2: '',
            guardianSig: '',
            thirdParties: '',
            disclosurePurpose: '',
            signDate: '',
        }

        updateForm(finalData)

        if (submitType === 'new' && onSubmitNew) {
            onSubmitNew(finalData as NewClient)
        } else if (submitType === 'save' && onSubmitEdit) {
            onSubmitEdit(finalData as NewClient)
        }
    }

    if (isExporting) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-white">
                <p className="text-lg font-medium text-gray-700">Saving...</p>
            </div>
        )
    }

    return (
        <form
            className="space-y-[24px]"
            style={{ padding: '24px' }}
            onSubmit={handleSubmit(handleSubmitType)}
        >
            <div className="mt-[24px] flex min-h-screen items-center justify-center">
                <div className="max-w-[800px] space-y-[48px]">
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
                                    formData={formType}
                                    updateForm={updateForm}
                                    isExporting={isExporting}
                                />

                                <SignaturePopup
                                    data={formType}
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
                                        {formType.firstName && (
                                            <p>{formType.firstName}</p>
                                        )}
                                        {formType.lastName && (
                                            <p>{formType.lastName}</p>
                                        )}
                                    </div>
                                </div>
                                <div className="flex flex-col space-y-1">
                                    <label className="font-['Epilogue'] text-[16px] font-bold leading-[18px] text-neutral-900">
                                        DOB
                                    </label>
                                    <div>
                                        {formType.dateOfBirth || <p>N/A</p>}
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col space-y-1">
                                <label className="font-['Epilogue'] text-[16px] font-bold leading-[18px] text-neutral-900">
                                    Street Address/Point of Contact
                                </label>
                                <div>
                                    {formType.streetAddress ? (
                                        formType.streetAddress
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
                                    formData={formType}
                                    updateForm={updateForm}
                                    isExporting={isExporting}
                                />

                                <SignaturePopup
                                    data={formType}
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
                                    formData={formType}
                                    updateForm={updateForm}
                                    isExporting={isExporting}
                                />

                                <SignaturePopup
                                    data={formType}
                                    fieldKey="guardianSig"
                                    padRef={guardianSig}
                                    updateForm={updateForm}
                                    open={openGuardianSig}
                                    setOpen={setOpenGuardianSig}
                                />
                            </div>
                        </div>

                        {!isExporting && submitType == 'new' && (
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

                        {!isExporting && submitType == 'save' && (
                            <div className="flex justify-start space-x-[24px]">
                                <button
                                    type="submit"
                                    className="rounded-[5px] bg-[#4EA0C9] px-[20px] py-[16px] text-white hover:bg-[#246F95]"
                                >
                                    <div className="flex flex-row space-x-[8px]">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            height="20px"
                                            viewBox="0 -960 960 960"
                                            width="20px"
                                            fill="#FFFFFF"
                                        >
                                            <path d="M389-267 195-460l51-52 143 143 325-324 51 51-376 375Z" />
                                        </svg>
                                        Save
                                    </div>
                                </button>
                                <button
                                    type="button"
                                    onClick={onCancel}
                                    className="rounded-[5px] bg-[#1A1D20] px-[20px] py-[16px] text-white hover:bg-[#6D757F]"
                                >
                                    <div className="flex flex-row space-x-[8px]">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            height="20px"
                                            viewBox="0 -960 960 960"
                                            width="20px"
                                            fill="#FFFFFF"
                                        >
                                            <path d="m291-240-51-51 189-189-189-189 51-51 189 189 189-189 51 51-189 189 189 189-51 51-189-189-189 189Z" />
                                        </svg>
                                        Cancel
                                    </div>
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </form>
    )
}

export default WaiverSection
