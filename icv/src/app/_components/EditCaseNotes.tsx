'use client'

import { updateCaseNotes } from '@/api/events'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Mic, MicOff, Save } from 'lucide-react'
import { useEffect, useState } from 'react'

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
    onClose: () => void
    onSave: (notes: string) => void
}

const EditCaseNotes: React.FC<EditCaseNotesProps> = ({
    eventId,
    initialNotes,
    onClose,
    onSave,
}) => {
    const [notes, setNotes] = useState(initialNotes)
    const [vnotes, setVnotes] = useState("") //seperate voice notes that are kept away from previously saved notes/written notes bc the voice functionality overwrites previous notes if saved in the same state var
    const [isRecording, setIsRecording] = useState(false)
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
        } else {
            setNotes((prev) => prev + '\n ---- Speech to Text Notes: \n') //append to written/any previous notes that we are about to start our vnotes (voice notes)
            recognition.start()
            handleSave
        }
        setIsRecording(!isRecording)
    }

    const handleSave = async () => {
        try {
            await updateCaseNotes(eventId, notes + vnotes)
            onSave(notes + vnotes)
            onClose()
        } catch (error) {
            console.error('Error saving case notes:', error)
            alert('Failed to save case notes. Please try again.')
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <Card className="w-full max-w-2xl p-6">
                <div className="mb-4 flex items-center justify-between">
                    <h2 className="text-xl font-semibold">Edit Case Notes</h2>
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
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
                        <Button variant="outline" onClick={onClose}>
                            Cancel
                        </Button>
                        <Button
                            onClick={handleSave}
                            className="flex items-center gap-2"
                        >
                            <Save className="h-4 w-4" />
                            Save
                        </Button>
                    </div>
                </div>

                <div className="relative">
                    <textarea
                        value={notes + vnotes}
                        onChange={(e) => setNotes(e.target.value)}
                        className="h-64 w-full rounded-md border p-4"
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

                <p className="mt-2 text-sm text-gray-500">
                    {isRecording
                        ? 'Speak clearly into your microphone. Your speech will be converted to text automatically.'
                        : 'Click "Start Recording" to use speech-to-text, or type your notes manually.'}
                </p>
            </Card>
        </div>
    )
}

export default EditCaseNotes
