import { getAllClients } from '@/api/clients'
import { createCheckIn } from '@/api/events'
import ClientCalendarSearch from '@/app/_components/calendar/ClientCalendarSearch'
import { useSpontaneousCheckInModal } from '@/app/_context/SpontaneousCheckInModalContext'
import { CheckInCategory, CheckInType, ContactType } from '@/types/event-types'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import useSWR from 'swr'
import ClientCard from '../ClientCard'

const enum Step {
    ChooseClient,
    ConfirmClient,
    Complete,
}

export function SpontaneousCheckInModalTrigger() {
    const { openModal } = useSpontaneousCheckInModal()

    return (
        <button
            onClick={openModal}
            className="w-full rounded bg-foreground px-4 py-4 text-white"
        >
            + Add Wellness Event
        </button>
    )
}

export function SpontaneousCheckInModalContent() {
    const router = useRouter()
    const { isOpen, closeModal: contextCloseModal } =
        useSpontaneousCheckInModal()
    const [step, setStep] = useState<Step>(Step.ChooseClient)
    const [clientSearch, setClientSearch] = useState('')
    const [selectedClientDocId, setSelectedClientDocId] = useState('')
    const [name, setName] = useState('')
    const [date, setDate] = useState('')
    const [category, setCategory] = useState(CheckInCategory.Values.Other)
    const [assigneeId, setAssigneeId] = useState('')
    const [checkInID, setcheckInID] = useState('')
    const [submitting, setSubmitting] = useState(false)

    const closeModal = () => {
        setStep(Step.ChooseClient)
        setCategory(CheckInCategory.Values.Other)
        setClientSearch('')
        setSelectedClientDocId('')
        setName('')
        setDate('')
        setAssigneeId('')
        setcheckInID('')
        contextCloseModal()
    }

    const { data: clients } = useSWR('clients', getAllClients)

    const selectedClient =
        clients?.find((client: any) => client.docId === selectedClientDocId) ||
        null

    useEffect(() => {
        const auth = getAuth()
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user?.displayName) setAssigneeId(user.displayName)
        })
        return () => unsubscribe()
    }, [])

    const handleSubmit = async () => {
        try {
            setSubmitting(true)
            const now = new Date()
            const intervalMs = 5 * 60 * 1000
            const roundedStart = new Date(
                Math.round(now.getTime() / intervalMs) * intervalMs,
            )
            const end = new Date(roundedStart.getTime() + 15 * 60 * 1000)

            const clientName =
                selectedClient &&
                `${selectedClient.firstName || ''} ${
                    selectedClient.lastName || ''
                }`.trim()
            const clientCode = selectedClient?.clientCode ?? ''

            const newEvent: CheckInType & { clientId?: string } = {
                startTime: roundedStart.toLocaleString('en-US'),
                endTime: end.toLocaleString('en-US'),
                assigneeId,
                clientId: selectedClientDocId,
                clientDocId: selectedClientDocId,
                clientName,
                clientCode,
                category: category,
                scheduled: false,
                contactCode: ContactType.Values['Wellness Check'],
            }
            console.log('trying to add event:', newEvent)

            const id = await createCheckIn(newEvent)
            setStep(Step.Complete)
            setcheckInID(id)
        } catch (err) {
            console.error('Error creating event:', err)
            alert('Error creating event. Please try again.')
        } finally {
            setSubmitting(false)
        }
    }

    const ChooseClient = () => (
        <ClientCalendarSearch
            onSelect={(id) => {
                setSelectedClientDocId(id)
                setStep(Step.ConfirmClient)
            }}
        />
    )

    const ConfirmClient = () => (
        <form
            onSubmit={(e) => {
                e.preventDefault()
                handleSubmit()
            }}
            className="w-full"
        >
            {selectedClient && <ClientCard client={selectedClient} />}

            <div className="mt-8 grid grid-cols-2 gap-4">
                <button
                    type="button"
                    onClick={() => setStep(Step.ChooseClient)}
                    disabled={submitting}
                    className={`rounded-[5px] px-[20px] py-[16px] text-white ${submitting ? 'cursor-not-allowed bg-gray-400' : 'bg-[#1A1D20] hover:bg-gray-600'}`}
                >
                    Back
                </button>
                <button
                    type="submit"
                    disabled={submitting}
                    className={`rounded-[5px] px-[20px] py-[16px] text-white ${submitting ? 'cursor-not-allowed bg-gray-400' : 'bg-[#1A1D20] hover:bg-gray-600'}`}
                >
                    {submitting ? 'Submitting...' : 'Continue'}
                </button>
            </div>
        </form>
    )

    const Complete = () => (
        <div className="flex min-h-0 flex-1 flex-col items-center justify-center space-y-[24px] text-center">
            <h2 className="font-['Epilogue'] text-[24px] font-[600]">
                Wellness Check Completed
            </h2>
            <p className="text-gray-600">
                {selectedClient?.firstName} {selectedClient?.lastName}&apos;s
                client profile has been updated.
            </p>
            <button
                type="button"
                onClick={() => {
                    closeModal()
                    router.push(`/events/${checkInID}`)
                }}
                className="flex rounded-[5px] bg-[#4EA0C9] px-[12px] py-[8px] text-white"
            >
                Add Case Notes
            </button>
        </div>
    )

    const renderStep = () => {
        switch (step) {
            case Step.ChooseClient:
                return <ChooseClient />
            case Step.ConfirmClient:
                return <ConfirmClient />
            case Step.Complete:
                return <Complete />
            default:
                return null
        }
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black opacity-50"
                onClick={closeModal}
            />
            {/* Modal container */}
            <div className="relative z-10 flex h-[80vh] max-h-[600px] w-full max-w-2xl flex-col overflow-hidden rounded-lg bg-white shadow-lg">
                <button
                    type="button"
                    onClick={closeModal}
                    className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center text-gray-500"
                    aria-label="Close"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <path d="M18 6 6 18" />
                        <path d="m6 6 12 12" />
                    </svg>
                </button>
                <div className="flex min-h-0 w-full min-w-0 flex-1 flex-col space-y-[24px] p-[36px]">
                    {step < Step.Complete && (
                        <h2 className="font-['Epilogue'] text-[22px] font-[500]">
                            Wellness Check
                        </h2>
                    )}
                    {renderStep()}
                </div>
            </div>
        </div>
    )
}
