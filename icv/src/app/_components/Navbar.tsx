'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { useUser } from '@/hooks/useUser'
import { cn } from '@/lib/utils'
import Symbol from '../../components/Symbol'
import LogoutButton from './LogoutButton'
import { useState, useEffect, useRef } from 'react'

const Navbar = () => {
    // const [name, setName] = useState<string>('')
    // const [email, setEmail] = useState<string>('')
    // const [photoURL, setPhotoURL] = useState<string>('')
    // // This useEffect hook listens for changes in the user's authentication state
    // // When the user logs in or out, it updates the displayed name
    // // The hook sets up a listener when the component mounts and cleans it up on unmount
    // // The empty dependency array [] means this effect only runs once when mounted
    // useEffect(() => {
    //     //listen for changes in auth state
    //     const unsubscribe = auth.onAuthStateChanged((user) => {
    //         if (user) {
    //             setName(user.displayName || '')
    //             console.log('User display name:', user.displayName)
    //             setEmail(user.email || '')
    //             setPhotoURL(user.photoURL || '')
    //             console.log('User photoURL:', user.photoURL)
    //         } else {
    //             setName('')
    //             setEmail('')
    //             setPhotoURL('')
    //         }
    //     })

    //     return () => unsubscribe()
    // }, [])

    
    const { user } = useUser()
    const [ open, setOpen ] = useState(false)
    const menuRef = useRef<HTMLDivElement>(null)

    // Close when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
        if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
            setOpen(false)
        }
        }

        if (open) {
        document.addEventListener('mousedown', handleClickOutside)
        }

        return () => {
        document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [open])

    return (
        <div>
            {/*tablet view*/} 
            {!open && (      
            <div ref={menuRef} className="md:hidden flex fixed left-0 top-0 h-full w-14 flex-col items-center gap-4 bg-foreground text-background">
                <div onClick={() => setOpen(true)} className="absolute top-4 justify-center cursor-pointer z-50">
                    <div className="w-6 h-0.5 bg-background mb-1"></div>
                    <div className="w-6 h-0.5 bg-background mb-1"></div>
                    <div className="w-6 h-0.5 bg-background mb-1"></div>
                </div>
                <div className="flex w-full flex-col items-center justify-center gap-2 py-8">
                    <img
                        src={
                            user?.photoURL || '/cavediva.jpeg'
                        }
                        alt="logo"
                        className="m-4 h-8 w-8 rounded-full"
                    />
                </div>
                <div className="flex w-full flex-col items-center justify-center">
                    <NavLink href="/" collapsed>
                        <Symbol symbol="home"/>
                    </NavLink>
                    <NavLink href="/intake" collapsed>
                        <Symbol symbol="add" />
                    </NavLink>
                    <NavLink href="/calendar" collapsed>
                        <Symbol symbol="calendar_month" />
                    </NavLink>
                    <NavLink href="/clients" collapsed>
                        <Symbol symbol="group" />
                    </NavLink>
                    <NavLink href="/database" collapsed>
                        <Symbol symbol="database" />
                    </NavLink>
                    <NavLink href="/settings" collapsed>
                        <Symbol symbol="Settings" />
                    </NavLink>
                </div>
            </div>
            )}   
            {open && (        
            <div ref={menuRef} className="md:hidden flex fixed left-0 top-0 h-full w-64 flex-col items-center gap-4 bg-foreground text-background">
                <div className="flex w-full flex-col items-center justify-center gap-2 py-8">
                    <img
                        src={
                            user?.photoURL || '/cavediva.jpeg'
                        }
                        alt="logo"
                        className="m-4 h-16 w-16 rounded-full"
                    />
                    <h1 className="text-xl font-bold">{user?.displayName}</h1>
                    <p>{user?.email}</p>
                </div>
                <div className="flex w-full flex-col items-center justify-start">
                    <NavLink href="/">
                        <Symbol symbol="home" />
                        Home
                    </NavLink>
                    <NavLink href="/intake">
                        <Symbol symbol="add" />
                        Intake
                    </NavLink>
                    <NavLink href="/calendar">
                        <Symbol symbol="calendar_month" />
                        Calendar
                    </NavLink>
                    <NavLink href="/clients">
                        <Symbol symbol="group" />
                        Clients
                    </NavLink>
                    <NavLink href="/database">
                        <Symbol symbol="database" />
                        Database
                    </NavLink>
                    <NavLink href="/settings">
                        <Symbol symbol="Settings" />
                        Settings
                    </NavLink>
                </div>
                <div className="flex-1" />
                <LogoutButton />
            </div>
            )}
            {/* desktop view*/}
            <div className="md:flex hidden fixed left-0 top-0 h-full w-64 flex-col items-center gap-4 bg-foreground text-background">
                <div className="flex w-full flex-col items-center justify-center gap-2 py-8">
                    <img
                        src={
                            user?.photoURL || '/cavediva.jpeg'
                        }
                        alt="logo"
                        className="m-4 h-16 w-16 rounded-full"
                    />
                    <h1 className="text-xl font-bold">{user?.displayName}</h1>
                    <p>{user?.email}</p>
                </div>
                <div className="flex w-full flex-col items-stretch justify-start">
                    <NavLink href="/">
                        <Symbol symbol="home" />
                        Home
                    </NavLink>
                    <NavLink href="/intake">
                        <Symbol symbol="add" />
                        Intake
                    </NavLink>
                    <NavLink href="/calendar">
                        <Symbol symbol="calendar_month" />
                        Calendar
                    </NavLink>
                    <NavLink href="/clients">
                        <Symbol symbol="group" />
                        Clients
                    </NavLink>
                    <NavLink href="/database">
                        <Symbol symbol="database" />
                        Database
                    </NavLink>
                    <NavLink href="/settings">
                        <Symbol symbol="Settings" />
                        Settings
                    </NavLink>
                </div>
                <div className="flex-1" />
                <LogoutButton />
            </div>
        </div>
    )
}

interface NavLinkProps {
    href: string
    children: React.ReactNode
    collapsed?: boolean
}

const NavLink = ({ href, children, collapsed = false }: NavLinkProps) => {
    // get the current route
    const pathname = usePathname()

    console.log('pathname', pathname)

    // check if the current route starts with the href
    let isActive = pathname.startsWith(href)
    if (href === '/') isActive = pathname === '/' // special case for home

    return (
        <Link
            href={href}
            className={cn(
                  collapsed
                    ? 'flex w-full justify-center py-4'
                    : 'flex w-full flex-row justify-start gap-2 px-6 py-4 text-center',
                {
                    'bg-background': isActive,
                    'text-foreground': isActive,
                },
            )}
        >
            {children}
        </Link>
    )
}

export default Navbar
