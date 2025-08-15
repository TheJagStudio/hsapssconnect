import React, { useEffect, useState } from "react";
import { useAtom } from "jotai";
import { newNotificationAtom, notificationSocketAtom,userAtom } from "../Variable";

const NotificationForm = ({ notificationTitle, notificationType, notificationContent, deliveryType, deliveryUser, setNotificationTitle, setNotificationType, setNotificationContent, setDeliveryType, setDeliveryUser, setFormVisible }) => {
	const [notifications, setNotifications] = useAtom(newNotificationAtom);
    const [user] = useAtom(userAtom);
	const [socket, setSocket] = useAtom(notificationSocketAtom);

	const handleSubmit = async (e) => {
		e.preventDefault();
		socket.send(
			JSON.stringify({
                data:{
					title: notificationTitle,
					content: notificationContent,
					type: notificationType,
					delivery: deliveryType,
					users: deliveryUser,
                    sender: user?.first_name + " " + user?.last_name,
				},
			})
		);
		// setNotifications([...notifications, data.notification]);
		setNotificationTitle("");
		setNotificationContent("");
		setNotificationType("success");
		setFormVisible(false);
	};
	return (
		<div className="fixed top-0 left-0 w-screen h-screen z-50  bg-black/75 ">
			<div className="fixed top-1/2 left-1/2 w-fit min-w-96 transform -translate-x-1/2 -translate-y-1/2 bg-background p-8 rounded-lg shadow-lg " style={{ backgroundImage: "url(/static/images/backgroundLight.png)", backgroundRepeat: "repeat", backgroundSize: 200 }}>
				<div className="mb-3">
					<label htmlFor="title" className="block text-gray-700 font-bold mb-1">
						Title
					</label>
					<input type="text" id="title" className="shadow-inner border  rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none" value={notificationTitle} onChange={(e) => setNotificationTitle(e.target.value)} />
				</div>
				<div className="mb-3">
					<label htmlFor="content" className="block text-gray-700 font-bold mb-1">
						Content
					</label>
					<textarea id="content" rows={5} className="shadow-inner border  rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none" value={notificationContent} onChange={(e) => setNotificationContent(e.target.value)}></textarea>
				</div>
				<div className="mb-3">
					<label htmlFor="type" className="block text-gray-700 font-bold mb-1">
						Notification Type
					</label>
					<div className="shadow-inner border bg-white flex items-center justify-center gap-3 rounded-lg w-full px-3 text-gray-700 leading-tight ">
						<div className={`w-3 h-2.5 rounded-full outline outline-offset-2 outline-${notificationType}-500 bg-${notificationType}-500`}></div>
						<select className="w-full h-full py-2 bg-transparent focus:outline-none" id="type" value={notificationType} onChange={(e) => setNotificationType(e.target.value)}>
							<option value="orange">Shabha</option>
							<option value="green">Activity</option>
							<option value="blue">Birthday</option>
							<option value="red">Important</option>
							<option value="purple">Gathering</option>
							<option value="yellow">Festival</option>
							<option value="pink">Special</option>
						</select>
					</div>
				</div>
				<div>
					<label htmlFor="delivery" className="block text-gray-700 font-bold mb-1">
						Delivery Type
					</label>
					<div className="flex items-center justify-center rounded-lg w-full h-10 mb-2 overflow-hidden text-gray-700 leading-tight ">
						<button
							type={"button"}
							onClick={() => {
								setDeliveryType("all");
							}}
							className={"w-full h-full text-xs " + (deliveryType === "all" ? "bg-primary-600 text-white" : "bg-white text-primary-700")}
						>
							All
						</button>
						<button
							type={"button"}
							onClick={() => {
								setDeliveryType("region");
							}}
							className={"w-full h-full text-xs border-l " + (deliveryType === "region" ? "bg-primary-600 text-white" : "bg-white text-primary-700")}
						>
							Mandal
						</button>
						<button
							type={"button"}
							onClick={() => {
								setDeliveryType("usertype");
							}}
							className={"w-full h-full text-xs border-l " + (deliveryType === "usertype" ? "bg-primary-600 text-white" : "bg-white text-primary-700")}
						>
							User Type
						</button>
						<button
							type={"button"}
							onClick={() => {
								setDeliveryType("individualuser");
							}}
							className={"w-full h-full text-xs border-l " + (deliveryType === "individualuser" ? "bg-primary-600 text-white" : "bg-white text-primary-700")}
						>
							Individual User
						</button>
					</div>
					<div className="w-full h-fit max-h-48 custom-scrollbar overflow-y-auto  bg-white rounded-lg  mb-3 py-2 px-3 shadow-inner border overflow-hidden flex gap-2 flex-wrap">
						{deliveryUser?.map((item, index) => {
							return (
								<div key={index} className="bg-primary-100 flex items-center justify-center text-primary-800 h-full w-fit px-2 rounded-xl">
									<p className="max-w-20 truncate">{item?.name}</p>

									<button
										onClick={() => {
											setDeliveryUser(deliveryUser.filter((_, i) => i !== index));
										}}
									>
										<svg width={24} height={24} className="text-primary-800" viewBox="-0.18 -0.18 0.72 0.72" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMinYMin">
											<path fill="currentColor" d="m0.219 0.177 0.106 -0.106A0.03 0.03 0 1 0 0.283 0.028L0.177 0.135 0.071 0.028A0.03 0.03 0 1 0 0.028 0.071l0.106 0.106L0.028 0.283a0.03 0.03 0 1 0 0.042 0.042l0.106 -0.106 0.106 0.106a0.03 0.03 0 1 0 0.042 -0.042L0.219 0.177z" />
										</svg>
									</button>
								</div>
							);
						})}
						<input
							onKeyUp={(event) => {
								event.preventDefault();
								// check for enter
								if (event.key === "Enter" || event.keyCode === 13) {
									setDeliveryUser([...deliveryUser, { name: event.target.value, id: Math.random() }]);
									event.target.value = "";
								}
							}}
							type="text"
							className="w-32 h-full text-gray-700 leading-tight focus:outline-none"
							placeholder="User Name"
						/>
					</div>
				</div>
				<button
					onClick={() => {
						setFormVisible(false);
					}}
					className="bg-white hover:bg-gray-100 border text-primary-800 py-2 px-4 rounded-lg focus:outline-none"
				>
					Discard
				</button>
				<button onClick={handleSubmit} className="ml-5 bg-primary-500 hover:bg-primary-600 text-white font-bold py-2 px-4 rounded-lg focus:outline-none">
					Submit
				</button>
			</div>
		</div>
	);
};

export default NotificationForm;
