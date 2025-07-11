'use client'

import Link from 'next/link'
import { useParams, usePathname, useRouter } from 'next/navigation'

export default function ProfileNav() {
    const pathname = usePathname()
    const router = useRouter()
    const { clientId } = useParams()

    const tabs = [
        { name: 'Check-Ins', href: `/clients/${clientId}` },
        { name: 'Profile', href: `/clients/${clientId}/profile` },
        { name: 'Background', href: `/clients/${clientId}/background` },
        { name: 'Family', href: `/clients/${clientId}/family` },
        { name: 'Services', href: `/clients/${clientId}/services` },
        { name: 'Waivers', href: `/clients/${clientId}/waivers` },
    ]

    return (
        <div className="mt-4 w-full overflow-x-auto border-gray-300">
            <div className="flex justify-start space-x-8 px-4">
                {tabs.map((tab) => (
                    <Link
                        key={tab.name}
                        onClick={() => router.push(tab.href)}
                        href={tab.href}
                        className="group relative whitespace-nowrap pb-2 text-lg font-medium"
                    >
                        <span
                            className={`${
                                pathname === tab.href
                                    ? 'border-blue-500 px-10 font-bold text-black'
                                    : 'hover:text-blue-400 relative px-10 text-gray-500'
                            }`}
                        >
                            {tab.name}
                            {/* hovering effect is here :0 */}
                            <span className="hx-5 bg-blue-500 absolute -bottom-1 left-0 h-0.5 w-0 transition-all duration-300 group-hover:w-full"></span>
                        </span>
                    </Link>
                ))}
            </div>
        </div>
    )
}
