const dotenv = require("dotenv");
dotenv.config({ path: ".env" });

const { main } = require("../index");

describe("Test upload", () => {
  test("It runs", async () => {
    const response = await main();
    expect(response).toEqual(response);
  });
  test("Tree", async () => {
    const response = await main({
      folder: "Hoofdsponsors",
      __ow_headers: {
        authorization: `Bearer ${process.env["TEST_BEARER"]}`,
      },
    });
    expect(response.status).toEqual(200);
  });
});
