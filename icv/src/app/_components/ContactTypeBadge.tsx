import React from 'react';
import { ContactType } from '../../types/event-types';
import categoryColors from './categoryColors';

interface Props {
  type: ContactType;
}

export const ContactTypeBadge: React.FC<Props> = ({ type }) => {
  return (
    <span className={`px-2 py-1 rounded-full ${categoryColors[type]} text-sm`}>
      {type}
    </span>
  );
};
