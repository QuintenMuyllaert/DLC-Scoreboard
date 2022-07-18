const dotenv = require("dotenv");
dotenv.config({ path: ".env" });

const { main } = require("../index");

/*describe("Test revoke", () => {
  test("Revoke", async () => {
    const response = await main();
    expect(response.body).toEqual(false);
  });
});*/
