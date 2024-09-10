import { format } from "date-fns";


export function toAmPm(militaryTime: string): string {
  var [hours, minutes] = militaryTime.split(":").map(Number);

  var dateObj = new Date();
  dateObj.setHours(hours);
  dateObj.setMinutes(minutes);

  var formattedTime = format(dateObj, "h:mm a");

  return formattedTime;
}


export function isEarlier(time1: string, time2: string) {
  const [hour1, minute1] = time1.split(":").map(Number);
  const [hour2, minute2] = time2.split(":").map(Number);

  if (hour1 < hour2) {
    return true;
  } else if (hour1 === hour2) {
    return minute1 < minute2;
  } else {
    return false;
  }
}
