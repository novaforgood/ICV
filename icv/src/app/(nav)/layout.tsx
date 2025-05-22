import React from 'react'
import Navbar from '../_components/Navbar'

interface Props {}

export default function layout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <>
            <Navbar />
            <div className="min-h-screen pl-40 md:pl-64">{children}</div>
        </>
    )
}
