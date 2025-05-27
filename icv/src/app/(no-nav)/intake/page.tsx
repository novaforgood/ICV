'use client'

import ProfileSection from '@/app/_components/intakeForm/ProfileComponent'
import { useRouter, useSearchParams } from 'next/navigation'
import { useIntakeFormStore } from '../../_lib/useIntakeFormStore'

const Page = () => {
    const searchParams = useSearchParams()
    const spouseID = searchParams?.get('spouseID') || undefined

    const { form: loadedForm, updateForm } = useIntakeFormStore()

    const router = useRouter()

    return (
        <div className="mt-[24px] flex min-h-screen items-center justify-center">
            <div className="min-w-[800px] space-y-[60px]">
                <div>
                    <label className="block text-center font-['Epilogue'] text-[40px] font-bold leading-[56px] text-neutral-900">
                        Client Profile
                    </label>
                </div>

                <ProfileSection
                    formType={loadedForm}
                    updateForm={updateForm}
                    spouseID={spouseID}
                    onSubmitNew={(data) => {
                        updateForm(data)
                        router.push('/intake/background')
                    }}
                    submitType="next"
                    titleStyle="font-['Epilogue'] text-[28px] font-semibold leading-[40px] text-neutral-900"
                />
            </div>
        </div>
    )
}

export default Page
