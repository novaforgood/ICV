'use client'
import { createClient } from '@/api/make-cases/make-case'
import { ClientIntakeSchema, WaiverSchema } from '@/types/client-types'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { TypeOf } from 'zod'
import { useIntakeFormStore } from '../../../../../../../_lib/useIntakeFormStore'

const Page = () => {
    const { form: loadedForm, updateForm, clearForm } = useIntakeFormStore()
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

    return (
        <form
            className="space-y-[24px]"
            style={{ padding: '24px' }}
            onSubmit={handleSubmit(onSubmit)}
        >
            <div className="flex min-h-screen items-center justify-center">
                <div className="min-w-[800px] space-y-[48px]">
                    <div className="space-y-[24px]">
                        <label className="block text-center font-['Epilogue'] text-[40px] font-bold leading-[56px] text-neutral-900">
                            Waiver
                        </label>
                    </div>
                    <div className="flex flex-col space-y-[24px]">
                        <label className="w-[1000px] font-['Epilogue'] text-[16px] font-normal leading-[18px] text-neutral-900">
                            waiver content here.
                        </label>

                        <div className="flex items-center space-x-2">
                            <input
                                {...register('acknowledgement')}
                                type="checkbox"
                                id="acknowledgement"
                            />
                            <label htmlFor="acknowledgement">
                                I give my permission
                            </label>
                        </div>
                    </div>

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
