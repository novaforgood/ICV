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
            <SignatureField
                fieldKey={fieldKey}
                formData={data}
                updateForm={updateForm}
            />
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
                            width: 600,
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
                                } rounded-[5px] px-[20px] py-[8px] text-white`}
                            >
                                Save
                            </button>

                            <button
                                type="button"
                                onClick={clearSig}
                                className="rounded-[5px] bg-black px-[20px] py-[8px] text-white"
                            >
                                Clear
                            </button>
                        </div>
                        <button
                            type="button"
                            onClick={() => setOpen(false)}
                            className="rounded-[5px] bg-black px-[20px] py-[8px] text-white"
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
}

export const SignatureField: React.FC<SigPadProps> = ({
    fieldKey,
    formData,
    updateForm,
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
                    className="h-auto max-w-full"
                />
            )}

            <div className="flex flex-row space-x-[8px]">
                <button
                    type="button"
                    onClick={() => setOpen(true)}
                    className="rounded-[5px] bg-black px-[20px] py-[16px] text-white"
                >
                    {hasSignature ? 'Replace Signature' : 'Add Signature'}
                </button>

                {hasSignature && (
                    <button
                        type="button"
                        onClick={() => updateForm({ [fieldKey]: '' })}
                        className="rounded-[5px] bg-black px-[20px] py-[16px] text-white"
                    >
                        Remove
                    </button>
                )}
            </div>

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
