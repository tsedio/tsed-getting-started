import {BodyParams, Controller, Delete, Get, Inject, PathParams, Post, Put} from "@tsed/common";
import {BadRequest, NotFound} from "@tsed/exceptions";
import {Description, Required, Returns, Summary} from "@tsed/schema";
import {Calendar, CalendarCreation} from "../../../models/Calendar";
import {CalendarsService} from "../../../services/calendars/CalendarsService";
import {EventsCtrl} from "../events/EventsCtrl";

@Controller("/calendars", EventsCtrl)
export class CalendarsCtrl {
  @Inject()
  calendarsService: CalendarsService;

  @Get("/:id")
  @Summary("Return a calendar from his ID")
  @Returns(200, Calendar)
  async get(@Description("The calendar id") @Required() @PathParams("id") id: string): Promise<Calendar> {
    const calendar = await this.calendarsService.findById(id);

    if (!calendar) {
      throw new NotFound("Calendar not found");
    }

    return calendar;
  }

  @Post("/")
  @Summary("Create a new Calendar")
  @Returns(201, Calendar)
  create(@BodyParams() calendar: CalendarCreation): Promise<Calendar> {
    return this.calendarsService.create(calendar);
  }

  @Put("/:id")
  @Summary("Update calendar information")
  @Returns(200, Calendar)
  @(Returns(404).Description("Calendar not found"))
  async update(
    @Description("The calendar id") @PathParams("id") @Required() id: string,
    @BodyParams() @Required() calendar: Calendar
  ): Promise<Calendar> {
    if (calendar._id !== id) {
      throw new BadRequest("calendarId doesn't match calendar._id");
    }

    const updatedCalendar = await this.calendarsService.update(calendar);

    if (!updatedCalendar) {
      throw new NotFound("CalendarEvent not found");
    }

    return updatedCalendar;
  }

  @Delete("/:id")
  @Summary("Remove a calendar")
  @Returns(204)
  @(Returns(404).Description("Calendar not found"))
  async remove(@Description("The calendar id") @PathParams("id") @Required() id: string): Promise<void> {
    if (!(await this.calendarsService.removeOne({_id: id}))) {
      throw new NotFound("Calendar not found");
    }
  }

  @Get("/")
  @Summary("Return all calendars")
  @(Returns(200, Array).Of(Calendar))
  async getAll(): Promise<Calendar[]> {
    return this.calendarsService.findAll();
  }
}
