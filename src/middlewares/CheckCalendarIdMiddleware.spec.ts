import {PlatformTest} from "@tsed/common";
import {NotFound} from "@tsed/exceptions";
import * as faker from "faker";
import {getCalendarFixture} from "../models/CalendarFixture";
import {CalendarsService} from "../services/calendars/CalendarsService";
import {CheckCalendarIdMiddleware} from "./CheckCalendarIdMiddleware";

describe("CheckCalendarIdMiddleware", () => {
  beforeEach(() => PlatformTest.create());
  afterEach(() => PlatformTest.reset());

  describe("when calendar isn't found", () => {
    it("should do nothing when calendar is found", async () => {
      // GIVEN
      const calendar = getCalendarFixture();
      const calendarsService: Partial<CalendarsService> = {
        findById: jest.fn().mockResolvedValue(calendar)
      };

      const middleware: CheckCalendarIdMiddleware = await PlatformTest.invoke(CheckCalendarIdMiddleware, [
        {
          token: CalendarsService,
          use: calendarsService
        }
      ]);

      // WHEN
      const result = await middleware.use(calendar._id);

      // THEN
      expect(calendarsService.findById).toHaveBeenCalledWith(calendar._id);
      expect(result).toEqual(undefined);
    });
    it("should throw an error", async () => {
      // GIVEN
      const calendarsService: Partial<CalendarsService> = {
        findById: jest.fn()
      };

      const middleware: CheckCalendarIdMiddleware = await PlatformTest.invoke(CheckCalendarIdMiddleware, [
        {
          token: CalendarsService,
          use: calendarsService
        }
      ]);

      // WHEN
      let actualError;
      try {
        await middleware.use(faker.random.uuid());
      } catch (er) {
        actualError = er;
      }
      // THEN
      expect(actualError).toBeInstanceOf(NotFound);
      expect(actualError.message).toEqual("Calendar not found");
    });
  });
});
