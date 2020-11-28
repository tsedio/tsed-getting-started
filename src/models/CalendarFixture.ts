import {deserialize} from "@tsed/json-mapper";
import * as faker from "faker";
import {Calendar} from "./Calendar";

export function getCalendarFixture(options: Partial<Calendar> = {}): Calendar {
  return deserialize<Calendar>({
    _id: faker.random.uuid(),
    name: faker.name.title(),
    ...options
  });
}

export function getCalendarCreationFixture(options: Partial<Calendar> = {}): Calendar {
  return deserialize<Calendar>({
    name: faker.name.title(),
    ...options
  });
}
