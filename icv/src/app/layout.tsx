import type { Metadata } from 'next'
import Link from 'next/link'
import { FaCalendar, FaChartBar, FaCog, FaHome } from 'react-icons/fa'
import { FaPeopleGroup } from 'react-icons/fa6'
// import AuthSetup from './components/AuthSetup'
import './globals.css'

// const geistSans = Geist({
//     variable: '--font-geist-sans',
//     subsets: ['latin'],
// })

// const geistMono = Geist_Mono({
//     variable: '--font-geist-mono',
//     subsets: ['latin'],
// })

export const metadata: Metadata = {
    title: 'Create Next App',
    description: 'Generated by create next app',
}

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <html lang="en">
            <body
                // className={`${geistSans.variable} ${geistMono.variable} antialiased`}
                className={`antialiased`}
            >
                {/* <AuthSetup /> */}
                <div className="fixed left-0 top-0 flex h-full w-56 flex-col items-center gap-4 bg-slate-200 p-4">
                    <div className="gap flex w-full flex-col items-center justify-center">
                        <img
                            src="https://picsum.photos/seed/meow/200"
                            alt="logo"
                            className="m-4 h-20 w-20 rounded-full"
                        />
                        <h1 className="text-xl font-bold">Akhilesh Basetty</h1>
                        <p>bakhilesh@gmail.com</p>
                    </div>
                    <div className="flex w-full flex-col items-stretch justify-center gap-2">
                        <Link
                            href={'/'}
                            className="flex w-full flex-row items-center justify-center rounded-md p-4 text-center hover:bg-slate-300"
                        >
                            <FaHome />
                            Home
                        </Link>
                        <Link
                            href={'/'}
                            className="flex w-full flex-row items-center justify-center gap-4 rounded-md p-4 text-center hover:bg-slate-300"
                        >
                            <FaCalendar />
                            Calendar
                        </Link>
                        <Link
                            href={'/'}
                            className="flex w-full flex-row items-center justify-center gap-4 rounded-md p-4 text-center hover:bg-slate-300"
                        >
                            <FaPeopleGroup />
                            Clients
                        </Link>
                        <Link
                            href={'/'}
                            className="flex w-full flex-row items-center justify-center gap-4 rounded-md p-4 text-center hover:bg-slate-300"
                        >
                            <FaChartBar />
                            Data
                        </Link>
                        <Link
                            href={'/'}
                            className="flex w-full flex-row items-center justify-center gap-4 rounded-md p-4 text-center hover:bg-slate-300"
                        >
                            <FaCog />
                            Settings
                        </Link>
                    </div>
                    <div className="flex-1" />
                    <div className="flex w-full flex-row items-center justify-center gap-4 rounded-md p-4 text-center hover:bg-slate-300">
                        Logout
                    </div>
                </div>
                <div className="pl-56">{children}</div>
            </body>
        </html>
    )
}
