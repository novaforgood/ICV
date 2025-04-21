'use server'

import SearchComponent from '@/app/_components/SearchComponent'
// import SeedDataButton from '@/app/_components/SeedDataButton'

export default async function ClientsPage() {

    return (
        <div className="w-full p-6">
            <h1 className="mb-4 mt-6 w-full text-6xl font-bold max-w-6xl mx-auto">Clients</h1>

            <SearchComponent />
            
            <div className="mt-4">
                {/* <SeedDataButton /> */}
            </div>
        </div>
    )
}
