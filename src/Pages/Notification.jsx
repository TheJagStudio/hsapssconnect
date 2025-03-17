import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAtom } from "jotai";
import { userAtom,notificationAtom } from "../Variable";
import NotificationForm from "../Components/NotificationForm";

const Notification = () => {
	const [user, setUser] = useAtom(userAtom);
	const [activeCategory, setActiveCategory] = useState("superadmin");
	const [notifications, setNotifications] = useAtom(notificationAtom);
	const [formVisible, setFormVisible] = useState(false);
	const [notificationTitle, setNotificationTitle] = useState("");
	const [notificationContent, setNotificationContent] = useState("");
	const [notificationType, setNotificationType] = useState("orange");
	const [deliveryType, setDeliveryType] = useState("all");
	const [deliveryUser, setDeliveryUser] = useState([
		{ name: "Diviya Patel", id: 9 },
		{ name: "Jagrat Patel", id: 1 },
	]);
	const navigate = useNavigate();
	useEffect(() => {
		fetch(`${import.meta.env.VITE_BACKEND_URL}/api/notification/`, {
			method: "GET",
			headers: {
				Authorization: `Bearer ${JSON.parse(localStorage.getItem("hsapss_tokens"))?.access_token}`,
			},
		})
			.then((res) => res.json())
			.then((data) => {
				setNotifications(data?.notifications);
			});
	}, []);
	const classes1 = "bg-orange-50 bg-green-50 bg-blue-50 bg-red-50 bg-purple-50 bg-yellow-50 bg-pink-50";
	const classes2 = "border-orange-500 border-green-500 border-blue-500 border-red-500 border-purple-500 border-yellow-500 border-pink-500";

	return (
		<div className="relative bg-background h-screen" style={{ backgroundImage: "url(/static/images/backgroundLight.png)", backgroundRepeat: "repeat", backgroundSize: 200 }}>
			{formVisible && <NotificationForm notificationTitle={notificationTitle} notificationType={notificationType} notificationContent={notificationContent} deliveryType={deliveryType} deliveryUser={deliveryUser} setNotificationTitle={setNotificationTitle} setNotificationType={setNotificationType} setNotificationContent={setNotificationContent} setDeliveryType={setDeliveryType} setDeliveryUser={setDeliveryUser} setFormVisible={setFormVisible} setNotifications={setNotifications} />}
			<div className="p-3 fixed top-0 left-0 w-full flex items-center justify-between bg-white/80 backdrop-blur-lg z-40 rounded-b-xl custom-shadow gap-3">
				<div className="flex items-center justify-start">
					<button
						onClick={() => {
							navigate("/");
						}}
						className="p-2 rounded-full"
					>
						<svg className="w-6 h-6 text-primary-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
						</svg>
					</button>
					<p className="text-4xl text-primary-700 font-haspss w-full">Notifications</p>
				</div>
				{user?.user_type !== "user" && (
					<button
						onClick={() => {
							setFormVisible(true);
						}}
						className="p-2 rounded-lg text-primary-800 text-sm flex items-center gap-1 bg-primary-100 shadow-inner"
					>
						<svg width={24} height={24} className="text-primary-800 " viewBox="0 0 0.72 0.72" fill="none" xmlns="http://www.w3.org/2000/svg">
							<path d="M0.36 0.6v-0.24m0 0V0.12m0 0.24h0.24m-0.24 0H0.12" stroke="currentColor" strokeWidth={0.06} strokeLinecap="round" />
						</svg>
						Add Notification
					</button>
				)}
			</div>
			<div className="px-5 pt-20 flex flex-nowrap gap-x-3 overflow-x-auto my-3 w-fit">
				<button
					onClick={() => {
						setActiveCategory("superadmin");
					}}
					className={"px-3 py-1 text-center rounded-full w-full h-fit mx-auto text-nowrap whitespace-nowrap border-primary-600 border-2 transition-all " + (activeCategory == "superadmin" ? "bg-gradient-to-tr from-primary-600 to-primary-500 text-white" : " text-primary-600")}
				>
					HASPSS
				</button>
				<button
					onClick={() => {
						setActiveCategory("regionadmin");
					}}
					className={"px-3 py-1 text-center rounded-full w-full h-fit mx-auto text-nowrap whitespace-nowrap border-primary-600 border-2 transition-all " + (activeCategory == "regionadmin" ? "bg-gradient-to-tr from-primary-600 to-primary-500 text-white" : " text-primary-600")}
				>
					Mandad
				</button>
				<button
					onClick={() => {
						setActiveCategory("karyakarta");
					}}
					className={"px-3 py-1 text-center rounded-full w-full h-fit mx-auto text-nowrap whitespace-nowrap border-primary-600 border-2 transition-all " + (activeCategory == "karyakarta" ? "bg-gradient-to-tr from-primary-600 to-primary-500 text-white" : " text-primary-600")}
				>
					Karyakarta
				</button>
			</div>
			<div className="px-5 grid grid-cols-1 md:grid-cols-3 items-center justify-center w-full gap-3 pb-20">
				{notifications?.map((notification, index) => {
					if (notification?.category !== activeCategory) return null;
					return (
						<div key={index} className="p-6 rounded-xl bg-white shadow">
							<div className="flex items-center justify-between mb-3">
								<div className="flex items-center gap-2.5">
									<span className={`w-2.5 h-2.5 rounded-full outline outline-offset-2 outline-${notification?.notification_type}-500 bg-${notification?.notification_type}-500`}></span>
									<p className="text-base font-medium text-primary-600">{notification?.timestamp}</p>
								</div>
							</div>
							<h6 className="leading-8 font-semibold text-primary-700 mb-1">{notification?.title}</h6>
							<p className="text-sm font-normal text-gray-600">{notification?.content}</p>
							<p className="text-sm font-normal text-gray-600 text-right">- {notification?.sender}</p>
						</div>
					);
				})}
			</div>
		</div>
	);
};
export default Notification;
