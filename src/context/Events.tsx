import { ReactNode, createContext, useEffect, useState } from "react";
import { UnionOmit } from "../utils/UnionOmit";

export type EventType = {
  id: string
  name: string
  color: string
  date: Date
} & (
  | { isAllDay: false; startTime: string, endTime: string }
  | { isAllDay: true; startTime?: never, endTime?: never }
);

type EventsContext = {
  events: EventType[]
  addEvent: (eventDetails: UnionOmit<EventType, "id">) => void
  editEvent: (id: string, eventDetails: UnionOmit<EventType, "id">) => void
  deleteEvent: (id: string) => void

}

type EventsProviderProps = {
  children: ReactNode
}


export const Context = createContext<EventsContext | null>(null)

export function EventsProvider({ children }: EventsProviderProps) {
  const [events, setEvents] = useLocalStorage("EVENTS", [])

  function addEvent(eventDetails: UnionOmit<EventType, "id">) {
    setEvents(e => {
      return [...e, { id: crypto.randomUUID(), ...eventDetails}];
    });
  }

  function editEvent(id: string, eventDetails: UnionOmit<EventType, "id">) {
    setEvents(e => {
      return e.map((event) => {
        return (id === event.id) ? { id, ...eventDetails } : event;
      });
    });
  }

  function deleteEvent(id: string) {
    setEvents(e => {
      return e.filter((event) => id !== event.id);
    });
  }

  return (
    <Context.Provider value={{ events, addEvent, editEvent, deleteEvent }}>
      {children}
    </Context.Provider>
  )
}

export function useLocalStorage(key: string, initialValue: EventType[]) {
  const [value, setValue] = useState<EventType[]>(() => {
    const eventData = localStorage.getItem(key)

    if (eventData == null) return initialValue

    return (JSON.parse(eventData) as EventType[]).map(event => {
      if (event.date instanceof Date) return event
      return { ...event, date: new Date(event.date) }
    })
  })

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value))
  }, [value])

  return [value, setValue] as const
}
