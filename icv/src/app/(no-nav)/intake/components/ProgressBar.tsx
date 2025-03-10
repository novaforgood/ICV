import { cn } from '@/lib/utils'
import { usePathname, useRouter } from 'next/navigation'

interface ProgressBarProps {
    title: string
    // status: string
    goTo: string
    num: string
}

export const ProgressCircle = ({
    title,
    // status,
    goTo,
    num,
}: ProgressBarProps) => {
    const router = useRouter()

    const pathname = usePathname()
    let status: string

    if (pathname === goTo) {
        status = 'in-progress'
    } else if (pathname.startsWith(goTo)) {
        status = 'completed'
    } else {
        status = 'not-started'
    }
    const getStatusClass = () => {
        if (status === 'not-started') return 'bg-[#ADAABB]'
        if (status === 'in-progress') return 'bg-[#4EA0C9]'
        else return 'bg-[#27262A]'
    }

    return (
        <div className="flex flex-col items-center">
            <button
                type="button"
                onClick={() => router.push(goTo)}
                className={cn(
                    `flex h-[44px] w-[44px] items-center justify-center rounded-full font-['Epilogue'] text-[16px] font-semibold text-white`,
                    getStatusClass(),
                )}
            >
                {num}
            </button>
            <label className="mt-2 text-center">{title}</label>
        </div>
    )
}
