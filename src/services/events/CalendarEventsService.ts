import {Injectable} from "@tsed/common";
import {CalendarEvent} from "../../models/CalendarEvent";
import {MemoryCollection} from "../../utils/MemoryCollection";

@Injectable()
export class CalendarEventsService extends MemoryCollection<CalendarEvent> {
  constructor() {
    super(CalendarEvent, require("../../../resources/events.json"));
  }

  findById(id: string) {
    return this.findOne({_id: id});
  }
}
