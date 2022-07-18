export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const { url } = request;

    const pathQuerry = "/" + url.replace(/.+?:\/\/.+?\//, "");
    let path = pathQuerry.replace(/\?.+/, "");
    const query = pathQuerry.replace(path, "");

    const endpoint = "https://dlcscoreboard.fra1.cdn.digitaloceanspaces.com";

    console.log(`${endpoint} | ${path} | ${query}`);

    if (path.endsWith("/") || !path.includes(".")) {
      path = "/index.html";
    }

    const uri = `${endpoint}${path}`;

    const modifiedRequest = new Request(uri, {
      body: request.body,
      headers: request.headers,
      method: request.method,
    });

    return fetch(modifiedRequest);
  },
};
