'use client'

import { createClient } from '@/api/make-cases/make-case'
import { ClientIntakeSchema } from '@/types/client-types'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { TypeOf } from 'zod'
import { useIntakeFormStore } from '../../../../../../_lib/useIntakeFormStore'

interface Props {}

const Page = (props: Props) => {
    const { form: loadedForm, clearForm } = useIntakeFormStore()
    type ClientType = TypeOf<typeof ClientIntakeSchema>

    const {
        handleSubmit,
        formState: { errors },
    } = useForm<ClientType>({
        mode: 'onChange',
        resolver: zodResolver(ClientIntakeSchema),
        defaultValues: loadedForm,
    })

    const router = useRouter()

    const onSubmit = (data: ClientType) => {
        console.log('in submit...', data)
        createClient(data)
        clearForm()
        router.push('/intake')
    }

    return (
        <form
            className="space-y-[24px]"
            style={{ padding: '24px' }}
            onSubmit={handleSubmit(onSubmit)}
        >
            <div className="flex items-center justify-center">
                <div className="min-w-[800px] space-y-[60px]">
                    <div>
                        <label className="font-['Epilogue'] text-[40px] font-bold leading-[56px] text-neutral-900">
                            Review
                        </label>
                    </div>
                    <div>
                        <label className="font-['Epilogue'] text-[40px] font-bold leading-[56px] text-neutral-900">
                            Client Profile
                        </label>
                        <div>
                            <div>
                                <label>
                                    <strong>Name</strong>
                                </label>
                                <div>
                                    <label>{loadedForm.firstName}</label>
                                    <label>
                                        {loadedForm.lastName ?? 'Last Name'}
                                    </label>
                                </div>
                            </div>

                            <div>
                                <label>
                                    <strong>Gender</strong>
                                </label>
                                <div>
                                    <label>{loadedForm.gender}</label>
                                </div>
                            </div>

                            <div>
                                <label>
                                    <strong>DOB</strong>
                                </label>
                                <div>
                                    <label>{loadedForm.dateOfBirth}</label>
                                </div>
                            </div>

                            <div>
                                <label>
                                    <strong>Referral Source</strong>
                                </label>
                                <div>
                                    <label>{loadedForm.referralSource}</label>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="flex justify-between">
                        <button
                            type="button"
                            onClick={() =>
                                router.push(
                                    '/intake/family/background/services',
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
