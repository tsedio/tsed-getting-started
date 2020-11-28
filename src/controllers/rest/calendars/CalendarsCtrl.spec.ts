import {PlatformTest} from "@tsed/common";
import {BadRequest, NotFound} from "@tsed/exceptions";
import * as faker from "faker";
import {getCalendarCreationFixture, getCalendarFixture} from "../../../models/CalendarFixture";
import {CalendarsService} from "../../../services/calendars/CalendarsService";
import {CalendarsCtrl} from "./CalendarsCtrl";

async function createCalendarEvent() {
  const calendarsService: Partial<CalendarsService> = {
    update: jest.fn(),
    create: jest.fn(),
    findById: jest.fn(),
    removeOne: jest.fn(),
    findAll: jest.fn()
  };
  // GIVEN
  const service: CalendarsCtrl = await PlatformTest.invoke<CalendarsCtrl>(CalendarsCtrl, [
    {
      token: CalendarsService,
      use: calendarsService
    }
  ]);

  return {service, calendarsService: calendarsService as any};
}

describe("CalendarsCtrl", () => {
  beforeEach(() => PlatformTest.create());
  afterEach(() => PlatformTest.reset());

  describe("get()", () => {
    it("should return the Calendar event", async () => {
      // GIVEN
      const {service, calendarsService} = await createCalendarEvent();
      const calendar = getCalendarFixture();

      calendarsService.findById.mockResolvedValue(calendar);

      // WHEN
      const result = await service.get(calendar._id);

      // THEN
      expect(calendarsService.findById).toHaveBeenCalledWith(calendar._id);
      expect(result).toEqual(calendar);
    });

    it("should throw an error when the calendar is not found", async () => {
      // GIVEN
      const {service} = await createCalendarEvent();

      // WHEN
      let actualError: any;
      try {
        await service.get(faker.random.uuid());
      } catch (er) {
        actualError = er;
      }

      // THEN
      expect(actualError).toBeInstanceOf(NotFound);
      expect(actualError.message).toEqual("Calendar not found");
    });
  });
  describe("create()", () => {
    it("should create the calendar event", async () => {
      // GIVEN
      const {service, calendarsService} = await createCalendarEvent();
      const calendar = getCalendarCreationFixture();
      const calendarId = faker.random.uuid();
      const expectedCalendar = getCalendarFixture({
        ...calendar,
        _id: calendarId
      });

      calendarsService.create.mockResolvedValue(expectedCalendar);

      // WHEN
      const result = await service.create(calendar);

      // THEN
      expect(calendarsService.create).toHaveBeenCalledWith(calendar);
      expect(result).toEqual(expectedCalendar);
    });
  });
  describe("update()", () => {
    it("should update the calendar", async () => {
      // GIVEN
      const {service, calendarsService} = await createCalendarEvent();
      const calendar = getCalendarFixture();

      calendarsService.update.mockResolvedValue(calendar);

      // WHEN
      const result = await service.update(calendar._id, calendar);

      // THEN
      expect(calendarsService.update).toHaveBeenCalledWith(calendar);
      expect(result).toEqual(calendar);
    });
    it("should throw an error when calendarId is different from calendar._id", async () => {
      // GIVEN
      const {service, calendarsService} = await createCalendarEvent();
      const calendar = getCalendarFixture();

      calendarsService.update.mockResolvedValue(calendar);

      // WHEN
      let actualError: any;
      try {
        await service.update(faker.random.uuid(), calendar);
      } catch (er) {
        actualError = er;
      }

      // THEN
      expect(actualError).toBeInstanceOf(BadRequest);
      expect(actualError.message).toEqual("calendarId doesn't match calendar._id");
    });

    it("should throw an error when the calendar is not found", async () => {
      // GIVEN
      const {service, calendarsService} = await createCalendarEvent();
      const calendar = getCalendarFixture();

      calendarsService.update.mockResolvedValue(false);

      // WHEN
      let actualError: any;
      try {
        await service.update(calendar._id, calendar);
      } catch (er) {
        actualError = er;
      }

      // THEN
      expect(actualError).toBeInstanceOf(NotFound);
      expect(actualError.message).toEqual("CalendarEvent not found");
    });
  });
  describe("remove()", () => {
    it("should remove the calendar", async () => {
      // GIVEN
      const {service, calendarsService} = await createCalendarEvent();
      const calendar = getCalendarFixture();

      calendarsService.removeOne.mockResolvedValue(calendar);

      // WHEN
      const result = await service.remove(calendar._id);

      // THEN
      expect(calendarsService.removeOne).toHaveBeenCalledWith({
        _id: calendar._id
      });
      expect(result).toEqual(undefined);
    });
    it("should throw an error when the calendar is not found", async () => {
      // GIVEN
      const {service, calendarsService} = await createCalendarEvent();
      const calendar = getCalendarFixture();

      calendarsService.removeOne.mockResolvedValue(false);

      // WHEN
      let actualError: any;
      try {
        await service.remove(calendar._id);
      } catch (er) {
        actualError = er;
      }

      // THEN
      expect(actualError).toBeInstanceOf(NotFound);
      expect(actualError.message).toEqual("Calendar not found");
    });
  });
  describe("getAll()", () => {
    it("should return the Calendars", async () => {
      // GIVEN
      const {service, calendarsService} = await createCalendarEvent();
      const calendar = getCalendarFixture();

      calendarsService.findAll.mockResolvedValue([calendar]);

      // WHEN
      const result = await service.getAll();

      // THEN
      expect(calendarsService.findAll).toHaveBeenCalledWith();
      expect(result).toEqual([calendar]);
    });
  });
});
