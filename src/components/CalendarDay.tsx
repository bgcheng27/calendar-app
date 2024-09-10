import { format, isBefore, isToday, startOfToday } from "date-fns";
import { useState, useMemo } from "react";
import { EventFormModal } from "./EventFormModal";
import { EventListModal } from "./EventListModal";
import { OverflowContainer } from "./OverflowContainer";
import { CalendarEvent } from "./CalendarEvent";
import { EventType } from "../context/Events";
import { useEvents } from "../context/useEvent";
import { isEarlier } from "../utils/helpers";


type CalendarDayProps = {
  date: Date;
  index: number;
  events: EventType[];
  selectedMonth: Date;
};

export function CalendarDay({ date, index, events, selectedMonth }: CalendarDayProps) {
  const [isAddEventVisible, setIsAddEventVisible] = useState(false);
  const [isEventListVisible, setIsEventListVisible] = useState(false);
  const { addEvent } = useEvents();

  const sortedEvents = useMemo(() => {
    return [...events].sort((a, b) => {
      if (a.isAllDay && !b.isAllDay) {
        return -1;
      } else if (!a.isAllDay && b.isAllDay) {
        return 1;
      } else if (!a.isAllDay && !b.isAllDay) {
        if (isEarlier(a.startTime, b.startTime)) {
          return -1;
        } else {
          return 1;
        }
      }
      return 0;
    })
  }, [events]);

  return (
    <>
      <div
        className={`day ${
          date.getMonth() !== selectedMonth.getMonth() ? "non-month-day" : ""
        } ${isBefore(date, startOfToday()) ? "old-month-day" : ""}`}
      >
        <div className="day-header">
          {index < 7 && <div className="week-name">{format(date, "EEE")}</div>}
          <div className={`${isToday(date) ? "today" : ""} day-number `}>
            {format(date, "d")}
          </div>
          <button
            onClick={() => setIsAddEventVisible(true)}
            className="add-event-btn"
          >
            +
          </button>
        </div>

        <OverflowContainer
          className="events"
          items={sortedEvents}
          getKey={(event) => event.id}
          renderItem={(event) => <CalendarEvent event={event} /> } 
          renderOverflow={(amount) => {
            return (
              <>
                <button onClick={() => {setIsEventListVisible(true)}} className="events-view-more-btn">+{amount} More</button>
                <EventListModal
                  isVisible={isEventListVisible}
                  selectedDate={date}
                  handleAddEventOpen={() => setIsEventListVisible(true)}
                  onClose={() => setIsEventListVisible(false)}
                  eventList={sortedEvents}
                />
              </>
            )
          }}
        />
      </div>


      <EventFormModal
        isVisible={isAddEventVisible}
        onClose={() => setIsAddEventVisible(false)}
        selectedDate={date}
        onSubmit={addEvent}
      />
    </>
  );
}
