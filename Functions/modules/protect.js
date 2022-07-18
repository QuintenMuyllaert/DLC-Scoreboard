const { extractToken, jwtVerifyAsync } = require("./crypto");
module.exports = async (req, /*res,*/ onSuccess = () => {}) => {
  const token = extractToken(req);
  if (!token) {
    //res.status(401).send("No token");
    return { body: false };
  }

  const { valid, body } = await jwtVerifyAsync(token);
  if (!valid) {
    //res.clearCookie("bearer");
    //res.clearCookie("auth");
    //res.status(401).send("Invalid token");
    return { body: false };
  }

  return await onSuccess(body);
};
