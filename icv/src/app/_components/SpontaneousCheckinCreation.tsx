import { getAllClients } from '@/api/clients'
import { Card } from '@/components/ui/card'
import { CheckInCategory, CheckInType } from '@/types/event-types'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import React, { useEffect, useMemo, useState } from 'react'
import useSWR from 'swr'

const enum Step {
    ChooseClient,
    ChooseCheckInType,
    Complete,
}

const MultiStepCheckIn = () => {
    const [step, setStep] = useState<Step>(Step.ChooseClient)
    const [clientSearch, setClientSearch] = useState('')
    const [selectedClientId, setSelectedClientId] = useState('')
    const [name, setName] = useState('')
    const [date, setDate] = useState('')
    const [category, setCategory] = useState('')
    const [assigneeId, setAssigneeId] = useState('')

    const { data: clients } = useSWR('clients', getAllClients)

    const filteredClients = useMemo(() => {
        if (!clients) return []
        return clients.filter((client: any) => {
            const fullName =
                `${client.firstName} ${client.lastName}`.toLowerCase()
            return fullName.includes(clientSearch.toLowerCase())
        })
    }, [clients, clientSearch])

    const selectedClient = useMemo(() => {
        return (
            clients?.find((client: any) => client.id === selectedClientId) ||
            null
        )
    }, [clients, selectedClientId])

    useEffect(() => {
        const auth = getAuth()
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user?.displayName) setAssigneeId(user.displayName)
        })
        return () => unsubscribe()
    }, [])

    const handleSubmit = async () => {
        const newEvent: CheckInType & { clientId?: string } = {
            startTime: new Date(),
            assigneeId,
            clientId: selectedClientId,
            category: category,
            scheduled: false,
        }
        try {
            await createScheduledCheckIn(newEvent)
            setStep(Step.Complete)
        } catch (err) {
            console.error('Error creating event:', err)
        }
    }

    const ChooseClient = () => (
        <div>
            <h2 className="mb-4 text-xl font-bold">Choose A Client</h2>
            <input
                type="text"
                value={clientSearch}
                onChange={(e) => setClientSearch(e.target.value)}
                placeholder="Search by name"
                className="mb-2 w-full rounded border border-gray-300 p-2"
            />
            <ul className="max-h-48 overflow-y-auto">
                {filteredClients.map((client: any) => (
                    <li
                        key={client.id}
                        onClick={() => {
                            setSelectedClientId(client.id)
                            setStep(Step.ChooseCheckInType)
                        }}
                        className="cursor-pointer p-2 hover:bg-gray-200"
                    >
                        {client.firstName} {client.lastName}
                    </li>
                ))}
            </ul>
        </div>
    )

    const ChooseCheckInType = () => (
        <form
            onSubmit={(e) => {
                e.preventDefault()
                handleSubmit()
            }}
        >
            <h2 className="mb-4 text-xl font-bold">Wellness Check</h2>

            <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="mb-2 w-full rounded border p-2"
            >
                <option value="">Select category</option>
                {Object.values(CheckInCategory.Values).map((cat) => (
                    <option key={cat} value={cat}>
                        {cat}
                    </option>
                ))}
            </select>

            <button
                type="submit"
                className="w-full rounded bg-foreground p-2 text-white"
            >
                Submit
            </button>
        </form>
    )

    const Complete = () => (
        <div>
            <h2 className="mb-4 text-xl font-bold">Check-In Complete</h2>
            <p>
                Check-in for {selectedClient?.firstName} has been successfully
                logged.
            </p>
        </div>
    )

    const renderStep = () => {
        switch (step) {
            case Step.ChooseClient:
                return <ChooseClient />
            case Step.ChooseCheckInType:
                return <ChooseCheckInType />
            case Step.Complete:
                return <Complete />
            default:
                return null
        }
    }

    return (
        <Card className="flex w-full max-w-md flex-col items-center justify-start p-6">
            {renderStep()}
            {step > Step.ChooseClient && step < Step.Complete && (
                <button
                    onClick={() => setStep((s) => s - 1)}
                    className="mt-4 text-foreground"
                >
                    Back
                </button>
            )}
        </Card>
    )
}

const SpontaneousCheckInModal: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false)

    const openModal = () => setIsOpen(true)
    const closeModal = () => setIsOpen(false)

    return (
        <>
            <button
                onClick={openModal}
                className="rounded bg-blue-600 px-4 py-2 text-white"
            >
                Create Check-In Event
            </button>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-black opacity-50"
                        onClick={closeModal}
                    />
                    {/* Modal container */}
                    <div className="relative z-10 w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
                        <button
                            onClick={closeModal}
                            className="absolute right-2 top-2 text-gray-500 hover:text-gray-700"
                        >
                            &#x2715;
                        </button>
                        <MultiStepCheckIn />
                    </div>
                </div>
            )}
        </>
    )
}

export default SpontaneousCheckInModal
