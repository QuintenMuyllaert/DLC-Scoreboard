const cacheName = "sw-cache";
console.log("install");

caches.open(cacheName).then(async function (cache) {
	cache.delete("/");
});

//cache EVERYTHING with .EXT
const static = ["woff", "woff2", "ttf", "webp", "jpg", "png", "jpeg", "svg", "ico"];
const reply = async function (event) {
	//caching logic
	const cache = await caches.open(cacheName);

	const isCachable = static.includes(event.request.url.split(".").pop());

	let response = await cache.match(event.request.url);

	if (!response) {
		//console.log("cache miss", event.request.url);

		response = await fetch(event.request);
		if (response && isCachable) {
			//console.log("cache put", event.request.url);
			const cacheable = response.clone();
			setTimeout(() => {
				cache.put(event.request.url, cacheable);
			});
		}
	} else {
		//console.log("cache hit", event.request.url);
	}

	return response;
};

self.addEventListener("fetch", async function (event) {
	event.respondWith(reply(event));
});
