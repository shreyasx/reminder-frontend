self.addEventListener("push", e => {
	const data = e.data.json();
	console.log("Got push", data);
	self.registration.showNotification(data.title, {
		body: data.message,
		icon: "favicon.ico",
	});
});

self.addEventListener("message", event => {
	if (event.data && event.data.type === "SKIP_WAITING") {
		self.skipWaiting();
	}
});
