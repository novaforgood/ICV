interface Props {
  symbol: string
  className?: string
  largerIcon?: boolean
}

const Symbol = ({ symbol, className, largerIcon = false }: Props) => {
  return (
    <>
        {largerIcon ? (
            <div>
                <span className={`material-symbols-outlined responsive-icon ${className || ''}`}>
                    {symbol}
                </span>
                <style jsx>{`
                    .responsive-icon {
                      font-size: 40px;
                    }
                `}</style>
            </div>
        ) : (
            <div>
                <span className={`material-symbols-outlined responsive-icon ${className || ''}`}>
                    {symbol}
                </span>
            </div>
        )}

    </>
  )
}

export default Symbol
