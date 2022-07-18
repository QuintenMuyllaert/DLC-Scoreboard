const dotenv = require("dotenv");
dotenv.config({ path: ".env" });

const { main } = require("../index");

describe("Test authenication", () => {
  test("Login - Correct", async () => {
    const response = await main({ username: "admin", password: "password" });
    expect(response.body.status).toEqual(202);
  });
  test("Login - Wrong username", async () => {
    const response = await main({ username: "h@xx0r", password: "password" });
    expect(response.body.status).toEqual(401);
  });
  test("Login - Wrong password", async () => {
    const response = await main({ username: "admin", password: "letmein" });
    expect(response.body.status).toEqual(401);
  });
  test("Login - Empty username", async () => {
    const response = await main({ username: "", password: "password" });
    expect(response.body.status).toEqual(400);
  });
  test("Login - Empty password", async () => {
    const response = await main({ username: "admin", password: "" });
    expect(response.body.status).toEqual(400);
  });
  test("Login - No body", async () => {
    const response = await main();
    expect(response.body.status).toEqual(400);
  });
});
