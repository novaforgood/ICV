interface Props {
    symbol: string
}

const Symbol = (props: Props) => {
    return <span className="material-symbols-outlined">{props.symbol}</span>
}

export default Symbol
