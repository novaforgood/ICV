'use client'

import clsx from 'clsx'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

import LogoutButton from './LogoutButton'
import Symbol from './Symbol'

const Navbar = () => {
    return (
        <div className="fixed left-0 top-0 flex h-full w-64 flex-col items-center gap-4 bg-foreground text-background">
            <div className="flex w-full flex-col items-center justify-center gap-2 py-8">
                <img
                    src="https://picsum.photos/seed/meow/200"
                    alt="logo"
                    className="m-4 h-16 w-16 rounded-full"
                />
                <h1 className="text-xl font-bold">Akhilesh Basetty</h1>
                <p>bakhilesh@gmail.com</p>
            </div>
            <div className="flex w-full flex-col items-stretch justify-center">
                <NavLink href="/">
                    <Symbol symbol="home" />
                    Home
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
            </div>
            <div className="flex-1" />
            <LogoutButton />
        </div>
    )
}

interface NavLinkProps {
    href: string
    children: React.ReactNode
}

const NavLink = (props: NavLinkProps) => {
    // get the current route
    const pathname = usePathname()

    console.log('pathname', pathname)

    // check if the current route starts with the href
    let isActive = pathname.startsWith(props.href)
    if (props.href === '/') isActive = pathname === '/' // special case for home

    return (
        <Link
            href={props.href}
            className={clsx(
                'flex w-full flex-row items-center justify-start gap-2 px-6 py-4 text-center transition-colors',
                {
                    'bg-background': isActive,
                    'text-foreground': isActive,
                },
            )}
        >
            {props.children}
        </Link>
    )
}

export default Navbar
