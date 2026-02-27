import { getScheduledEvents } from '@/api/events'
import { NextResponse } from 'next/server'

export async function GET() {
    try {
        const events = await getScheduledEvents()
        return NextResponse.json(events)
    } catch (error) {
        console.error('Error fetching scheduled events:', error)
        const message =
            error instanceof Error ? error.message : 'Failed to fetch events'
        return NextResponse.json({ error: message }, { status: 500 })
    }
}
