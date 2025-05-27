import React, { useState, useEffect, useRef } from 'react'
import useSWR from 'swr'
import { createCheckIn, updateCaseNotes } from '@/api/events'
import { getAllClients } from '@/api/clients'
import { CheckInCategory, CheckInType, ContactType } from '@/types/event-types'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { format } from 'date-fns'
import { Card } from '@/components/ui/card'
import ClientCard from './ClientCard'
import ClientSearch from '@/app/_components/ClientSearch'

const enum Step {
  ChooseClient,
  ConfirmClient,
  Complete,
  CaseNotes
}

interface CaseNotesProps {
  caseNotes: string
  setCaseNotes: (notes: string) => void
  submitCaseNotes: () => void
}

const CaseNotesComponent: React.FC<CaseNotesProps> = React.memo(({ caseNotes, setCaseNotes, submitCaseNotes }) => {
  const textAreaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    // Focus the textarea on mount
    textAreaRef.current?.focus()
  }, [])

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Wellness Check</h2>
      <textarea
        ref={textAreaRef}
        value={caseNotes}
        onChange={(e) => setCaseNotes(e.target.value)}
        placeholder="Enter case notes"
        className="w-full p-2 border border-gray-300 rounded mb-2 h-32"
      />
      <button onClick={submitCaseNotes} className="w-full bg-foreground text-white p-2 rounded">
        Add Case Notes
      </button>
    </div>
  )
})

const MultiStepCheckIn = () => {
  const [step, setStep] = useState<Step>(Step.ChooseClient)
  const [clientSearch, setClientSearch] = useState('')
  const [selectedClientDocId, setSelectedClientDocId] = useState('')
  const [name, setName] = useState('')
  const [date, setDate] = useState('')
  const [category, setCategory] = useState(CheckInCategory.Values.Other)
  const [assigneeId, setAssigneeId] = useState('')
  const [caseNotes, setCaseNotes] = useState('')
  const [checkInID, setcheckInID] = useState('')
  const [showSuccess, setShowSuccess] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  const openModal = () => setIsOpen(true)
  const closeModal = () => {
    setIsOpen(false)
    setStep(Step.ChooseClient)
    setCategory(CheckInCategory.Values.Other)
    setClientSearch('')
    setSelectedClientDocId('')
    setName('')
    setDate('')
    setAssigneeId('')
    setCaseNotes('')
    setcheckInID('')
  }
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // After changes, put the focus back on the input
    inputRef.current?.focus();
  }, [clientSearch]);

  const { data: clients } = useSWR('clients', getAllClients)

  const filteredClients = clients
    ? clients.filter((client: any) => {
        const fullName = `${client.firstName} ${client.lastName}`.toLowerCase()
        return fullName.includes(clientSearch.toLowerCase())
      })
    : []

  const selectedClient = clients?.find((client: any) => client.docId === selectedClientDocId) || null

    useEffect(() => {
        const auth = getAuth()
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user?.displayName) setAssigneeId(user.displayName)
        })
        return () => unsubscribe()
    }, [])

  const handleSubmit = async () => {
    const newEvent: CheckInType & { clientId?: string } = {
      startTime: new Date().toLocaleString('en-US'),
      assigneeId,
      clientId: selectedClientDocId,
      category: category,
      scheduled: false,
      contactCode: ContactType.Values['Wellness Check'],
    }
    console.log('trying to add event:', newEvent);
    try {
      createCheckIn(newEvent).then((id) => {
        setStep(Step.Complete)
        setcheckInID(id)
      })
    } catch (err) {
      alert('Error creating event ' + err)
      console.error('Error creating event:', err)
    }
  }

  const submitCaseNotes = async () => {
    try {
      await updateCaseNotes(checkInID, caseNotes).then(() => {
          setShowSuccess(true)
          setTimeout(() => {
            setShowSuccess(false)
            closeModal()
          }, 2000)
      })
    } catch (err) {
      console.error('Error updating case notes:', err)
    }
  }

const ChooseClient = () => (
  <ClientSearch
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
      {selectedClient && (
        <ClientCard
          client={selectedClient}
        />
      )}

      <div className="mt-8 grid grid-cols-2 gap-4">
        <button 
          type="button" 
          onClick={() => setStep(Step.ChooseClient)}
          className="w-full bg-gray-500 text-white p-3 rounded-lg"
        >
          Back
        </button>
        <button 
          type="submit" 
          className="w-full bg-black text-white p-3 rounded-lg"
        >
          Continue
        </button>
      </div>
    </form>
  )

  const Complete = () => (
    <div className="flex flex-col items-center text-center">
      <h2 className="text-2xl font-semibold mb-4">Wellness Check Completed</h2>
      <p className="text-gray-600 mb-8">
        {selectedClient?.firstName} {selectedClient?.lastName}'s client profile has been updated.
      </p>
      <button
        type="button"
        onClick={() => setStep(Step.CaseNotes)}
        className="flex items-center gap-2 px-6 py-3 bg-black text-white rounded-lg"
      >
        Create Case Note
        <span className="text-xl">+</span>
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
      case Step.CaseNotes:
        return <CaseNotesComponent caseNotes={caseNotes} setCaseNotes={setCaseNotes} submitCaseNotes={submitCaseNotes} />
      default:
        return null
    }
  }

  return (
    <>
      <button onClick={openModal} className="w-full px-4 py-4 bg-foreground text-white rounded">
        + Add Wellness Event
      </button>
      {isOpen && showSuccess && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                  <Card className="px-4 py-2 rounded text-center w-fit">
                    Case note added successfully!
                  </Card>
                </div>
      ) }
      {isOpen && !showSuccess && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black opacity-50" onClick={closeModal} />
          {/* Modal container */}
          <div className="relative bg-white rounded-lg shadow-lg w-full max-w-2xl p-6 z-10">
            <button onClick={closeModal} className="absolute top-2 right-2 text-gray-500 hover:text-gray-700">
              &#x2715;
            </button>
            <div className="w-full">
              {step < Step.Complete && (<h2 className="mb-4 text-xl font-bold">Wellness Check</h2>)}
              {renderStep()}
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default MultiStepCheckIn
