interface ProgressBoxProps {
    title: string
    status: string
}

export const ProgressBox = ({ title, status }: ProgressBoxProps) => {
    const getStatusClass = () => {
        if (status === 'not-started') return 'bg-black text-white'
        if (status === 'in-progress') return 'bg-blue-300 text-white'
    }

    return (
        <div
            className={`mx-2 inline-block rounded-lg px-6 py-2 text-center font-bold ${getStatusClass()}`}
        >
            {title}
        </div>
    )
}
