import React, { createContext, useContext, useState } from 'react';

type TimeFrame = 'day' | 'month' | 'year';

interface TimeFrameContextType {
    timeFrame: TimeFrame;
    setTimeFrame: (timeFrame: TimeFrame) => void;
}

const TimeFrameContext = createContext<TimeFrameContextType | undefined>(undefined);

export function TimeFrameProvider({ children }: { children: React.ReactNode }) {
    const [timeFrame, setTimeFrame] = useState<TimeFrame>('day');

    return (
        <TimeFrameContext.Provider value={{ timeFrame, setTimeFrame }}>
            {children}
        </TimeFrameContext.Provider>
    );
}

export function useTimeFrame() {
    const context = useContext(TimeFrameContext);
    if (context === undefined) {
        throw new Error('useTimeFrame must be used within a TimeFrameProvider');
    }
    return context;
} 