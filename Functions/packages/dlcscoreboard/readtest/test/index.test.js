const { main } = require("../index");
const dotenv = require("dotenv");
dotenv.config({ path: "../../../.env" });

describe("Test serverless functions", () => {
  test("Fetch account", async () => {
    const response = await main({ username: "admin" });
    expect(response.body.username).toEqual("admin");
  });
});
