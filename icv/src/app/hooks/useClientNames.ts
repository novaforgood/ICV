import { useState, useEffect } from 'react'
import useSWR from 'swr'
import { getClientById } from '@/api/clients'
import { CaseEventType } from '@/types/event-types'

const fetchClientNames = async (events: CaseEventType[]): Promise<Map<string, string>> => {
    const names = new Map<string, string>()
    for (const event of events) {
        try {
            const client = await getClientById(String(event.clientId))
            if (client && client.firstName && client.lastName) {
                names.set(String(event.clientId), `${client.firstName} ${client.lastName}`)
            } else {
                names.set(String(event.clientId), 'Unknown')
            }
        } catch (error) {
            console.error(`Error fetching client with ID ${event.clientId}:`, error)
            names.set(String(event.clientId), 'Unknown')
        }
    }
    return names
}

const useClientNames = (events: CaseEventType[] | undefined) => {
    const [clientNames, setClientNames] = useState<Map<string, string>>(new Map())

    const { data, error } = useSWR(
        events ? ['clientNames', events] : null,
        () => fetchClientNames(events!)
    )

    useEffect(() => {
        if (data) {
            setClientNames(data)
        }
    }, [data])

    return { clientNames, error }
}

export default useClientNames