import {deserialize} from "@tsed/json-mapper";
import * as faker from "faker";
import {Task} from "./Task";

export function getTaskFixture(options: Partial<Task> = {}): Task {
  return deserialize<Task>({
    ...options,
    name: faker.name.title(),
    percent: faker.random.number(100)
  });
}
