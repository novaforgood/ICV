import { getClientById } from '@/api/make-cases/make-case'
import {
    ClientDependents,
    ClientPets,
    ClientSpouse,
} from '@/app/_components/ClientProfileComponents'

const page = async ({
    params,
}: {
    params: {
        clientId: string
    }
}) => {
    const { clientId } = await params
    const client = await getClientById(clientId)
    return (
        <div className="flex min-h-screen px-[48px] py-[24px]">
            <div className="mb-[48px] h-screen w-screen min-w-[800px] space-y-[48px]">
                <div className="space-y-[24px]">
                    <label className="font-epilogue text-[18px] font-bold uppercase leading-[18px] tracking-[0.9px] text-[#A2AFC3]">
                        SPOUSE
                    </label>
                    <ClientSpouse data={client} />
                </div>
                <div className="space-y-[24px]">
                    <label className="font-epilogue text-[18px] font-bold uppercase leading-[18px] tracking-[0.9px] text-[#A2AFC3]">
                        DEPENDENTS
                    </label>
                    <ClientDependents data={client} />
                </div>
                <div className="space-y-[24px]">
                    <label className="font-epilogue text-[18px] font-bold uppercase leading-[18px] tracking-[0.9px] text-[#A2AFC3]">
                        PETS
                    </label>
                    <ClientPets data={client} />
                </div>
            </div>
        </div>
    )
}

export default page
