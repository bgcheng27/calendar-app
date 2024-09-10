import { format } from "date-fns";
import { Fragment, useId, useState } from "react";
import { createPortal } from "react-dom";
import { EventType } from "../context/Events";
import { UnionOmit } from "../utils/UnionOmit";
import { Modal, ModalProps } from "./Modal";

import { EVENT_COLORS } from "../context/useEvent";



type EventFormModalProps = {
  onSubmit: (event: UnionOmit<EventType, "id">) => void;
} & (
  | { onDelete: () => void; event: EventType; selectedDate?: never }
  | { onDelete?: never; event?: never; selectedDate: Date }
) &
  Omit<ModalProps, "children">;


export function EventFormModal({
  selectedDate,
  event,
  onSubmit,
  onDelete,
  ...modalProps
}: EventFormModalProps) {
  const [name, setName] = useState(event ? event.name : "");
  const [isAllDay, setIsAllDay] = useState(event ? event.isAllDay : false);
  const [startTime, setStartTime] = useState(
    event && !event.isAllDay ? event.startTime : ""
  );
  const [endTime, setEndTime] = useState(
    event && !event.isAllDay ? event.startTime : ""
  );
  const [colorRadio, setColorRadio] = useState<string>(
    event ? event.color : "blue"
  );

  const id = useId();

  function hanldeSubmit(e: React.FormEvent<HTMLFormElement>): void {
    e.preventDefault();

    if (name == "" || name == null) return;

    const commonProps = {
      name: name,
      color: colorRadio,
      date: (selectedDate as Date) || event?.date,
    };
    let newEvent: UnionOmit<EventType, "id">;

    if (isAllDay) {
      newEvent = {
        ...commonProps,
        isAllDay: true,
      };
    } else {
      if (
        startTime == null ||
        startTime === "" ||
        endTime == null ||
        endTime === ""
      )
        return;

      newEvent = {
        ...commonProps,
        isAllDay: false,
        startTime,
        endTime,
      };
    }
    modalProps.onClose();
    onSubmit(newEvent);
  }

  return createPortal(
    <Modal {...modalProps}>
      <div className="modal-title">
        <div>{event ? "Edit" : "Add"} Event</div>
        <small>{format(selectedDate || event.date, "M/d/yy")}</small>
        <button onClick={modalProps.onClose} className="close-btn">
          &times;
        </button>
      </div>

      <form onSubmit={hanldeSubmit}>
        <div className="form-group">
          <label htmlFor={`${id}-name`}>Name</label>
          <input
            type="text"
            name="name"
            id={`${id}-name`}
            value={name}
            onChange={(e) => setName(e.currentTarget.value)}
          />
        </div>

        <div className="form-group checkbox">
          <input
            type="checkbox"
            name="all-day"
            id={`${id}-all-day`}
            checked={isAllDay}
            onChange={() => setIsAllDay((prev) => !prev)}
          />
          <label htmlFor={`${id}-all-day`}>All Day?</label>
        </div>

        <div className="row">
          <div className="form-group">
            <label htmlFor={`${id}-start-time`}>Start Time</label>
            <input
              type="time"
              name="start-time"
              id={`${id}-start-time`}
              value={startTime}
              onChange={(e) => setStartTime(e.currentTarget.value)}
              disabled={isAllDay}
              required={!isAllDay}
            />
          </div>
          <div className="form-group">
            <label htmlFor={`${id}-end-time`}>End Time</label>
            <input
              type="time"
              name="end-time"
              id={`${id}-end-time`}
              value={endTime}
              onChange={(e) => setEndTime(e.currentTarget.value)}
              disabled={isAllDay}
              required={!isAllDay}
            />
          </div>
        </div>

        <div className="form-group">
          <label>Color</label>
          <div className="row left">
            {Object.keys(EVENT_COLORS).map((color) => {
              return (
                <Fragment key={color}>
                  <input
                    type="radio"
                    name="color"
                    value={color}
                    id={`${id}-${color}`}
                    checked={colorRadio === color}
                    onChange={() => setColorRadio(color)}
                    className="color-radio"
                  />
                  <label htmlFor={`${id}-${color}`}>
                    <span className="sr-only">Blue</span>
                  </label>
                </Fragment>
              )
            })}
          </div>
        </div>

        {/* SUBMIT BUTTONS */}
        <div className="row">
          <button className="btn btn-success" type="submit">
            {event ? "Edit" : "Add"}
          </button>
          {event && (
            <button onClick={onDelete} className="btn btn-delete" type="button">
              Delete
            </button>
          )}
        </div>
      </form>
    </Modal>,
    document.querySelector("#modal-container") as HTMLElement
  );
}
