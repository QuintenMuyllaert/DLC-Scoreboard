const dotenv = require("dotenv");
dotenv.config({ path: ".env" });

const { main } = require("../index");

describe("Test status", () => {
  test("Status - Reject", async () => {
    const response = await main();
    expect(response.body).toEqual(false);
  });
});
