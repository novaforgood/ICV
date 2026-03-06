'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { useUser } from '@/hooks/useUser'
import { cn } from '@/lib/utils'
import { useEffect, useRef, useState } from 'react'
import Symbol from '../../components/Symbol'
import LogoutButton from './LogoutButton'

const formatNameForWrap = (name: string | null | undefined) => {
    if (!name) return ''
    const parts = name.trim().split(/\s+/)
    if (parts.length <= 1) return name
    return parts.slice(0, -1).join(' ') + ' \u200B' + parts[parts.length - 1]
}

const Navbar = () => {
    const { user } = useUser()
    const [open, setOpen] = useState(false)
    const menuRef = useRef<HTMLDivElement>(null)

    // Collapse navbar when viewport shrinks below desktop
    useEffect(() => {
        const mediaQuery = window.matchMedia('(min-width: 1024px)')
        const handleResize = () => {
            if (!mediaQuery.matches) setOpen(false)
        }
        mediaQuery.addEventListener('change', handleResize)
        return () => mediaQuery.removeEventListener('change', handleResize)
    }, [])

    // Close when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (
                menuRef.current &&
                !menuRef.current.contains(event.target as Node)
            ) {
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
                <div
                    ref={menuRef}
                    className="fixed left-0 top-0 z-40 flex h-full w-20 flex-col items-center gap-4 bg-foreground text-background lg:hidden"
                >
                    <div
                        onClick={() => setOpen(true)}
                        className="absolute top-4 z-50 cursor-pointer justify-center"
                    >
                        <Symbol symbol="menu" />
                    </div>
                    <div className="py-6" />
                    <div className="flex w-full flex-col items-center justify-center gap-2 py-8">
                        <img
                            src={user?.photoURL || '/icv.png'}
                            alt="logo"
                            className="m-4 h-16 w-16 rounded-full"
                        />
                    </div>
                    <div className="flex w-full flex-col items-center justify-center">
                        <NavLink href="/" collapsed>
                            <Symbol symbol="home" largerIcon />
                        </NavLink>
                        <NavLink href="/intake" collapsed>
                            <Symbol symbol="add" largerIcon />
                        </NavLink>
                        <NavLink href="/calendar" collapsed>
                            <Symbol symbol="calendar_month" largerIcon />
                        </NavLink>
                        <NavLink href="/clients" collapsed>
                            <Symbol symbol="group" largerIcon />
                        </NavLink>
                        <NavLink href="/database" collapsed>
                            <Symbol symbol="database" largerIcon />
                        </NavLink>
                        <NavLink href="/settings" collapsed>
                            <Symbol symbol="Settings" largerIcon />
                        </NavLink>
                    </div>
                </div>
            )}
            {open && (
                <div
                    ref={menuRef}
                    className="fixed left-0 top-0 z-50 flex h-full w-64 flex-col items-center gap-4 bg-foreground text-background lg:hidden"
                >
                    <div className="flex w-full flex-col items-center justify-center gap-2 px-4">
                        <img
                            src={user?.photoURL || '/icv.png'}
                            alt="logo"
                            className="m-4 h-16 w-16 rounded-full"
                        />
                        <h1 className="w-full break-words px-4 text-center text-xl font-bold">
                            {formatNameForWrap(user?.displayName)}
                        </h1>
                        <p className="w-full break-words px-4 text-center">
                            {user?.email?.replace('@', '@\u200B')}
                        </p>
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
            <div className="fixed left-0 top-0 z-40 hidden h-full w-64 flex-col items-center gap-4 bg-foreground text-background lg:flex">
                <div className="flex w-full flex-col items-center justify-center gap-2 py-8">
                    <img
                        src={user?.photoURL || '/icv.png'}
                        alt="logo"
                        className="m-4 h-16 w-16 rounded-full"
                    />
                    <h1 className="w-full break-words px-4 text-center text-xl font-bold">
                        {formatNameForWrap(user?.displayName)}
                    </h1>
                    <p className="w-full break-words px-4 text-center">
                        {user?.email?.replace('@', '@\u200B')}
                    </p>
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
                    ? 'flex w-full items-center justify-center py-4'
                    : 'flex w-full flex-row items-center justify-start gap-2 px-6 py-4 text-center',
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
