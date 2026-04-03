'use client'

import { ServicesSection } from '@/app/_components/intakeForm/ServicesComponent'
import { useIntakeFormStore } from '@/app/_lib/useIntakeFormStore'
import { useRouter } from 'next/navigation'

const Page = () => {
    const { form: loadedForm, updateForm } = useIntakeFormStore()

    const router = useRouter()

    return (
        <div className="mt-[24px] flex min-h-screen items-center justify-center">
            <div className="min-w-full space-y-[60px] px-[100px]">
                <div>
                    <label className="block text-center font-['Epilogue'] text-[40px] font-bold leading-[56px] text-neutral-900">
                        Services
                    </label>
                </div>

                <ServicesSection
                    formType={loadedForm}
                    updateForm={updateForm}
                    onSubmitNew={(data) => {
                        updateForm(data)
                        router.push(
                            '/intake/background/family/services/confirmation',
                        )
                    }}
                    submitType="new"
                    titleStyle="font-['Epilogue'] text-[28px] font-semibold leading-[40px] text-neutral-900"
                    fileUploadLabelStyle="font-['Epilogue'] text-[16px] font-semibold leading-[24px] text-neutral-900"
                />
            </div>
        </div>
    )
}

export default Page
