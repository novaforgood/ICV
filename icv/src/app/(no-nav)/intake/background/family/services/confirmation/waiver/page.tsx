'use client'
import { createClient } from '@/api/make-cases/make-case'
import { SignaturePopup } from '@/app/_components/SignatureModal'
import { ClientIntakeSchema, WaiverSchema } from '@/types/client-types'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import SignatureCanvas from 'react-signature-canvas'
import { TypeOf } from 'zod'
import { useIntakeFormStore } from '../../../../../../../_lib/useIntakeFormStore'

const Page = () => {
    const { form: loadedForm, updateForm, clearForm } = useIntakeFormStore()
    const [openSignature1, setOpenSignature1] = useState(false)
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
            updateForm(data)
        }).unsubscribe
        console.log(loadedForm)
        console.log(errors)

        return unsubscribe
    }, [watch, loadedForm])

    const onSubmit = async (data: ClientType) => {
        console.log('in submit...', data)
        const newClientID = await createClient({ ...loadedForm, ...data })
        clearForm()
        if (newClientID) {
            clearForm()
            router.push(`/completedProfile?clientID=${newClientID}`)
        } else {
            console.error('Failed to create client')
        }
    }

    const sigCanvas = useRef<SignatureCanvas | null>(null)

    return (
        <form
            className="space-y-[24px]"
            style={{ padding: '24px' }}
            onSubmit={handleSubmit(onSubmit)}
        >
            <div className="mt-[24px] flex min-h-screen items-center justify-center">
                <div className="min-w-[800px] space-y-[60px]">
                    <div className="space-y-[24px]">
                        <label className="block text-center font-['Epilogue'] text-[40px] font-bold leading-[56px] text-neutral-900">
                            Consent Form
                        </label>
                    </div>
                    <div className="flex flex-col space-y-[24px]">
                        <label>CONTENT GOES HEREEEE</label>
                    </div>

                    <SignaturePopup
                        data={loadedForm}
                        fieldKey="clientSig1"
                        padRef={sigCanvas}
                        updateForm={updateForm}
                        open={openSignature1}
                        setOpen={setOpenSignature1}
                    />
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
                </div>
            </div>
        </form>
    )
}

export default Page
