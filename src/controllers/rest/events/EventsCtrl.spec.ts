import {PlatformTest} from "@tsed/common";
import {BadRequest, NotFound} from "@tsed/exceptions";
import * as faker from "faker";
import {getCalendarEventCreationFixture, getCalendarEventFixture} from "../../../models/CalendarEventFixture";
import {CalendarEventsService} from "../../../services/events/CalendarEventsService";
import {EventsCtrl} from "./EventsCtrl";

async function createCalendarEvent() {
  const calendarEventsService: Partial<CalendarEventsService> = {
    update: jest.fn(),
    create: jest.fn(),
    findById: jest.fn(),
    removeOne: jest.fn(),
    findAll: jest.fn()
  };
  // GIVEN
  const service: EventsCtrl = await PlatformTest.invoke<EventsCtrl>(EventsCtrl, [
    {
      token: CalendarEventsService,
      use: calendarEventsService
    }
  ]);

  return {service, calendarEventsService: calendarEventsService as any};
}

describe("EventsCtrl", () => {
  beforeEach(() => PlatformTest.create());
  afterEach(() => PlatformTest.reset());

  describe("get()", () => {
    it("should return the Calendar event", async () => {
      // GIVEN
      const {service, calendarEventsService} = await createCalendarEvent();
      const calendarEvent = getCalendarEventFixture();

      calendarEventsService.findById.mockResolvedValue(calendarEvent);

      // WHEN
      const result = await service.get(calendarEvent.calendarId, calendarEvent._id);

      // THEN
      expect(calendarEventsService.findById).toHaveBeenCalledWith(calendarEvent._id);
      expect(result).toEqual(calendarEvent);
    });

    it("should throw an error when the calendar is not found", async () => {
      // GIVEN
      const {service} = await createCalendarEvent();

      // WHEN
      let actualError: any;
      try {
        await service.get(faker.random.uuid(), faker.random.uuid());
      } catch (er) {
        actualError = er;
      }

      // THEN
      expect(actualError).toBeInstanceOf(NotFound);
      expect(actualError.message).toEqual("CalendarEvent not found");
    });
  });
  describe("create()", () => {
    it("should create the Calendar event", async () => {
      // GIVEN
      const {service, calendarEventsService} = await createCalendarEvent();
      const calendarEvent = getCalendarEventCreationFixture();
      const calendarId = faker.random.uuid();

      calendarEventsService.create.mockResolvedValue(calendarEvent);

      // WHEN
      const result = await service.create(calendarId, calendarEvent);

      // THEN
      expect(calendarEventsService.create).toHaveBeenCalledWith({calendarId, ...calendarEvent});
      expect(result).toEqual(calendarEvent);
    });
  });
  describe("update()", () => {
    it("should update the Calendar event", async () => {
      // GIVEN
      const {service, calendarEventsService} = await createCalendarEvent();
      const calendarEvent = getCalendarEventFixture();

      calendarEventsService.update.mockResolvedValue(calendarEvent);

      // WHEN
      const result = await service.update(calendarEvent.calendarId, calendarEvent._id, calendarEvent);

      // THEN
      expect(calendarEventsService.update).toHaveBeenCalledWith(calendarEvent);
      expect(result).toEqual(calendarEvent);
    });
    it("should throw an error when calendarId is different from event.calendarId", async () => {
      // GIVEN
      const {service, calendarEventsService} = await createCalendarEvent();
      const calendarEvent = getCalendarEventFixture();

      calendarEventsService.update.mockResolvedValue(calendarEvent);

      // WHEN
      let actualError: any;
      try {
        await service.update(faker.random.uuid(), calendarEvent._id, calendarEvent);
      } catch (er) {
        actualError = er;
      }

      // THEN
      expect(actualError).toBeInstanceOf(BadRequest);
      expect(actualError.message).toEqual("calendarId doesn't match event.calendarId");
    });

    it("should throw an error when the event is not found", async () => {
      // GIVEN
      const {service, calendarEventsService} = await createCalendarEvent();
      const calendarEvent = getCalendarEventFixture();

      calendarEventsService.update.mockResolvedValue(false);

      // WHEN
      let actualError: any;
      try {
        await service.update(calendarEvent.calendarId, calendarEvent._id, calendarEvent);
      } catch (er) {
        actualError = er;
      }

      // THEN
      expect(actualError).toBeInstanceOf(NotFound);
      expect(actualError.message).toEqual("CalendarEvent not found");
    });
  });
  describe("remove()", () => {
    it("should remove the Calendar event", async () => {
      // GIVEN
      const {service, calendarEventsService} = await createCalendarEvent();
      const calendarEvent = getCalendarEventFixture();

      calendarEventsService.removeOne.mockResolvedValue(calendarEvent);

      // WHEN
      const result = await service.remove(calendarEvent.calendarId, calendarEvent._id);

      // THEN
      expect(calendarEventsService.removeOne).toHaveBeenCalledWith({
        _id: calendarEvent._id,
        calendarId: calendarEvent.calendarId
      });
      expect(result).toEqual(undefined);
    });
    it("should throw an error when the event is not found", async () => {
      // GIVEN
      const {service, calendarEventsService} = await createCalendarEvent();
      const calendarEvent = getCalendarEventFixture();

      calendarEventsService.removeOne.mockResolvedValue(false);

      // WHEN
      let actualError: any;
      try {
        await service.remove(calendarEvent.calendarId, calendarEvent._id);
      } catch (er) {
        actualError = er;
      }

      // THEN
      expect(actualError).toBeInstanceOf(NotFound);
      expect(actualError.message).toEqual("CalendarEvent not found");
    });
  });
  describe("getAll()", () => {
    it("should return the CalendarEvents", async () => {
      // GIVEN
      const {service, calendarEventsService} = await createCalendarEvent();
      const calendarEvent = getCalendarEventFixture();

      calendarEventsService.findAll.mockResolvedValue([calendarEvent]);

      // WHEN
      const result = await service.getAll(calendarEvent.calendarId);

      // THEN
      expect(calendarEventsService.findAll).toHaveBeenCalledWith({calendarId: calendarEvent.calendarId});
      expect(result).toEqual([calendarEvent]);
    });
  });
});
