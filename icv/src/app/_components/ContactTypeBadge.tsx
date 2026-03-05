import React from 'react'
import categoryColors, { ContactTypeKey } from './categoryColors'

interface Props {
    type: ContactTypeKey 
}

export const ContactTypeBadge: React.FC<Props> = ({ type }) => {
    return (
        <span
            className={`rounded-[20px] px-[12px] py-[4px] ${categoryColors[type]} text-[14px] font-['Epilogue'] font-[400]`}
        >
            {type}
        </span>
    )
}
