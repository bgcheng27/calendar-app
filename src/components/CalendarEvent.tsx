import { useState } from "react";
import { EventType } from "../context/Events";
import { useEvents } from "../context/useEvent";
import { toAmPm } from "../utils/helpers";
import { EventFormModal } from "./EventFormModal";


type CalendarEventProps = { 
    event: EventType
};


export function CalendarEvent({ event }: CalendarEventProps) {
  const [isEditModalVisible, setIsEditModalVisible] = useState(false)
  const { editEvent, deleteEvent } = useEvents();
    
  return (
    <>
      <button
        onClick={() => setIsEditModalVisible(true)}
        key={event.id}
        className={`event ${event.isAllDay ? `all-day-event ${event.color}` : undefined} `}
      >
        { 
          event.isAllDay ? (
            <div className="event-name">{event.name}</div>
          ) : (
            <>
              <div className={`color-dot ${event.color}`}></div>
              <div className="event-time">{toAmPm(event.startTime)}</div>
              <div className="event-name">{event.name}</div>
            </>
          )
        }
      </button>
      <EventFormModal
        isVisible={isEditModalVisible}
        event={event}
        onClose={() => setIsEditModalVisible(false)}
        onSubmit={(e) => editEvent(event.id, e)}
        onDelete={() => deleteEvent(event.id)}
      />
    </>
  );
}
