'use client'

import { FamilySection } from '@/app/_components/intakeForm/FamilyComponent'
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
                        Family
                    </label>
                </div>

                <FamilySection
                    formType={loadedForm}
                    updateForm={updateForm}
                    onSubmitNew={(data) => {
                        updateForm(data)
                        router.push('/intake/background/family/services')
                    }}
                    submitType="new"
                />
            </div>
        </div>
    )
}

export default Page
