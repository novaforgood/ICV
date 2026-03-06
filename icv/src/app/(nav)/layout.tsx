import React from 'react'
import Navbar from '../_components/Navbar'

export default function layout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <>
            <Navbar />
            <div className="min-h-screen overflow-x-auto pl-20 lg:pl-64">{children}</div>
        </>
    )
}
