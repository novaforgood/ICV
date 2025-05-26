'use client'

import { getClientById, updateClient } from '@/api/make-cases/make-case'
import { ClientIntakeSchema } from '@/types/client-types'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { TypeOf } from 'zod'

const Page = () => {
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
    }, [createdClient, clientID])

    const onSubmit = () => {
        router.push(`/intake?spouseID=${clientID}`)
    }

    if (!createdClient) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-white">
                <p className="text-lg font-medium text-gray-700">
                    Creating Client...
                </p>
            </div>
        )
    }

    return (
        <div className="fixed w-full bg-white">
            <div className="ml-6 mt-6 space-y-[24px]">
                <button type="button" onClick={() => router.push('/')}>
                    {'<'} Back to dashboard
                </button>
            </div>
            <div className="flex min-h-screen items-center justify-center">
                <div className="min-w-[800px] space-y-[48px]">
                    <div className="space-y-[24px]">
                        <label className="block text-center font-['Epilogue'] text-[40px] font-bold leading-[56px] text-neutral-900">
                            Saved!
                        </label>
                        <p className="text-center text-lg text-gray-700">
                            {createdClient?.firstName} {createdClient?.lastName}
                            's profile has been created.
                        </p>
                    </div>
                    <div className="flex flex-col items-center justify-center space-y-[24px]">
                        <button
                            type="button"
                            onClick={() => {
                                router.push(`/clients/${clientID}`)
                            }}
                            className="h-[52px] w-[300px] rounded-[5px] bg-neutral-900 px-[20px] py-[16px] text-white"
                        >
                            View client profile
                        </button>
                        {createdClient?.spouseClientStatus === 'Yes' &&
                            !createdClient?.associatedSpouseID && (
                                <button
                                    type="submit"
                                    onClick={onSubmit}
                                    className="h-[52px] w-[400px] rounded-[5px] bg-neutral-900 px-[20px] py-[16px] text-white"
                                >
                                    Create spouse intake form
                                </button>
                            )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Page
