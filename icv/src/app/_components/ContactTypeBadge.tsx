import React from 'react'
import { ContactType } from '../../types/event-types'
import categoryColors, { ContactTypeKey } from './categoryColors'

interface Props {
    type: ContactTypeKey 
}

export const ContactTypeBadge: React.FC<Props> = ({ type }) => {
    return (
        <span
            className={`rounded-full px-2 py-1 ${categoryColors[type]} text-sm`}
        >
            {type}
        </span>
    )
}
