
const request = require("supertest");
const app = require("../app");

describe("Task Management API", () => {
  test("GET /tasks without authentication returns 401", async () => {
    const response = await request(app).get("/tasks");

    expect(response.statusCode).toBe(401);
  });

  test("POST /auth/login without credentials returns 400", async () => {
    const response = await request(app)
      .post("/auth/login")
      .send({});

    expect(response.statusCode).toBe(400);
    expect(response.body.message).toBe("Email and password are required");
  });
});
