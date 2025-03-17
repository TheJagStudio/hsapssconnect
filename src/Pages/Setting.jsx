import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import DeleteAccountPopup from "../Components/DeleteAccountPopup";

const Setting = () => {
	const navigate = useNavigate();
	const [showDeletePopup, setShowDeletePopup] = useState(false);
	const [ekadashiNotification, setEkadashiNotification] = useState(false);
	return (
		<div className="relative p-5 w-full min-h-screen bg-background flex flex-col " style={{ backgroundImage: "url(/static/images/backgroundLight.png)", backgroundRepeat: "repeat", backgroundSize: 200 }}>
			<div className="fixed top-0 left-0 right-0 p-5 pb-2 bg-background" style={{ backgroundImage: "url(/static/images/backgroundLight.png)", backgroundRepeat: "repeat", backgroundSize: 200 }}>
				<p className="flex items-center justify-start gap-3 z-50 text-4xl text-primary-700 font-haspss w-full border-b border-primary-600">Settings</p>
			</div>
			<div className="px-8 py-3 mt-20 max-w-4xl w-full mx-auto  bg-transparent rounded-lg text-center bg-white">
				<ul className="text-lg text-primary-700 divide-y divide-gray-300">
					<li className="cursor-pointer hover:text-primary-700 flex justify-between items-center py-3">
						Ekadashi Notification
						<label className="inline-flex items-center cursor-pointer">
							<input type="checkbox" class="sr-only peer" checked={ekadashiNotification} onChange={() => setEkadashiNotification(!ekadashiNotification)} />
							<div class="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-0 rounded-full peer dark:bg-primary-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
						</label>
					</li>
					<li className="cursor-pointer hover:text-primary-700 flex justify-between items-center py-3" onClick={() => navigate("/profile")}>
						Edit Profile
						<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" className="h-5 w-5 ">
							<path fill="currentColor" d="M310.6 233.4c12.5 12.5 12.5 32.8 0 45.3l-192 192c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L242.7 256 73.4 86.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l192 192z" />
						</svg>
					</li>
					<li className="cursor-pointer hover:text-primary-700 flex justify-between items-center py-3" onClick={() => navigate("/change-password")}>
						Change Password
						<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" className="h-5 w-5 ">
							<path fill="currentColor" d="M310.6 233.4c12.5 12.5 12.5 32.8 0 45.3l-192 192c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L242.7 256 73.4 86.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l192 192z" />
						</svg>
					</li>
					<li className="cursor-pointer hover:text-primary-700 flex justify-between items-center py-3" onClick={() => navigate("/notification-setting")}>
						Following Notification
						<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" className="h-5 w-5 ">
							<path fill="currentColor" d="M310.6 233.4c12.5 12.5 12.5 32.8 0 45.3l-192 192c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L242.7 256 73.4 86.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l192 192z" />
						</svg>
					</li>
					<li className="cursor-pointer hover:text-red-600 flex justify-between items-center py-2" onClick={() => setShowDeletePopup(true)}>
						Delete Your Account
						<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" className="h-5 w-5 ">
							<path fill="currentColor" d="M310.6 233.4c12.5 12.5 12.5 32.8 0 45.3l-192 192c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L242.7 256 73.4 86.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l192 192z" />
						</svg>
					</li>
					<li className="cursor-pointer hover:text-red-600 flex justify-between items-center py-2" onClick={() => navigate("/logout")}>
						Logout
						<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" className="h-5 w-5 ">
							<path fill="currentColor" d="M310.6 233.4c12.5 12.5 12.5 32.8 0 45.3l-192 192c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L242.7 256 73.4 86.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l192 192z" />
						</svg>
					</li>
				</ul>
			</div>
			<DeleteAccountPopup isOpen={showDeletePopup} onClose={() => setShowDeletePopup(false)} />
		</div>
	);
};

export default Setting;
