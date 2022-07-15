const dotenv = require("dotenv");
dotenv.config({ path: ".env" });

const { main } = require("../index");

describe("Test serverless functions", () => {
  test("Fetch account", async () => {
    const response = await main({ username: "admin" });
    expect(response.body.username).toEqual("admin");
  });
});
