import { getClientById } from '@/api/make-cases/make-case'
import Image from 'next/image'
import ProfileNav from './components/profilenav'

export default async function layout({
    params,
    children,
}: Readonly<{
    params: { clientId: string }
    children: React.ReactNode
}>) {
    const { clientId } = params
    const client = await getClientById(clientId)
    if (!client) {
        throw new Error('Client does not exist')
    }
    return (
        <>
            <div className="sticky left-0 top-0 flex w-full flex-col items-start overflow-x-hidden rounded-md border-b bg-white">
                <div className="flex w-full flex-row px-10">
                    <div className="mr-8 pt-4">
                        <div className="h-[100px] w-[100px] overflow-hidden rounded-full">
                            <Image
                                src={
                                    Array.isArray(client.clientPic) &&
                                    client.clientPic.length > 0
                                        ? client.clientPic[0]?.uri || '/icv.png'
                                        : '/icv.png'
                                }
                                alt="Profile"
                                width={100}
                                height={100}
                                className="object-cover"
                            />
                        </div>
                    </div>
                    <div className="sticky top-0 flex w-full flex-col pt-8">
                        <h1 className="text-5xl font-bold">
                            {client.firstName} {client.lastName}
                        </h1>
                        <p className="text-m pt-2 text-black">
                            {client.clientCode}
                        </p>
                    </div>
                </div>
                <ProfileNav />
            </div>
            <main className="p-6">{children}</main>
        </>
    )
}
