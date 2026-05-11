const request = require("supertest");
const app = require("../../app/server");

describe("GET /health", () => {
  test("should return health response", async () => {
    const response = await request(app).get("/health");

    expect(response.statusCode).toBe(200);
    expect(response.body.status).toBe("ok");
  });
});
