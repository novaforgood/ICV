'use client'
import { createClient } from '@/api/make-cases/make-case'
import WaiverSection from '@/app/_components/intakeForm/WaiversComponent'
import { useIntakeFormStore } from '@/app/_lib/useIntakeFormStore'
import { NewClient } from '@/types/client-types'
import { useRouter } from 'next/navigation'

const Page = () => {
    const { form: loadedForm, updateForm, clearForm } = useIntakeFormStore()

    const router = useRouter()

    return (
        <div className="mt-[24px] flex min-h-screen items-center justify-center">
            <div className="min-w-[800px]">
                <div>
                    <label className="block text-center font-['Epilogue'] text-[40px] font-bold leading-[56px] text-neutral-900">
                        Waivers
                    </label>
                </div>

                <WaiverSection
                    formType={loadedForm}
                    updateForm={updateForm}
                    onSubmitNew={async (data: NewClient) => {
                        const newClientID = await createClient(data)
                        clearForm()
                        if (newClientID) {
                            router.push(
                                `/completedProfile?clientID=${newClientID}`,
                            )
                        } else {
                            console.error('Failed to create client')
                        }
                    }}
                    submitType="new"
                />
            </div>
        </div>
    )
}

export default Page
