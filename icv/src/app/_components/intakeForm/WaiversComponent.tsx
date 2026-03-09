'use client'
import FileUpload, {
    ResetButton,
} from '@/app/_components/intakeForm/FileUpload'
import {
    LoadedSignature,
    SignaturePopup,
} from '@/app/_components/intakeForm/SignatureModal'
import { auth, storage } from '@/data/firebase'
import {
    ClientIntakeSchema,
    NewClient,
    WaiverSchema,
} from '@/types/client-types'
import { zodResolver } from '@hookform/resolvers/zod'
import {
    deleteObject,
    getDownloadURL,
    ref,
    uploadBytes,
} from 'firebase/storage'
import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
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
    const [showExportOverlay, setShowExportOverlay] = useState(false)
    const [waiverMode, setWaiverMode] = useState<'form' | 'upload'>('form')
    const [waiverUploading, setWaiverUploading] = useState(false)
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

    const handleWaiverFileChange = async (
        e: React.ChangeEvent<HTMLInputElement>,
    ) => {
        if (e.target.files && e.target.files.length > 0) {
            const files = Array.from(e.target.files)
            setWaiverUploading(true)
            const uploadPromises = files.map(async (file) => {
                const path = `waivers/${auth.currentUser?.uid ?? 'client'}/${crypto.randomUUID()}/${file.name}`
                const fileRef = ref(storage, path)
                try {
                    await uploadBytes(fileRef, file)
                    const url = await getDownloadURL(fileRef)
                    return { name: file.name, uri: url }
                } catch (error) {
                    console.error(`Error uploading waiver ${file.name}:`, error)
                    return null
                }
            })
            const uploaded = (await Promise.all(uploadPromises)).filter(
                (f): f is { name: string; uri: string } => f !== null,
            )
            if (uploaded.length > 0) {
                updateForm({
                    waivers: [...(formType.waivers ?? []), ...uploaded],
                })
            }
            setWaiverUploading(false)
            e.target.value = ''
        }
    }

    const handleAddFile = (fileInputRef: React.RefObject<HTMLInputElement>) => {
        if (fileInputRef.current) fileInputRef.current.click()
    }

    const resetWaiverFiles = async () => {
        const oldFiles = formType.waivers ?? []
        if (oldFiles.length > 0) {
            await Promise.all(
                oldFiles.map(async (file) => {
                    try {
                        if (file.uri) {
                            const fileRef = ref(storage, file.uri)
                            await deleteObject(fileRef)
                        }
                    } catch (error) {
                        console.error(
                            `Error deleting waiver ${file.uri}:`,
                            error,
                        )
                    }
                }),
            )
            updateForm({ waivers: [] })
        }
    }

    const removeWaiverFile = async (field: string, index: number) => {
        if (field !== 'waivers') return
        const oldFiles = formType.waivers ?? []
        const fileToRemove = oldFiles[index]
        if (!fileToRemove?.uri) return

        try {
            await deleteObject(ref(storage, fileToRemove.uri))
        } catch (error) {
            console.error(`Error deleting waiver ${fileToRemove.uri}:`, error)
        }

        const updated = oldFiles.filter((_, i) => i !== index)
        updateForm({ waivers: updated })
    }

    const exportPDF = async (): Promise<{
        name: string
        uri: string
    } | null> => {
        try {
            setIsExporting(true)
            await new Promise((resolve) => requestAnimationFrame(() => resolve(null)))
            await new Promise((resolve) => requestAnimationFrame(() => resolve(null)))

            const el = document.getElementById('formToExport')
            if (!el) throw new Error('Form element not found')

            const today =
                formType.signDate && formType.signDate != ''
                    ? formType.signDate
                    : new Date().toISOString().split('T')[0]
            const filename = `${formType.clientCode ?? 'waiver'}_${today}.pdf`

            const html2pdf = (await import('html2pdf.js')).default
            const blob = await html2pdf()
                .set({
                    margin: 1,
                    filename,
                    image: { type: 'jpeg', quality: 0.95 },
                    html2canvas: {
                        scale: 3,
                        useCORS: true,
                        scrollY: 0,
                        ignoreElements: (element: Element) =>
                            element.hasAttribute('data-html2canvas-ignore'),
                        onclone: (clonedDoc: Document) => {
                            clonedDoc
                                .querySelectorAll('[data-html2canvas-ignore]')
                                .forEach((node: Element) => node.remove())
                        },
                    },
                    jsPDF: {
                        unit: 'in',
                        format: 'a4',
                        orientation: 'portrait',
                    },
                    pagebreak: {
                        mode: ['css', 'legacy'],
                        before: '.pdf-new-page',
                        avoid: '.pdf-keep-together',
                    },
                })
                .from(el)
                .toPdf()
                .output('blob')

            setShowExportOverlay(true)

            // Upload to Firebase Storage (comment out for local testing)
            const path = `waivers/${auth.currentUser?.uid ?? 'client'}/${crypto.randomUUID()}/${filename}`
            const fileRef = ref(storage, path)
            await uploadBytes(fileRef, blob)
            const url = await getDownloadURL(fileRef)
            // const url = 'local-test' // placeholder when upload disabled for local testing

            return { name: filename, uri: url }
        } catch (err) {
            console.error('Export failed:', err)
            return null
        } finally {
            setShowExportOverlay(false)
            setIsExporting(false)
        }
    }

    const handleSubmitType = async (data: ClientType) => {
        let finalWaivers = formType.waivers ?? []
        if (waiverMode === 'form') {
            const pdf = await exportPDF()
            finalWaivers = [...finalWaivers, ...(pdf ? [pdf] : [])]
        }

        const finalData = {
            ...formType,
            ...data,
            waivers: finalWaivers,
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

    return (
        <form
            className="relative space-y-[24px]"
            style={{ padding: '24px' }}
            onSubmit={handleSubmit(handleSubmitType)}
        >
            {showExportOverlay &&
                waiverMode === 'form' &&
                typeof document !== 'undefined' &&
                createPortal(
                    <div
                        data-html2canvas-ignore="true"
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
                    >
                        <p className="rounded-[5px] bg-white px-[20px] py-[16px] text-lg font-medium">
                            Creating waiver...
                        </p>
                    </div>,
                    document.body,
                )}
            <div className="mt-[24px] flex min-h-screen justify-center">
                <div className="min-w-full space-y-[48px]">
                    <div className="flex flex-col space-y-[24px]">
                        <div className="mb-[24px] flex flex-row gap-[24px]">
                            <button
                                type="button"
                                onClick={() => setWaiverMode('form')}
                                className={`rounded-[5px] px-4 py-2 ${
                                    waiverMode === 'form'
                                        ? 'bg-neutral-900 text-white'
                                        : 'bg-neutral-200'
                                }`}
                            >
                                Digital Waiver
                            </button>
                            <button
                                type="button"
                                onClick={() => setWaiverMode('upload')}
                                className={`rounded-[5px] px-4 py-2 ${
                                    waiverMode === 'upload'
                                        ? 'bg-neutral-900 text-white'
                                        : 'bg-neutral-200'
                                }`}
                            >
                                Upload
                            </button>
                        </div>

                        {waiverMode === 'upload' ? (
                            <div className="space-y-[24px]">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-[8px]">
                                        <label className="font-['Epilogue'] text-[24px] font-semibold leading-[28px] text-[#1A1D20]">
                                            Waiver
                                        </label>
                                        <span className="group relative flex">
                                            <span className="flex cursor-help items-center justify-center">
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    height="20px"
                                                    viewBox="0 -960 960 960"
                                                    width="20px"
                                                >
                                                    <path d="M480-96v-96q-140.33 0-238.16-97.77-97.84-97.77-97.84-238Q144-668 241.89-766t238.29-98q70.2 0 131.01 26.5Q672-811 717.5-765.5t72 106.37Q816-598.27 816-528q0 69-29.5 134t-77 121Q662-217 602-171.5T480-96Zm72-128q80-60 136-139.5T744-528q0-109-77.5-186.5T480-792q-109 0-186.5 77.5T216-528q0 109 77.5 186.5T480-264h72v40Zm-43.5-123.5Q520-359 520-376t-11.5-28.5Q497-416 480-416t-28.5 11.5Q440-393 440-376t11.5 28.5Q463-336 480-336t28.5-11.5ZM451-458h58q0-26 4-39.5t23-32.5q18-17 36-36t18-54q0-48-32-74t-78-26q-41.88 0-70.44 24Q381-672 370-640l52.33 22q4.67-17 18.16-32T480-665q27 0 39.5 15t12.5 32q0 21-14.5 35.5T486-552q-26 24-30.5 41.5T451-458Zm29-50Z" />
                                                </svg>
                                            </span>
                                            <span className="pointer-events-none absolute left-1/2 top-full z-10 mt-2 -translate-x-1/2 whitespace-nowrap rounded bg-gray-800 px-3 py-2 text-sm text-white opacity-0 shadow-lg transition-opacity duration-150 group-hover:opacity-100 group-hover:delay-100">
                                                Camera is not available on
                                                desktop
                                            </span>
                                        </span>
                                    </div>
                                    <ResetButton
                                        data={formType}
                                        field="waivers"
                                        resetFiles={(field) =>
                                            field === 'waivers' &&
                                            resetWaiverFiles()
                                        }
                                    />
                                </div>
                                <FileUpload
                                    data={formType}
                                    handleFileChange={(e) =>
                                        handleWaiverFileChange(e)
                                    }
                                    handleAddFile={handleAddFile}
                                    onRemoveFile={removeWaiverFile}
                                    field="waivers"
                                    isUploading={waiverUploading}
                                />
                                {!waiverUploading && submitType === 'new' && (
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
                                            disabled={!formType.waivers?.length}
                                            className="rounded-[5px] bg-neutral-900 px-4 py-2 text-white disabled:cursor-not-allowed disabled:opacity-50"
                                        >
                                            Submit
                                        </button>
                                    </div>
                                )}
                                {!waiverUploading && submitType === 'save' && (
                                    <div className="flex justify-start space-x-[24px]">
                                        <button
                                            type="submit"
                                            disabled={!formType.waivers?.length}
                                            className="rounded-[5px] bg-[#4EA0C9] px-[20px] py-[16px] text-white hover:bg-[#246F95] disabled:cursor-not-allowed disabled:opacity-50"
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
                        ) : (
                            <div id="formToExport" className="space-y-[24px]">
                                <div className="pdf-keep-together flex flex-col space-y-[24px]">
                                    <label className="font-['Epilogue'] text-[24px] font-semibold leading-[28px] text-[#1A1D20]">
                                        Consent Form
                                    </label>
                                    <p>
                                        By signing below, I consent to recieve
                                        services through the Inner-City Visions
                                        Homeless Outreach Program.
                                    </p>
                                    <p>
                                        I consent to participate with Inner-City
                                        Visions and receive services provided by
                                        the organization. I understand that
                                        services may include but are not limited
                                        to the following:
                                    </p>
                                    <div className="flex flex-row items-center justify-center space-x-[60px]">
                                        <ul className="list-disc space-y-[4px] pl-6">
                                            <li>Informal Case Management</li>
                                            <li>Shelter Support</li>
                                            <li>Hygiene Kits/Snack Packs</li>
                                            <li>
                                                Drug & Alcohol Referral Services
                                            </li>
                                        </ul>
                                        <ul className="list-disc space-y-[4px] pl-6">
                                            <li>Personal & Job Development</li>
                                            <li>Transportation</li>
                                            <li>Departmental Mental Health</li>
                                            <li>Advocacy</li>
                                        </ul>
                                    </div>
                                    <p>
                                        I understand that all information
                                        collected will be kept locked at 1440 E.
                                        Florence Ave. Los Angeles, Ca 90001 and
                                        only authorized personnel will have
                                        access to these records.
                                    </p>
                                    <p>
                                        I understand that all information
                                        collected will be kept confidential and
                                        that laws require that Inner City
                                        Visions and its programs receive written
                                        consent from my behalf before releasing
                                        information. The exception to this would
                                        be if there is suspected child abuse or
                                        neglect, or if I am thought to be a
                                        danger to others or myself.
                                    </p>
                                    <p>
                                        I also give permission for pictures of
                                        myself to be taken and placed in my file
                                        and displayed at Inner City Visions
                                        Intervention Program sites. I also
                                        understand that these photos may be used
                                        for program outreach and publicity.
                                    </p>
                                    <div className="space-y-[12px]">
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
                                <div className="pdf-new-page space-y-[60px]">
                                    <div className="pdf-keep-together flex flex-col space-y-[24px]">
                                        <label className="font-['Epilogue'] text-[24px] font-semibold leading-[28px] text-[#1A1D20]">
                                            Authorization to Release Information
                                        </label>
                                        <div className="grid grid-cols-2 gap-x-5 gap-y-3">
                                            <div className="flex flex-col space-y-1">
                                                <label className="font-['Epilogue'] text-[16px] font-bold leading-[18px] text-neutral-900">
                                                    Name
                                                </label>
                                                <div className="flex flex-row space-x-[4px]">
                                                    {formType.firstName && (
                                                        <p>
                                                            {formType.firstName}
                                                        </p>
                                                    )}
                                                    {formType.lastName && (
                                                        <p>
                                                            {formType.lastName}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="flex flex-col space-y-1">
                                                <label className="font-['Epilogue'] text-[16px] font-bold leading-[18px] text-neutral-900">
                                                    DOB
                                                </label>
                                                <div>
                                                    {formType.dateOfBirth || (
                                                        <p>N/A</p>
                                                    )}
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
                                            I do herby consent the exchange of
                                            information and / or disclosure of
                                            information contained in my file.
                                        </p>
                                        <p>
                                            Between{' '}
                                            <strong>INNER CITY VISIONS</strong>{' '}
                                            and:
                                        </p>

                                        <div className="flex flex-col space-y-[12px]">
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
                                        <p>
                                            1440 E. Florence Ave Los Angeles, CA
                                            90001
                                        </p>
                                    </div>

                                    <div className="flex flex-col space-y-[12px]">
                                        <label className="font-['Epilogue'] text-[16px] font-normal leading-[18px] text-neutral-900">
                                            The disclosure of this information
                                            and records authorized herein is
                                            required for the following purpose:
                                        </label>
                                        <textarea
                                            {...register('disclosurePurpose')}
                                            placeholder="Text"
                                            rows={5}
                                            className="w-full rounded border p-2"
                                        />
                                    </div>

                                    <div className="pdf-new-page space-y-[24px]">
                                        <p>
                                            I have the right to revoke this
                                            authorization to release and/or
                                            exchange information at any time.
                                            This authorization to exchange
                                            information will expire one year
                                            after the signature date. A
                                            photocopy or fax is considered as
                                            effective as the original.
                                        </p>
                                        <div className="flex flex-col space-y-[12px]">
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
                                        <div className="space-y-[12px]">
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
                                        <div className="space-y-[12px]">
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
                        )}
                    </div>
                </div>
            </div>
        </form>
    )
}

export default WaiverSection
