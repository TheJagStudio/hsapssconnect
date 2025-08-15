import { useEffect } from "react";
import { useAtom } from "jotai";
import { newNotificationAtom, notificationSocketAtom } from "../Variable";

const NotificationProvider = () => {
	const [, setNotification] = useAtom(newNotificationAtom);
	const [socket, setSocket] = useAtom(notificationSocketAtom);

	const subscribeToPushNotifications = async () => {
		try {
			// Register Service Worker
			const registration = await navigator.serviceWorker.register("/service-worker.js");

			// Request permission
			const permission = await Notification.requestPermission();
			if (permission !== "granted") {
				throw new Error("Permission not granted for Notification");
			}

			// Subscribe to push service
			const subscription = await registration.pushManager.subscribe({
				userVisibleOnly: true,
				applicationServerKey: import.meta.env.VITE_VAPID_PUBLIC_KEY,
			});
			// Send subscription to backend
			await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/push-subscription/`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${JSON.parse(localStorage.getItem("hsapss_tokens"))?.access_token}`,
				},
				body: JSON.stringify(subscription),
			});


		} catch (error) {
			console.error("Error setting up push notifications:", error);
		}
	};

	useEffect(() => {
		// Initialize push notifications
		if ("serviceWorker" in navigator && "PushManager" in window) {
			subscribeToPushNotifications();
			console.log("Push notifications initialized");
		}
		let ws;
		if (import.meta.env.VITE_WSS_URL.includes("localhost") || import.meta.env.VITE_WSS_URL.includes("127.0.0.1")) {
			ws = new WebSocket(`ws://${import.meta.env.VITE_WSS_URL}/ws/notification/`);
		} else {
			ws = new WebSocket(`wss://${import.meta.env.VITE_WSS_URL}/ws/notification/`);
		}

		ws.onopen = () => {
			console.log("Connected to notifications");
			setSocket(ws);
		};

		ws.onmessage = (event) => {
			const data = JSON.parse(event.data);
			setNotification(data?.message);
			if (Notification.permission !== "granted") {
				Notification.requestPermission();
			}
			new Notification(data?.message?.title, {
				body: data?.message?.content,
				icon: "/static/images/manifest-icon-512.maskable.png",
			});
		};

		ws.onclose = () => {
			console.log("Disconnected from notifications");
			setSocket(null);
		};

		return () => {
			ws.close();
		};
	}, [setNotification, setSocket]);

	return null;
};

export default NotificationProvider;
