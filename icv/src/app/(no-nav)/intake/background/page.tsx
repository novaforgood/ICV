'use client'

import { BackgroundSection } from '@/app/_components/intakeForm/BackgroundComponent'
import { useIntakeFormStore } from '@/app/_lib/useIntakeFormStore'
import { useRouter } from 'next/navigation'

const Page = () => {
    const { form: loadedForm, updateForm } = useIntakeFormStore()

    const router = useRouter()

    return (
        <div className="mt-[24px] flex min-h-screen items-center justify-center">
            <div className="min-w-[800px] space-y-[60px]">
                <div>
                    <label className="block text-center font-['Epilogue'] text-[40px] font-bold leading-[56px] text-neutral-900">
                        Background
                    </label>
                </div>

                <BackgroundSection
                    formType={loadedForm}
                    updateForm={updateForm}
                    onSubmitNew={(data) => {
                        updateForm(data)
                        router.push('/intake/background/family')
                    }}
                    submitType="new"
                />
            </div>
        </div>
    )
}

export default Page
