import { getClientById } from '@/api/make-cases/make-case'
import Image from 'next/image'
import ProfileNav from './components/profilenav'
import { string } from 'zod'

const page = async ({
    params
}: {
    params: {
        clientId: string
    }
}) =>{
    const { clientId }  = await params
    const client = await getClientById(clientId)
    return (
        <div>
            {/* Passing clientId and events to ClientEditor */}
            {/* <EditEvents clientId={clientId} events={events} /> */}

            <div className="flex flex-col items-start">
                <div className="ml-8 p-10">
                    <p className="text-5xl"> profile page</p>
                </div>
            </div>
        </div>
    )
}

export default page