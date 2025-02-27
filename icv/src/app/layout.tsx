'use client'

import { auth } from '../data/firebase'
import type { Metadata } from 'next'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { FaCalendar, FaChartBar, FaCog, FaHome } from 'react-icons/fa'
import { FaPeopleGroup } from 'react-icons/fa6'
// import AuthSetup from './components/AuthSetup'
import AuthSetup from './components/AuthSetup'
import LogoutButton from './components/logoutbutton'
import './globals.css'



export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    
    const [name, setName] = useState<string>('')
    const [email, setEmail] = useState<string>('')
    const [photoURL, setPhotoURL] = useState<string>('') 
    // This useEffect hook listens for changes in the user's authentication state
    // When the user logs in or out, it updates the displayed name
    // The hook sets up a listener when the component mounts and cleans it up on unmount
    // The empty dependency array [] means this effect only runs once when mounted
    useEffect(() => {
        //listen for changes in auth state
        const unsubscribe = auth.onAuthStateChanged((user) => {
            if (user) {
                setName(user.displayName || '')
                console.log('User display name:', user.displayName)
                setEmail(user.email || '')
                setPhotoURL(user.photoURL || '')
            } else {
                setName('')
                setEmail('')
                setPhotoURL('')
            }
        })

        return () => unsubscribe()
    }, [])
    
   

    return (
        <html lang="en">
            <body
                // className={`${geistSans.variable} ${geistMono.variable} antialiased`}
                className={`antialiased`}
            >
                <AuthSetup />
                <div className="fixed left-0 top-0 flex h-full w-56 flex-col items-center gap-4 bg-slate-200 p-4">
                    <div className="gap flex w-full flex-col items-center justify-center">
                        <img
                            src={photoURL}
                            alt="logo"
                            className="m-4 h-20 w-20 rounded-full"
                        />
                        <h1 className="text-xl font-bold">{name}</h1>
                        <p>{email}</p>
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
                    <LogoutButton />
                </div>
                <div className="pl-56">{children}</div>
            </body>
        </html>
    )
}
