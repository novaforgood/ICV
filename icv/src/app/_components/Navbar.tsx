'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { useUser } from '@/hooks/useUser'
import { cn } from '@/lib/utils'
import Symbol from '../../components/Symbol'
import LogoutButton from './LogoutButton'

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

    return (
        <div className="fixed left-0 top-0 flex h-full w-64 flex-col items-center gap-4 bg-foreground text-background">
            <div className="flex w-full flex-col items-center justify-center gap-2 py-8">
                <img
                    src={
                        user?.photoURL || 'https://picsum.photos/seed/meow/200'
                    }
                    alt="logo"
                    className="m-4 h-16 w-16 rounded-full"
                />
                <h1 className="text-xl font-bold">{user?.displayName}</h1>
                <p>{user?.email}</p>
            </div>
            <div className="flex w-full flex-col items-stretch justify-center">
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
            className={cn(
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
