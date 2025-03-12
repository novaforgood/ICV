'use client'
import { useRouter } from 'next/navigation'
import { ProgressCircle } from './components/ProgressBar'

export default function layout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    const router = useRouter()
    return (
        <>
            <div className="fixed left-0 top-0 z-10 w-full bg-white">
                <div className="ml-6 mt-6 space-y-[24px]">
                    <button type="button" onClick={() => router.push('/')}>
                        {'<'} Back to dashboard
                    </button>
                </div>

                <div className="ml-6 mt-6 space-y-[24px]">
                    <div className="mx-auto flex w-[90%] justify-between px-10">
                        <div className="absolute left-[200px] right-[160px] top-[95px] z-[-1] h-[2px] bg-[#27262A]" />
                        <ProgressCircle
                            title="Cllient Profile"
                            goTo="/intake"
                            num="1"
                        />
                        <ProgressCircle
                            title="Family"
                            goTo="/intake/family"
                            num="2"
                        />
                        <ProgressCircle
                            title="Background"
                            goTo="/intake/family/background"
                            num="3"
                        />
                        <ProgressCircle
                            title="Services"
                            goTo="/intake/family/background/services"
                            num="4"
                        />
                        <ProgressCircle
                            title="Review"
                            goTo="/intake/family/background/services/confirmation"
                            num="5"
                        />
                    </div>
                </div>
            </div>

            <div className="pt-36">{children}</div>
        </>
    )
}
