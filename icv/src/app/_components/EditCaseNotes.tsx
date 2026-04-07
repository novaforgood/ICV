'use client'

import { updateCaseNotes } from '@/api/events'
import { deleteEvent } from '@/api/make-cases/make-event'
import { Button } from '@/components/ui/button'
import { Mic, MicOff } from 'lucide-react'
import { useEffect, useState } from 'react'
import DeleteConfirmDialog from '@/app/_components/DeleteConfirmDialog'

interface SpeechRecognition extends EventTarget {
    continuous: boolean
    interimResults: boolean
    lang: string
    start(): void
    stop(): void
    onresult: (event: SpeechRecognitionEvent) => void
    onerror: (event: SpeechRecognitionErrorEvent) => void
}

interface SpeechRecognitionEvent extends Event {
    resultsIndex: number //te;;s us where in the results array the new words start
    results: SpeechRecognitionResultList
}

interface SpeechRecognitionResultList {
    [index: number]: SpeechRecognitionResult
    length: number
}

interface SpeechRecognitionResult {
    [index: number]: SpeechRecognitionAlternative
    isFinal: boolean
    length: number
}

interface SpeechRecognitionAlternative {
    transcript: string
    confidence: number
}

interface SpeechRecognitionErrorEvent extends Event {
    error: string
    message: string
}

declare global {
    interface Window {
        SpeechRecognition: new () => SpeechRecognition
        webkitSpeechRecognition: new () => SpeechRecognition
    }
}

interface EditCaseNotesProps {
    eventId: string
    initialNotes: string
    clientName?: string
    onClose: () => void
    onSave: (notes: string) => void
}

const EditCaseNotes: React.FC<EditCaseNotesProps> = ({
    eventId,
    initialNotes,
    clientName,
    onClose,
    onSave,
}) => {
    const [notes, setNotes] = useState(initialNotes)
    const [vnotes, setVnotes] = useState('') //seperate voice notes that are kept away from previously saved notes/written notes bc the voice functionality overwrites previous notes if saved in the same state var
    const [isRecording, setIsRecording] = useState(false)
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
    const [recognition, setRecognition] = useState<SpeechRecognition | null>(
        null,
    )

    useEffect(() => {
        // Initialize speech recognition
        if (typeof window !== 'undefined') {
            const SpeechRecognition =
                window.SpeechRecognition || window.webkitSpeechRecognition
            if (SpeechRecognition) {
                const recognition = new SpeechRecognition()
                recognition.continuous = true
                recognition.interimResults = true
                recognition.lang = 'en-US'

                recognition.onresult = (event: SpeechRecognitionEvent) => {
                    const transcript = Array.from(event.results)
                        .map((result) => result[0].transcript)
                        .join('')
                    setVnotes(transcript)
                }

                recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
                    console.error('Speech recognition error:', event.error)
                    setIsRecording(false)
                }

                setRecognition(recognition)
            }
        }
    }, [])

    const toggleRecording = () => {
        if (!recognition) {
            alert('Speech recognition is not supported in your browser.')
            return
        }

        if (isRecording) {
            recognition.stop()
            // Merge dictated text once when stopping so typing won't duplicate it.
            if (vnotes) {
                setNotes((prev) => prev + vnotes)
                setVnotes('')
            }
        } else {
            setNotes((prev) => prev + '\n ---- Speech to Text Notes: \n') //append to written/any previous notes that we are about to start our vnotes (voice notes)
            recognition.start()
        }
        setIsRecording(!isRecording)
    }

    const handleSave = async () => {
        const finalNotes = notes + (isRecording ? vnotes : '')
        try {
            await updateCaseNotes(eventId, finalNotes)
            onSave(finalNotes)
            onClose()
        } catch (error) {
            console.error('Error saving case notes:', error)
            alert('Failed to save case notes. Please try again.')
        }
    }

    const handleDeleteEvent = async (eventId: string) => {
        try {
            await deleteEvent(eventId)
            setShowDeleteConfirm(false)
            onClose()
        } catch (error) {
            console.error('Error deleting event:', error)
            alert('Failed to delete event. Please try again.')
        }
    }

    return (
        <div className="flex flex-col space-y-[64px]">
            <div className="space-y-[12px]">
                <div className="flex flex-col space-y-[8px]">
                    <h3 className="font-bold text-gray-700">Case Notes</h3>
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={toggleRecording}
                            className={`flex items-center gap-2 ${
                                isRecording ? 'text-red-500' : ''
                            }`}
                        >
                            {isRecording ? (
                                <>
                                    <MicOff className="h-4 w-4" />
                                    Stop Recording
                                </>
                            ) : (
                                <>
                                    <Mic className="h-4 w-4" />
                                    Start Recording
                                </>
                            )}
                        </Button>
                    </div>
                </div>

                <div className="relative">
                    <textarea
                        value={notes + (isRecording ? vnotes : '')}
                        onChange={(e) => {
                            setNotes(e.target.value)
                            if (!isRecording && vnotes) {
                                setVnotes('')
                            }
                        }}
                        className="h-48 w-full rounded-md border p-4"
                        placeholder="Enter case notes here..."
                    />
                    {isRecording && (
                        <div className="absolute right-4 top-4 flex items-center gap-2">
                            <div className="h-3 w-3 animate-pulse rounded-full bg-red-500" />
                            <span className="text-sm text-red-500">
                                Recording...
                            </span>
                        </div>
                    )}
                </div>

                <p className="text-sm text-gray-500">
                    {isRecording
                        ? 'Speak clearly into your microphone. Your speech will be converted to text automatically.'
                        : 'Click "Start Recording" to use speech-to-text, or type your notes manually.'}
                </p>
            </div>
            <div className="flex flex-col space-y-[12px] sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
                <div className="flex flex-wrap items-center justify-start space-x-[24px]">
                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-[5px] bg-[#1A1D20] px-[20px] py-[16px] text-white hover:bg-[#6D757F]"
                    >
                        <div className="flex flex-row space-x-[8px]">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                height="20px"
                                viewBox="0 -960 960 960"
                                width="20px"
                                fill="#FFFFFF"
                            >
                                <path d="m291-240-51-51 189-189-189-189 51-51 189 189 189-189 51 51-189 189 189 189-51 51-189-189-189 189Z" />
                            </svg>
                            Cancel
                        </div>
                    </button>

                    <button
                        type="button"
                        onClick={handleSave}
                        className="rounded-[5px] bg-[#4EA0C9] px-[20px] py-[16px] text-white hover:bg-[#246F95]"
                    >
                        <div className="flex flex-row space-x-[8px]">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                height="20px"
                                viewBox="0 -960 960 960"
                                width="20px"
                                fill="#FFFFFF"
                            >
                                <path d="M389-267 195-460l51-52 143 143 325-324 51 51-376 375Z" />
                            </svg>
                            Save
                        </div>
                    </button>
                </div>
                <button
                    type="button"
                    onClick={() => setShowDeleteConfirm(true)}
                    className="w-fit rounded-[5px] bg-[#FF394D] px-[20px] py-[16px] text-white hover:bg-[#6D757F]"
                >
                    <div className="flex flex-row space-x-[8px]">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            height="20px"
                            viewBox="0 -960 960 960"
                            width="20px"
                            fill="#e3e3e3"
                        >
                            <path d="M312-144q-29.7 0-50.85-21.15Q240-186.3 240-216v-480h-48v-72h192v-48h192v48h192v72h-48v479.57Q720-186 698.85-165T648-144H312Zm336-552H312v480h336v-480ZM384-288h72v-336h-72v336Zm120 0h72v-336h-72v336ZM312-696v480-480Z" />
                        </svg>
                        Delete Check-in
                    </div>
                </button>
            </div>

            <DeleteConfirmDialog
                isOpen={showDeleteConfirm}
                onClose={() => setShowDeleteConfirm(false)}
                onConfirm={() => handleDeleteEvent(eventId)}
                entityName={clientName}
            />
        </div>
    )
}

export default EditCaseNotes
