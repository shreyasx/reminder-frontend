const publicVapidKey =
	"BHKwbXeFf6VxY3qUuCMArDUI5n-eqDkLWD9s7h1uJnNnSDt9jEL4tdh07Vw596yMYX54ky25yoTlg2gPAczTW1g";

function urlBase64ToUint8Array(base64String) {
	const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
	const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");

	const rawData = window.atob(base64);
	const outputArray = new Uint8Array(rawData.length);

	for (let i = 0; i < rawData.length; ++i) {
		outputArray[i] = rawData.charCodeAt(i);
	}
	return outputArray;
}

export async function getPushEndpont() {
	await navigator.serviceWorker.register("/sw.js", { scope: "/" });

	if ("serviceWorker" in navigator) {
		return navigator.serviceWorker.ready
			.then(function (registration) {
				if (!registration.pushManager) return "No registration push manager.";

				return registration.pushManager
					.getSubscription()
					.then(function (existedSubscription) {
						if (existedSubscription === null) {
							return registration.pushManager
								.subscribe({
									applicationServerKey: urlBase64ToUint8Array(publicVapidKey),
									userVisibleOnly: true,
								})
								.then(function (newSubscription) {
									return newSubscription;
								})
								.catch(function (e) {
									if (Notification.permission !== "granted") {
										console.error("No permission granted :(");
									} else {
										console.error(e);
									}
									return null;
								});
						} else {
							return existedSubscription;
						}
					});
			})
			.catch(function (e) {
				console.error(e);
			});
	}
}
