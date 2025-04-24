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
                    <div className="mx-auto flex w-[95%] items-center justify-between px-10">
                        <div className="w-[100px]">
                            <ProgressCircle
                                title="Profile"
                                goTo="/intake"
                                num="1"
                            />
                        </div>

                        <div className="relative flex-1">
                            <div className="absolute -top-[15px] left-4 right-4 h-px bg-[#27262A]" />
                        </div>

                        <div className="w-[100px]">
                            <ProgressCircle
                                title="Family"
                                goTo="/intake/family"
                                num="2"
                            />
                        </div>

                        <div className="relative flex-1">
                            <div className="absolute -top-[15px] left-4 right-4 h-px bg-[#27262A]" />
                        </div>

                        <div className="w-[100px]">
                            <ProgressCircle
                                title="Background"
                                goTo="/intake/family/background"
                                num="3"
                            />
                        </div>

                        <div className="relative flex-1">
                            <div className="absolute -top-[15px] left-4 right-4 h-px bg-[#27262A]" />
                        </div>

                        <div className="w-[100px]">
                            <ProgressCircle
                                title="Services"
                                goTo="/intake/family/background/services"
                                num="4"
                            />
                        </div>

                        <div className="relative flex-1">
                            <div className="absolute -top-[15px] left-4 right-4 h-px bg-[#27262A]" />
                        </div>

                        <div className="w-[100px]">
                            <ProgressCircle
                                title="Review"
                                goTo="/intake/family/background/services/confirmation"
                                num="5"
                            />
                        </div>

                        <div className="relative flex-1">
                            <div className="absolute -top-[15px] left-4 right-4 h-px bg-[#27262A]" />
                        </div>

                        <div className="w-[100px]">
                            <ProgressCircle
                                title="Waiver"
                                goTo="/intake/family/background/services/confirmation/waiver"
                                num="6"
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className="pt-36">{children}</div>
        </>
    )
}
