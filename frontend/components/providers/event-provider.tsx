'use client';

import { createContext, useContext, useState, useCallback } from 'react';

interface EventContextValue {
  activeEventId: string | null;
  openInspector: (eventId: string) => void;
  closeInspector: () => void;
}

const EventContext = createContext<EventContextValue>({
  activeEventId: null,
  openInspector: () => {},
  closeInspector: () => {},
});

export function EventProvider({ children }: { children: React.ReactNode }) {
  const [activeEventId, setActiveEventId] = useState<string | null>(null);

  const openInspector = useCallback((eventId: string) => {
    setActiveEventId(eventId);
  }, []);

  const closeInspector = useCallback(() => {
    setActiveEventId(null);
  }, []);

  return (
    <EventContext.Provider value={{ activeEventId, openInspector, closeInspector }}>
      {children}
    </EventContext.Provider>
  );
}

export function useEventInspector() {
  return useContext(EventContext);
}
