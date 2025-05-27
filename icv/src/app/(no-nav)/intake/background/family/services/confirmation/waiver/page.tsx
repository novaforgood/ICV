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
        try {
            console.log('in submit...', data)

            const newClientID = await createClient({ ...loadedForm, ...data })

            if (newClientID !== undefined && newClientID !== null) {
                clearForm()
                router.push(`/completedProfile?clientID=${newClientID}`)
            } else {
                console.error('createClient returned null or undefined')
            }
        } catch (error) {
            console.error('Failed to create client:', error)
        }
    }

    return (
        <form
            className="space-y-[24px]"
            style={{ padding: '24px' }}
            onSubmit={handleSubmit(onSubmit)}
        >
            <div className="flex min-h-screen items-center justify-center">
                <div className="max-w-[800px] space-y-[60px]">
                    <div className="space-y-[24px]">
                        <label className="block text-center font-['Epilogue'] text-[40px] font-bold leading-[56px] text-neutral-900">
                            Consent Form
                        </label>
                    </div>
                    <div className="flex flex-col space-y-[24px]">
                        <label className="w-[1000px] font-['Epilogue'] text-[16px] font-normal leading-[18px] text-neutral-900">
                            By signing below, I consent to receive services
                            through the Inner-City Visions Homeless Outreach
                            Program.
                        </label>
                        <label>
                            I consent to participate with Inner-City Visions and
                            receive services provided by the organization. I
                            understand that services may include but are not
                            limited to the following:
                        </label>
                        <div className="grid grid-cols-2">
                            <div className="flex flex-col space-y-[12px]">
                                <label>Informal Case Management</label>
                                <label>Shelter Support</label>
                                <label>Hygiene Kits/Snack Packs</label>
                                <label>Drug & Alcohol Referral Services</label>
                            </div>
                            <div className="flex flex-col space-y-[12px]">
                                <label>Personal & Job Development</label>
                                <label>Transportation</label>
                                <label>Department Mental Health</label>
                                <label>Advocacy</label>
                            </div>
                        </div>
                        <label>
                            I understand that all information collected will be
                            kept locked at 1440 E. Florence Ave. Los Angeles, Ca
                            90001 and only authorized personnel will have access
                            to these records.
                        </label>
                        <div>
                            <label>
                                I understand that all information collected will
                                be kept confidential and that laws require that
                                Inner City Visions and its programs receive
                                written consent from my behalf before releasing
                                information.
                            </label>
                            <label className="underline">
                                {' '}
                                The exception to this would be if there is
                                suspected child abuse or neglect, or if I am
                                thought to be a danger to others or myself.
                            </label>
                        </div>
                        <div>
                            <label>
                                I also give permission for pictures of myself to
                                be taken and placed in my file and displayed at
                                Inner City Visions Intervention Program sites.
                            </label>
                            <label className="italic">
                                {' '}
                                I also understand that these photos may be used
                                for program outreach and publicity.
                            </label>
                        </div>

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
