import {deserialize} from "@tsed/json-mapper";
import * as faker from "faker";
import {CalendarEvent, CalendarEventCreation} from "./CalendarEvent";
import {getTaskFixture} from "./TaskFixture";

export function getCalendarEventFixture(options: Partial<CalendarEvent> = {}): CalendarEvent {
  return deserialize<CalendarEvent>({
    _id: faker.random.uuid(),
    calendarId: faker.random.uuid(),
    startDate: faker.date.soon(),
    endDate: faker.date.soon(),
    name: faker.name.title(),
    tasks: [getTaskFixture()],
    ...options
  });
}

export function getCalendarEventCreationFixture(options: Partial<CalendarEventCreation> = {}): CalendarEventCreation {
  return deserialize<CalendarEventCreation>({
    startDate: faker.date.soon(),
    endDate: faker.date.soon(),
    name: faker.name.title(),
    tasks: [getTaskFixture()],
    ...options
  });
}
