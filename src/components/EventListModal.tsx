import { format } from "date-fns";
import { createPortal } from "react-dom"; 
import { EventType } from "../context/Events";
import { Modal, ModalProps } from "./Modal";
import { CalendarEvent } from "./CalendarEvent";


type EventListModalProps = {
  selectedDate: Date,
  handleAddEventOpen: (event: EventType) => void;
  eventList: EventType[]
} & Omit<ModalProps, "children">

export function EventListModal({ selectedDate, handleAddEventOpen, eventList, ...modalProps }: EventListModalProps) {
  if (eventList.length === 0) return null

  return createPortal(
    <Modal {...modalProps}>
        <div className="modal-title">
          {format(selectedDate, "M/d/yy")}
          <button onClick={modalProps.onClose} className="close-btn">&times;</button>
        </div>
        
        <div className="events">
          {eventList.map((event) => {
            return <CalendarEvent key={event.id} event={event} />
          })}
        </div>
     </Modal>, document.querySelector("#modal-container") as HTMLElement);
}
