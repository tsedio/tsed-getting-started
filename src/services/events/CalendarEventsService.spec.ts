import {PlatformTest} from "@tsed/common";
import {CalendarEventsService} from "./CalendarEventsService";

describe("CalendarEventsService", () => {
  beforeEach(() => PlatformTest.create());
  afterEach(() => PlatformTest.reset());

  it("should return event by ID", async () => {
    const service = PlatformTest.get<CalendarEventsService>(CalendarEventsService);
    const item = await service.findOne({})!;

    expect(service.findById(item._id)).toEqual(item);
  });
});
