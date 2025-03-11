import Calendar from './_components/calendar'

interface Props {}

const page = (props: Props) => {
    return (
        <div className="flex h-screen flex-col overflow-hidden p-6">
            <h1 className="mt-6 text-6xl font-bold">Calendar</h1>
            <Calendar events={[]} />
        </div>
    )
}

export default page
