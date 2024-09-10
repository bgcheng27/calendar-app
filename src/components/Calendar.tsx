import { eachDayOfInterval, startOfWeek, endOfWeek, startOfMonth, endOfMonth, format, addMonths, subMonths, isSameDay, } from "date-fns";
import { useMemo, useState } from "react";
import { CalendarDay } from "./CalendarDay";
import { useEvents } from "../context/useEvent";


export function Calendar() {
  const [selectedMonth, setSelectedMonth ] = useState(new Date());
  const { events } = useEvents()


  const calendarDays = useMemo(() => {
    return eachDayOfInterval({
      start: startOfWeek(startOfMonth(selectedMonth)),
      end: endOfWeek(endOfMonth(selectedMonth))
    });
  }, [selectedMonth])


  return (
    <>
      <div className="calendar">
        <div className="header">
          <button onClick={() => setSelectedMonth(new Date())} className="btn">Today</button>
          <div>
            <button onClick={() => setSelectedMonth(m => subMonths(m, 1))} className="month-change-btn">&lt;</button>
            <button onClick={() => setSelectedMonth(m => addMonths(m, 1))} className="month-change-btn">&gt;</button>
          </div>
          <span className="month-title">{format(selectedMonth, "MMMM yyyy")}</span>
        </div>
        <div className="days">
          {calendarDays.map((date: Date, index: number) => {
            return (
              <CalendarDay 
                key={format(date, "M/d/yy")}
                date={date} 
                index={index}
                events={events.filter(event => isSameDay(date, event.date))}
                selectedMonth={selectedMonth} />
            );
          })}
        </div>
      </div>
    </>
  );
}
