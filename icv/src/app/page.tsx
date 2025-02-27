'use client'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

export const dynamic = 'force-dynamic'

export default function Home() {
    return (
        <div className="p-6">
            <Card>
                <h1 className="text-xl font-bold">Akhilesh Basetty</h1>
                <p>lorem ipsum</p>
                <Button>Click me</Button>
            </Card>
        </div>
    )
}
