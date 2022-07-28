module.exports = (args = {}) => {
  const headers = args?.["__ow_headers"] || {};
  const method = args?.["__ow_method"] || "get";
  const path = args?.["__ow_path"] || "";
  const body = {};

  //put every arg that does not start with "__" in body
  const keys = Object.keys(args);
  for (const key of keys) {
    if (key.indexOf("__") !== 0) {
      body[key] = args[key];
    }
  }

  const cookies = headers["cookie"] || "";

  const req = {
    headers: headers,
    cookies: cookies.split(";").reduce((acc, cur) => {
      const [key, value] = cur.split("=");
      acc[key] = value;
      return acc;
    }),
    method: method,
    path: path,
    body: body,
  };

  return req;
};
