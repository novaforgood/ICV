'use client'

import ProfileSection from '@/app/_components/intakeForm/ProfileComponent'
import { useRouter, useSearchParams } from 'next/navigation'
import { Suspense, useState } from 'react'
import { useIntakeFormStore } from '../../_lib/useIntakeFormStore'

const IntakeContent = () => {
    const searchParams = useSearchParams()
    const spouseID = searchParams?.get('spouseID') || undefined

    const { form: loadedForm, updateForm, clearForm } = useIntakeFormStore()

    const router = useRouter()
    const [showConfirmClear, setShowConfirmClear] = useState(false)

    const hasLoadedForm = loadedForm && Object.keys(loadedForm).length > 0

    const handleClearForm = () => {
        clearForm()
        setShowConfirmClear(false)
        window.location.reload()
    }

    return (
        <div className="mt-[24px] flex min-h-screen items-center justify-center">
            <div className="w-full space-y-[60px] px-[100px]">
                <div className="flex flex-col space-y-[24px]">
               
                    <label className="block text-center font-['Epilogue'] text-[40px] font-bold leading-[56px] text-neutral-900">
                        Client Profile
                    </label>
                    {hasLoadedForm && (
                    <div className="flex items-center gap-2">
                        {showConfirmClear ? (
                            <div className="flex flex-col space-y-[12px]">
                                <span className="text-sm text-neutral-600">Are you sure? <strong>All progress across pages will be lost.</strong></span>
                                <div className="flex flex-row space-x-[16px]">
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmClear(false)}
                                    className="h-[52px] w-[200px] rounded-[5px] bg-[#27262A] px-4 py-2 text-white"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    onClick={handleClearForm}
                                    className="h-[52px] w-[200px] rounded-[5px] bg-[#27262A] px-4 py-2 text-white"
                                >
                                    Yes, clear
                                </button>
                                </div>
                            </div>
                        ) : (
                            <button
                                type="button"
                                onClick={() => setShowConfirmClear(true)}
                                className="text-sm text-neutral-500 underline hover:text-neutral-700"
                            >
                                Clear Form
                            </button>
                        )}
                    </div>
                )}
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

const Page = () => {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <IntakeContent />
        </Suspense>
    )
}

export default Page
