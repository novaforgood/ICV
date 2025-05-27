import React from 'react';
import { ContactType } from '../types/event-types';

type ColorMapping = {
    background: string;
    text: string;
};

export const contactTypeColors: Record<typeof ContactType.Values[keyof typeof ContactType.Values], ColorMapping> = {
    'Referral and Intake': { background: 'bg-pink-100', text: 'text-pink-800' },
    'Phone': { background: 'bg-green-100', text: 'text-green-800' },
    'Face to Face': { background: 'bg-blue-100', text: 'text-blue-800' },
    'Team Meeting': { background: 'bg-yellow-100', text: 'text-yellow-800' },
    'Individual Meeting': { background: 'bg-purple-100', text: 'text-purple-800' },
    'Family Meeting': { background: 'bg-teal-100', text: 'text-teal-800' },
    'Referral to Service Provider': { background: 'bg-rose-100', text: 'text-rose-800' },
    'Emplyment Job Readiness': { background: 'bg-lime-100', text: 'text-lime-800' },
    'Transportation': { background: 'bg-indigo-100', text: 'text-indigo-800' },
    'Tracking Check Up': { background: 'bg-orange-100', text: 'text-orange-800' },
    'Advocacy': { background: 'bg-violet-100', text: 'text-violet-800' },
    'Wellness Check': { background: 'bg-amber-100', text: 'text-amber-800' },
    'Other': { background: 'bg-gray-100', text: 'text-gray-800' },
};

export const getContactTypeColors = (type: keyof typeof contactTypeColors): ColorMapping => {
    return contactTypeColors[type];
};

export const ContactTypeBadge: React.FC<{ type: keyof typeof contactTypeColors }> = ({ type }) => {
    const colors = getContactTypeColors(type);
    return (
        <span className={`px-2 py-1 rounded-full ${colors.background} ${colors.text} text-sm`}>
            {type}
        </span>
    );
}; 