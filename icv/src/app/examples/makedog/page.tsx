'use client'

import { useRouter } from 'next/navigation'

const page = () => {
    const router = useRouter()

    return (
        <div className="flex h-screen w-screen flex-col items-center justify-center gap-4">
            <h1>Create a Dog!</h1>

            <button
                onClick={() => {
                    router.push('/examples/makedog/info')
                }}
            >
                Next
            </button>
        </div>
    )
}

export default page
