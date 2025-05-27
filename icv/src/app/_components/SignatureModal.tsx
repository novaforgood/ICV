'use client'

import type { NewClient } from '@/types/client-types'
import { useEffect, useRef, useState } from 'react'
import SignaturePad from 'react-signature-canvas'
import Popup from 'reactjs-popup'

type Props = {
    data: NewClient
    fieldKey: keyof NewClient
    padRef: React.RefObject<SignaturePad | null>
    updateForm: (form: Partial<NewClient>) => void
    open: boolean
    setOpen: (val: boolean) => void
}

export const SignaturePopup: React.FC<Props> = ({
    fieldKey,
    data,
    padRef,
    updateForm,
    open,
    setOpen,
}) => {
    const [writing, setWriting] = useState(false)
    const clearSig = () => {
        padRef.current?.clear()
        handleDraw()
    }

    const saveSig = () => {
        updateForm({
            [fieldKey]: padRef.current?.getTrimmedCanvas().toDataURL() || '',
        })
        setOpen(false)
    }

    const handleDraw = () => {
        setWriting(!(padRef.current?.isEmpty() ?? true))
    }

    useEffect(() => {
        if (open) {
            setTimeout(() => {
                setWriting(!(padRef.current?.isEmpty() ?? true))
            }, 0)
        }
    }, [open])

    return (
        <div className="space-y-[60px]">
            <Popup
                modal
                open={open}
                onClose={() => setOpen(false)}
                overlayStyle={{ background: 'rgba(0, 0, 0, 0.5)' }}
                contentStyle={{
                    background: 'white',
                    padding: '60px',
                    borderRadius: '5px',
                }}
            >
                <div className="relative space-y-[24px]">
                    <SignaturePad
                        ref={padRef}
                        penColor="black"
                        canvasProps={{
                            width: 500,
                            height: 200,
                            style: {
                                border: '1px solid black',
                                borderRadius: '10px',
                                backgroundColor: 'white',
                            },
                        }}
                        onEnd={handleDraw}
                    />
                    <div className="flex flex-row items-center justify-between">
                        <div className="flex flex-row space-x-[8px]">
                            <button
                                type="button"
                                onClick={saveSig}
                                disabled={!writing}
                                className={`${
                                    writing
                                        ? 'bg-black'
                                        : 'cursor-not-allowed bg-gray-400'
                                } rounded-[5px] px-[12px] py-[8px] text-white hover:bg-[#6D757F]`}
                            >
                                Save
                            </button>

                            <button
                                type="button"
                                onClick={clearSig}
                                className="rounded-[5px] bg-black px-[12px] py-[8px] text-white hover:bg-[#6D757F]"
                            >
                                Clear
                            </button>
                        </div>
                        <button
                            type="button"
                            onClick={() => setOpen(false)}
                            className="rounded-[5px] bg-black px-[12px] py-[8px] text-white hover:bg-[#6D757F]"
                        >
                            Close
                        </button>
                    </div>
                </div>
            </Popup>
        </div>
    )
}

type SigPadProps = {
    fieldKey: keyof NewClient
    formData: NewClient
    updateForm: (form: Partial<NewClient>) => void
    isExporting: boolean
}

export const LoadedSignature: React.FC<SigPadProps> = ({
    fieldKey,
    formData,
    updateForm,
    isExporting,
}) => {
    const sigRef = useRef<SignaturePad | null>(null)
    const [open, setOpen] = useState(false)

    const hasSignature =
        formData[fieldKey] === '' || formData[fieldKey] === undefined
            ? false
            : true

    return (
        <div className="space-y-[40px]">
            {hasSignature && (
                <img
                    src={formData[fieldKey] as string}
                    alt="Signature"
                    className="h-[100px] h-auto w-[200px]"
                />
            )}

            {!isExporting && (
                <div className="flex flex-row space-x-[8px]">
                    <button
                        type="button"
                        onClick={() => setOpen(true)}
                        className="rounded-[5px] bg-black px-[12px] py-[8px] text-white hover:bg-[#6D757F]"
                    >
                        <div className="flex flex-row gap-[8px]">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                height="20px"
                                viewBox="0 -960 960 960"
                                width="20px"
                                fill="#FFFFFF"
                            >
                                <path d="M216-216h51l375-375-51-51-375 375v51Zm-72 72v-153l498-498q11-11 23.84-16 12.83-5 27-5 14.16 0 27.16 5t24 16l51 51q11 11 16 24t5 26.54q0 14.45-5.02 27.54T795-642L297-144H144Zm600-549-51-51 51 51Zm-127.95 76.95L591-642l51 51-25.95-25.05Z" />
                            </svg>
                            {hasSignature
                                ? 'Replace Signature'
                                : 'Add Signature'}
                        </div>
                    </button>

                    {hasSignature && (
                        <button
                            type="button"
                            onClick={() => updateForm({ [fieldKey]: '' })}
                            className="rounded-[5px] bg-black px-[12px] py-[8px] text-white hover:bg-[#6D757F]"
                        >
                            <div className="flex flex-row gap-[8px]">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    height="20px"
                                    viewBox="0 -960 960 960"
                                    width="20px"
                                    fill="#FFFFFF"
                                >
                                    <path d="M312-144q-29.7 0-50.85-21.15Q240-186.3 240-216v-480h-48v-72h192v-48h192v48h192v72h-48v479.57Q720-186 698.85-165T648-144H312Zm336-552H312v480h336v-480ZM384-288h72v-336h-72v336Zm120 0h72v-336h-72v336ZM312-696v480-480Z" />
                                </svg>
                                Remove
                            </div>
                        </button>
                    )}
                </div>
            )}
            <SignaturePopup
                data={formData}
                fieldKey={fieldKey}
                padRef={sigRef}
                updateForm={updateForm}
                open={open}
                setOpen={setOpen}
            />
        </div>
    )
}
