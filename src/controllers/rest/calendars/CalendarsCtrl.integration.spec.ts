import {PlatformTest} from "@tsed/common";
import * as faker from "faker";
import SuperTest from "supertest";
import {Server} from "../../../../src/Server";
import {getCalendarCreationFixture} from "../../../models/CalendarFixture";
import {CalendarsService} from "../../../services/calendars/CalendarsService";

describe("Calendars", () => {
  let request: SuperTest.SuperTest<SuperTest.Test>;
  beforeEach(PlatformTest.bootstrap(Server));
  beforeEach(() => {
    request = SuperTest(PlatformTest.callback());
  });
  afterEach(PlatformTest.reset);

  describe("GET /rest/calendars", () => {
    it("should return all calendars", async () => {
      const response = await request.get("/rest/calendars").expect(200);

      expect(response.body).toEqual([
        {_id: expect.any(String), name: "Sexton Berg"},
        {_id: expect.any(String), name: "Etta Gonzalez"},
        {_id: expect.any(String), name: "Hall Leon"},
        {_id: expect.any(String), name: "Gentry Rowe"},
        {_id: expect.any(String), name: "Janelle Adams"},
        {_id: expect.any(String), name: "Smith Norris"},
        {_id: expect.any(String), name: "Robertson Crane"}
      ]);
    });
  });

  describe("GET /rest/calendars/:id", () => {
    it("should return calendar", async () => {
      const calendarsService = PlatformTest.get<CalendarsService>(CalendarsService);
      const [calendar] = await calendarsService.findAll();

      const response = await request.get("/rest/calendars/" + calendar._id).expect(200);

      expect(response.body).toEqual({
        _id: calendar._id,
        name: calendar.name
      });
    });
  });

  describe("POST /rest/calendars", () => {
    it("should create a new calendar", async () => {
      const calendar = getCalendarCreationFixture();

      const response = await request.post("/rest/calendars").send(calendar).expect(201);

      expect(response.body).toEqual({
        _id: expect.any(String),
        name: calendar.name
      });
    });

    it("should throw a 400 name is missing", async () => {
      const response = await request.post(`/rest/calendars`).send({}).expect(400);

      expect(response.body).toEqual({
        errors: [
          {
            dataPath: "",
            keyword: "required",
            message: "should have required property 'name'",
            modelName: "CalendarCreation",
            params: {
              missingProperty: "name"
            },
            schemaPath: "#/required"
          }
        ],
        message:
          'Bad request on parameter "request.body".\nCalendarCreation should have required property \'name\'. Given value: "undefined"',
        name: "AJV_VALIDATION_ERROR",
        status: 400
      });
    });
  });

  describe("PUT /rest/calendars/:id", () => {
    it("should create a new calendar", async () => {
      const calendarsService = PlatformTest.get<CalendarsService>(CalendarsService);
      const [calendar] = await calendarsService.findAll();

      const response = await request
        .put(`/rest/calendars/${calendar._id}`)
        .send({
          ...calendar,
          name: "Hello"
        })
        .expect(200);

      expect(response.body.name).toEqual("Hello");
    });

    it("should throw a 400 when calendarId mismatch", async () => {
      const calendarsService = PlatformTest.get<CalendarsService>(CalendarsService);
      const [calendar] = await calendarsService.findAll();

      const response = await request
        .put(`/rest/calendars/${calendar._id}`)
        .send({
          _id: faker.random.uuid(),
          name: "Hello"
        })
        .expect(400);

      expect(response.body).toEqual({
        errors: [],
        message: "calendarId doesn't match calendar._id",
        name: "BAD_REQUEST",
        status: 400
      });
    });

    it("should throw a 400 name is missing", async () => {
      const calendarsService = PlatformTest.get<CalendarsService>(CalendarsService);
      const [calendar] = await calendarsService.findAll();

      const response = await request
        .put(`/rest/calendars/${calendar._id}`)
        .send({
          _id: calendar._id
        })
        .expect(400);

      expect(response.body).toEqual({
        errors: [
          {
            dataPath: "",
            keyword: "required",
            message: "should have required property 'name'",
            modelName: "Calendar",
            params: {
              missingProperty: "name"
            },
            schemaPath: "#/required"
          }
        ],
        message: 'Bad request on parameter "request.body".\nCalendar should have required property \'name\'. Given value: "undefined"',
        name: "AJV_VALIDATION_ERROR",
        status: 400
      });
    });

    it("should throw a 404", async () => {
      const response = await request.delete(`/rest/calendars/${faker.random.uuid()}`).expect(404);
      expect(response.body).toEqual({
        errors: [],
        message: "Calendar not found",
        name: "NOT_FOUND",
        status: 404
      });
    });
  });

  describe("DELETE /rest/calendars", () => {
    it("should create a new calendar", async () => {
      const calendarsService = PlatformTest.get<CalendarsService>(CalendarsService);
      const [calendar] = await calendarsService.findAll();

      await request.delete(`/rest/calendars/${calendar._id}`).expect(204);
    });

    it("should throw a 404", async () => {
      const response = await request.delete(`/rest/calendars/${faker.random.uuid()}`).expect(404);
      expect(response.body).toEqual({
        errors: [],
        message: "Calendar not found",
        name: "NOT_FOUND",
        status: 404
      });
    });
  });
});
