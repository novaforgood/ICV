'use client'

import { getClientById, updateClient } from '@/api/make-cases/make-case'
import { createHousingUpdate } from '@/api/make-cases/make-housing'
import { ClientIntakeSchema } from '@/types/client-types'
import { useRouter, useSearchParams } from 'next/navigation'
import { Suspense, useEffect, useState } from 'react'
import { TypeOf } from 'zod'

const CompletedProfileContent = () => {
    type ClientType = TypeOf<typeof ClientIntakeSchema>
    const searchParams = useSearchParams()
    const clientID = searchParams.get('clientID')
    const [createdClient, setCreatedClient] = useState<ClientType | undefined>(
        undefined,
    )

    const router = useRouter()
    useEffect(() => {
        const fetchClient = async () => {
            if (!clientID) return

            const clientData = await getClientById(clientID)
            setCreatedClient(clientData)

            console.log(clientID, clientData)
        }

        fetchClient()
    }, [clientID])

    useEffect(() => {
        if (
            createdClient?.spouseClientStatus === 'Yes' &&
            createdClient?.associatedSpouseID &&
            clientID
        ) {
            updateClient(createdClient.associatedSpouseID, {
                associatedSpouseID: clientID,
            })
        }

        if (createdClient?.homeless && clientID) {
            const newHousing = {
                clientID: clientID,
                date: createdClient.housingDate ?? createdClient.intakeDate,
                housingStatus: createdClient.homeless,
                housedByICV: createdClient.sheltered,
            }

            createHousingUpdate(newHousing)
                .then(() => {
                    updateClient(clientID, {
                        homeless: '',
                        housingDate: '',
                        sheltered: '',
                    })
                })
                .catch((err) => {
                    console.error('Failed to create housing update:', err)
                })
        }
    }, [createdClient, clientID])

    const onSubmit = () => {
        router.push(`/intake?spouseID=${clientID}`)
    }

    if (!createdClient) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                <p className="rounded-[5px] bg-white px-[20px] py-[16px] text-lg font-medium">
                    Creating Client...
                </p>
            </div>
        )
    }

    return (
        <div className="flex min-h-[100dvh] flex-col bg-white">
            <div className="space-y-[24px] px-6 pt-6">
                <button type="button" onClick={() => router.push('/')}>
                    {'<'} Back to dashboard
                </button>
            </div>
            <div className="flex min-h-0 flex-1 items-center justify-center px-6 py-6">
                <div className="w-full max-w-[800px] space-y-[48px]">
                    <div className="space-y-[24px]">
                        <label className="block text-center font-['Epilogue'] text-[40px] font-bold leading-[56px] text-neutral-900">
                            Saved!
                        </label>
                        <p className="text-center text-lg text-gray-700">
                            {createdClient?.firstName} {createdClient?.lastName}
                            &apos;s profile has been created.
                        </p>
                    </div>
                    <div className="flex flex-col justify-center gap-[24px] sm:flex-row">
                        <div className="w-full">
                            <button
                                type="button"
                                onClick={() => {
                                    router.push(`/clients/${clientID}`)
                                }}
                                className="h-[52px] w-full rounded-[5px] bg-neutral-900 px-[20px] py-[16px] text-white"
                            >
                                View client profile
                            </button>
                        </div>
                        {createdClient?.spouseClientStatus === 'Yes' &&
                            !createdClient?.associatedSpouseID && (
                                <div className="w-full">
                                    <button
                                        type="submit"
                                        onClick={onSubmit}
                                        className="h-[52px] w-full rounded-[5px] bg-neutral-900 px-[20px] py-[16px] text-white"
                                    >
                                        Create spouse intake form
                                    </button>
                                </div>
                            )}
                    </div>
                </div>
            </div>
        </div>
    )
}

const Page = () => {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <CompletedProfileContent />
        </Suspense>
    )
}

export default Page
