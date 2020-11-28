import {Description, Required} from "@tsed/schema";

export class CalendarCreation {
  @Description("Calendar name")
  @Required()
  name: string;
}

export class Calendar extends CalendarCreation {
  @Description("Database assigned id")
  _id: string;
}
