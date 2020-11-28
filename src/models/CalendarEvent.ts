import {CollectionOf, Format, Property} from "@tsed/schema";
import {Task} from "./Task";

export class CalendarEventCreation {
  @Format("date-time")
  startDate: Date;

  @Format("date-time")
  endDate: Date;

  @Property()
  name: string;
}

export class CalendarEvent extends CalendarEventCreation {
  @Property()
  _id: string;

  @Property()
  calendarId: string;

  @CollectionOf(Task)
  tasks: Task[] = [];
}
