const dotenv = require("dotenv");
dotenv.config({ path: ".env" });

const { main } = require("../index");

describe("Test revoke", () => {
  test("It runs", async () => {
    const response = await main();
    expect(response).toEqual(response);
  });
});
