import { getClientById } from '@/api/make-cases/make-case'
import Image from 'next/image'
import ProfileNav from '../../clientprofile/profilenav'

const page = async ({
    params,
}: {
    params: {
        clientId: string
    }
}) => {
    const { clientId } = await params
    const client = await getClientById(clientId)
    // const events = await getEventsbyClientId(clientId)
    const events = {}

    // console.log('client', client)

    return (
        <div>
            {/* Passing clientId and events to ClientEditor */}
            {/* <EditEvents clientId={clientId} events={events} /> */}

            <div className="flex flex-col items-start">
                <div className="sticky left-0 top-0 flex w-full flex-col items-start rounded-md border-b bg-white">
                    <div className="flex w-full flex-row px-10">
                        <div className="mr-8 pt-4">
                            <Image
                                src="/icv.png"
                                alt="ICV Logo"
                                width={150}
                                height={150}
                                priority
                                className="rounded-full"
                            />
                        </div>
                        <div className="sticky top-0 flex w-full flex-col pt-8">
                            <h1 className="text-5xl font-bold">
                                {client.firstName} {client.lastName}
                            </h1>
                            <p className="text-m pt-2 text-gray-600">
                                {client.clientCode}
                            </p>
                            <p className="text-m text-gray-600">
                                Homeless Department
                            </p>
                        </div>
                    </div>
                    <ProfileNav />
                </div>

                <div className="ml-8 p-10">
                    <p className="text-5xl"> bruhhhhfrwfjonahrwgbhah</p>
                    <p className="text-5xl"> bruhhhhfrwfjonahrwgbhah</p>
                    <p className="text-5xl"> bruhhhhfrwfjonahrwgbhah</p>
                    <p className="text-5xl"> bruhhhhfrwfjonahrwgbhah</p>
                    <p className="text-5xl"> bruhhhhfrwfjonahrwgbhah</p>
                    <p className="text-5xl"> bruhhhhfrwfjonahrwgbhah</p>
                    <p className="text-5xl"> bruhhhhfrwfjonahrwgbhah</p>
                    <p className="text-5xl"> bruhhhhfrwfjonahrwgbhah</p>
                    <p className="text-5xl"> bruhhhhfrwfjonahrwgbhah</p>
                    <p className="text-5xl"> bruhhhhfrwfjonahrwgbhah</p>
                    <p className="text-5xl"> bruhhhhfrwfjonahrwgbhah</p>
                    <p className="text-5xl"> bruhhhhfrwfjonahrwgbhah</p>
                    <p className="text-5xl"> bruhhhhfrwfjonahrwgbhah</p>
                    <p className="text-5xl"> bruhhhhfrwfjonahrwgbhah</p>
                    <p className="text-5xl"> bruhhhhfrwfjonahrwgbhah</p>
                    <p className="text-5xl"> bruhhhhfrwfjonahrwgbhah</p>
                    <p className="text-5xl"> bruhhhhfrwfjonahrwgbhah</p>
                    <p className="text-5xl"> bruhhhhfrwfjonahrwgbhah</p>
                    <p className="text-5xl"> bruhhhhfrwfjonahrwgbhah</p>
                    <p className="text-5xl"> bruhhhhfrwfjonahrwgbhah</p>
                    <p className="text-5xl"> bruhhhhfrwfjonahrwgbhah</p>
                    <p className="text-5xl"> bruhhhhfrwfjonahrwgbhah</p>
                    <p className="text-5xl"> bruhhhhfrwfjonahrwgbhah</p>
                    <p className="text-5xl"> bruhhhhfrwfjonahrwgbhah</p>
                    <p className="text-5xl"> bruhhhhfrwfjonahrwgbhah</p>
                    <p className="text-5xl"> bruhhhhfrwfjonahrwgbhah</p>
                    <p className="text-5xl"> bruhhhhfrwfjonahrwgbhah</p>
                    <p className="text-5xl"> bruhhhhfrwfjonahrwgbhah</p>
                    <p className="text-5xl"> bruhhhhfrwfjonahrwgbhah</p>
                    <p className="text-5xl"> bruhhhhfrwfjonahrwgbhah</p>
                    <p className="text-5xl"> bruhhhhfrwfjonahrwgbhah</p>
                    <p className="text-5xl"> bruhhhhfrwfjonahrwgbhah</p>
                    <p className="text-5xl"> bruhhhhfrwfjonahrwgbhah</p>
                    <p className="text-5xl"> bruhhhhfrwfjonahrwgbhah</p>
                    <p className="text-5xl"> bruhhhhfrwfjonahrwgbhah</p>
                </div>
            </div>
        </div>
    )
}

export default page
