import {BodyParams, Controller, Delete, Get, Inject, PathParams, Post, Put, UseBefore} from "@tsed/common";
import {BadRequest, NotFound} from "@tsed/exceptions";
import {Description, Required, Returns, Status, Summary} from "@tsed/schema";
import {CheckCalendarIdMiddleware} from "../../../middlewares/CheckCalendarIdMiddleware";
import {CalendarEvent, CalendarEventCreation} from "../../../models/CalendarEvent";
import {CalendarEventsService} from "../../../services/events/CalendarEventsService";

@Controller("/:calendarId/events")
@UseBefore(CheckCalendarIdMiddleware)
export class EventsCtrl {
  @Inject()
  private calendarEventsService: CalendarEventsService;

  @Get("/:id")
  @Summary("Get an event from his ID")
  @Returns(200, CalendarEvent)
  @(Returns(404).Description("CalendarEvent not found"))
  async get(
    @Description("The calendar id of the event") @Required() @PathParams("calendarId") calendarId: string,
    @Description("The event id") @PathParams("id") id: string
  ): Promise<CalendarEvent> {
    const event = await this.calendarEventsService.findById(id);

    if (!event) {
      throw new NotFound("CalendarEvent not found");
    }

    return event;
  }

  @Post("/")
  @Summary("Create an event")
  @Returns(201, CalendarEvent)
  async create(
    @Description("The calendar id of the event") @Required() @PathParams("calendarId") calendarId: string,
    @BodyParams() event: CalendarEventCreation
  ): Promise<CalendarEvent> {
    return this.calendarEventsService.create({calendarId, ...event});
  }

  @Put("/:id")
  @Summary("Update event information")
  @(Status(200, CalendarEvent).Description("Success"))
  @(Status(404).Description("CalendarEvent not found"))
  async update(
    @Description("The calendar id of the event") @Required() @PathParams("calendarId") calendarId: string,
    @Description("The event id") @PathParams("id") id: string,
    @BodyParams() event: CalendarEvent
  ): Promise<CalendarEvent> {
    if (event.calendarId !== calendarId) {
      throw new BadRequest("calendarId doesn't match event.calendarId");
    }

    const updatedEvent = await this.calendarEventsService.update(event);

    if (!updatedEvent) {
      throw new NotFound("CalendarEvent not found");
    }

    return updatedEvent;
  }

  @Delete("/:id")
  @Status(204)
  @Summary("Remove an event")
  @(Status(404).Description("CalendarEvent not found"))
  async remove(
    @Description("The calendar id of the event")
    @Required()
    @PathParams("calendarId")
    calendarId: string,
    @Description("The event id")
    @PathParams("id")
    id: string
  ): Promise<void> {
    if (!(await this.calendarEventsService.removeOne({_id: id, calendarId}))) {
      throw new NotFound("CalendarEvent not found");
    }
  }

  @Get("/")
  @Summary("Get all events for a calendar")
  @(Status(200).Description("Success"))
  async getAll(
    @Description("The calendar id of the event") @Required() @PathParams("calendarId") calendarId: string
  ): Promise<CalendarEvent[]> {
    return this.calendarEventsService.findAll({calendarId});
  }
}
