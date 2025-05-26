interface Props {
  symbol: string
  className?: string
}

const Symbol = (props: Props) => {
  return (
    <>
      <span className={`material-symbols-outlined responsive-icon ${props.className || ''}`}>
        {props.symbol}
      </span>
      <style jsx>{`
        .responsive-icon {
          font-size: 50px;
        }

        @media (min-width: 1140px) {
          .responsive-icon {
            font-size: 30px;
          }
        }
      `}</style>
    </>
  )
}

export default Symbol
