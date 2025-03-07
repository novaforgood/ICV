import { cn } from '@/lib/utils'

interface Props {
    symbol: string
    className?: string
}

const Symbol = (props: Props) => {
    return (
        <span className={cn('material-symbols-outlined', props.className)}>
            {props.symbol}
        </span>
    )
}

export default Symbol
