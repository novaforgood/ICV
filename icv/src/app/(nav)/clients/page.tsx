'use server'

import SearchComponent from '@/app/_components/SearchComponent'
// import SeedDataButton from '@/app/_components/SeedDataButton'

export default async function ClientsPage() {

    return (
        <div className="w-full p-6">
            
            <SearchComponent />
            
            <div className="mt-4">
                {/* <SeedDataButton /> */}
            </div>
        </div>
    )
}
