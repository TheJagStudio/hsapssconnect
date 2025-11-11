import React, { useEffect, useState } from "react";
import { useAtom } from "jotai";
import { newNotificationAtom, notificationSocketAtom, userAtom } from "../Variable";
import { SendHorizonalIcon } from "lucide-react";

const NotificationForm = ({ notificationTitle, notificationType, notificationContent, deliveryType, deliveryUser, setNotificationTitle, setNotificationType, setNotificationContent, setDeliveryType, setDeliveryUser, setFormVisible }) => {
	const [notifications, setNotifications] = useAtom(newNotificationAtom);
	const [user] = useAtom(userAtom);
	const [socket, setSocket] = useAtom(notificationSocketAtom);

	// New state for enhanced features
	const [isLoading, setIsLoading] = useState(false);
	const [errors, setErrors] = useState({});
	const [searchQuery, setSearchQuery] = useState("");
	const [searchResults, setSearchResults] = useState([]);
	const [isSearching, setIsSearching] = useState(false);
	const [regions, setRegions] = useState([]);
	const [selectedRegion, setSelectedRegion] = useState("");
	const [selectedUserType, setSelectedUserType] = useState("");
	const [showSuccess, setShowSuccess] = useState(false);
	const [showSearchDropdown, setShowSearchDropdown] = useState(false);

	// Fetch regions on mount
	useEffect(() => {
		const fetchRegions = async () => {
			try {
				const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/notifications/regions/`, {
					headers: {
						Authorization: `Bearer ${JSON.parse(localStorage.getItem("hsapss_tokens"))?.access_token}`,
					},
				});
				const data = await response.json();
				setRegions(data.regions || []);
			} catch (error) {
				console.error("Error fetching regions:", error);
			}
		};
		fetchRegions();
	}, []);

	// Search users with debounce
	useEffect(() => {
		if (searchQuery.trim().length < 2) {
			setSearchResults([]);
			setShowSearchDropdown(false);
			return;
		}

		const delayDebounceFn = setTimeout(async () => {
			setIsSearching(true);
			try {
				const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/notifications/users/?type=search&value=${searchQuery}`, {
					headers: {
						Authorization: `Bearer ${JSON.parse(localStorage.getItem("hsapss_tokens"))?.access_token}`,
					},
				});
				const data = await response.json();
				setSearchResults(data.users || []);
				setShowSearchDropdown(true);
			} catch (error) {
				console.error("Error searching users:", error);
			} finally {
				setIsSearching(false);
			}
		}, 300);

		return () => clearTimeout(delayDebounceFn);
	}, [searchQuery]);

	// Fetch users based on delivery type
	const fetchUsersByDeliveryType = async (type, value = "") => {
		try {
			let url = `${import.meta.env.VITE_BACKEND_URL}/notifications/users/?type=${type}`;
			if (value) url += `&value=${value}`;

			const response = await fetch(url, {
				headers: {
					Authorization: `Bearer ${JSON.parse(localStorage.getItem("hsapss_tokens"))?.access_token}`,
				},
			});
			const data = await response.json();
			return data.users || [];
		} catch (error) {
			console.error("Error fetching users:", error);
			return [];
		}
	};

	// Handle delivery type change
	const handleDeliveryTypeChange = async (type) => {
		setDeliveryType(type);
		setDeliveryUser([]);
		setSelectedRegion("");
		setSelectedUserType("");

		if (type === "all") {
			const users = await fetchUsersByDeliveryType("all");
			setDeliveryUser(users);
		}
	};

	// Handle region selection
	const handleRegionChange = async (regionId) => {
		setSelectedRegion(regionId);
		if (regionId) {
			const users = await fetchUsersByDeliveryType("region", regionId);
			setDeliveryUser(users);
		} else {
			setDeliveryUser([]);
		}
	};

	// Handle user type selection
	const handleUserTypeChange = async (userType) => {
		setSelectedUserType(userType);
		if (userType) {
			const users = await fetchUsersByDeliveryType("usertype", userType);
			setDeliveryUser(users);
		} else {
			setDeliveryUser([]);
		}
	};

	// Add user from search
	const addUserFromSearch = (user) => {
		if (!deliveryUser.find((u) => u.id === user.id)) {
			setDeliveryUser([...deliveryUser, user]);
		}
		setSearchQuery("");
		setShowSearchDropdown(false);
	};

	// Validate form
	const validateForm = () => {
		const newErrors = {};

		if (!notificationTitle.trim()) {
			newErrors.title = "Title is required";
		}

		if (!notificationContent.trim()) {
			newErrors.content = "Content is required";
		}

		if (deliveryType === "individualuser" && deliveryUser.length === 0) {
			newErrors.recipients = "Please select at least one recipient";
		}

		if (deliveryType === "region" && !selectedRegion) {
			newErrors.region = "Please select a region";
		}

		if (deliveryType === "usertype" && !selectedUserType) {
			newErrors.usertype = "Please select a user type";
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		if (!validateForm()) {
			return;
		}

		setIsLoading(true);
		setErrors({});

		try {
			// Prepare recipients based on delivery type
			let recipients = [];
			if (deliveryType === "all") {
				recipients = [];
			} else if (deliveryType === "region") {
				recipients = [selectedRegion];
			} else if (deliveryType === "usertype") {
				recipients = [selectedUserType];
			} else if (deliveryType === "individualuser") {
				recipients = deliveryUser.map((u) => u.id);
			}

			const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/notifications/create/`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${JSON.parse(localStorage.getItem("hsapss_tokens"))?.access_token}`,
				},
				body: JSON.stringify({
					title: notificationTitle,
					content: notificationContent,
					notification_type: notificationType,
					delivery_type: deliveryType,
					recipients: recipients,
				}),
			});

			const data = await response.json();

			if (!response.ok) {
				throw new Error(data.error || "Failed to send notification");
			}

			// Show success animation
			setShowSuccess(true);
			setTimeout(() => {
				setNotificationTitle("");
				setNotificationContent("");
				setNotificationType("orange");
				setDeliveryType("all");
				setDeliveryUser([]);
				setFormVisible(false);
			}, 1500);
		} catch (error) {
			setErrors({ submit: error.message });
		} finally {
			setIsLoading(false);
		}
	};
	return (
		<div className="fixed top-0 left-0 w-screen h-screen z-50 bg-black/75 backdrop-blur-sm animate-fadeIn">
			{/* Success Animation Overlay */}
			{showSuccess && (
				<div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-60 animate-scaleIn">
					<div className="bg-white rounded-full p-6 shadow-2xl">
						<svg className="w-20 h-20 text-green-500 animate-checkmark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
						</svg>
					</div>
				</div>
			)}

			<div className="fixed top-1/2 left-1/2 w-fit max-w-2xl min-w-96 max-h-[90vh] overflow-y-auto custom-scrollbar transform -translate-x-1/2 -translate-y-1/2 bg-background rounded-2xl shadow-2xl animate-slideUp" style={{ backgroundImage: "url(/static/images/backgroundLight.png)", backgroundRepeat: "repeat", backgroundSize: 200 }}>
				<div className="flex items-center justify-between bg-white p-2">
					<h2 className="text-2xl font-bold text-primary-700">Create Notification</h2>
					<button
						onClick={() => setFormVisible(false)}
						disabled={isLoading}
						className="p-2 rounded-full hover:bg-gray-200 transition-colors"
					>
						<svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
						</svg>
					</button>
				</div>

				<form onSubmit={handleSubmit} className="p-6">
					{/* Title Input */}
					<div className="mb-4">
						<label htmlFor="title" className="block text-gray-700 font-semibold mb-2">
							Title <span className="text-red-500">*</span>
						</label>
						<input
							type="text"
							id="title"
							disabled={isLoading}
							className={`shadow-inner border rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all ${errors.title ? "border-red-500" : ""}`}
							value={notificationTitle}
							onChange={(e) => {
								setNotificationTitle(e.target.value);
								if (errors.title) setErrors({ ...errors, title: null });
							}}
							placeholder="Enter notification title"
						/>
						{errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
					</div>

					{/* Content Textarea */}
					<div className="mb-4">
						<label htmlFor="content" className="block text-gray-700 font-semibold mb-2">
							Content <span className="text-red-500">*</span>
						</label>
						<textarea
							id="content"
							rows={5}
							disabled={isLoading}
							className={`shadow-inner border rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all resize-none ${errors.content ? "border-red-500" : ""}`}
							value={notificationContent}
							onChange={(e) => {
								setNotificationContent(e.target.value);
								if (errors.content) setErrors({ ...errors, content: null });
							}}
							placeholder="Enter notification content"
						></textarea>
						{errors.content && <p className="text-red-500 text-sm mt-1">{errors.content}</p>}
					</div>

					{/* Notification Type */}
					<div className="mb-4">
						<label htmlFor="type" className="block text-gray-700 font-semibold mb-2">
							Notification Type
						</label>
						<div className="shadow-inner border bg-white flex items-center justify-center gap-3 rounded-lg w-full px-4 text-gray-700 leading-tight focus-within:ring-2 focus-within:ring-primary-500 transition-all">
							<div className={`w-4 h-4 rounded-full outline outline-offset-2 outline-${notificationType}-500 bg-${notificationType}-500 transition-all`}></div>
							<select
								disabled={isLoading}
								className="w-full h-full py-3 bg-transparent focus:outline-none cursor-pointer"
								id="type"
								value={notificationType}
								onChange={(e) => setNotificationType(e.target.value)}
							>
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

					{/* Delivery Type */}
					<div className="mb-4">
						<label htmlFor="delivery" className="block text-gray-700 font-semibold mb-2">
							Delivery Type <span className="text-red-500">*</span>
						</label>
						<div className="flex items-center justify-center rounded-lg w-full h-12 mb-3 overflow-hidden shadow-md">
							<button
								type="button"
								disabled={isLoading}
								onClick={() => handleDeliveryTypeChange("all")}
								className={"w-full h-full text-sm font-medium transition-all " + (deliveryType === "all" ? "bg-primary-600 text-white shadow-inner" : "bg-white text-primary-700 hover:bg-gray-100")}
							>
								All
							</button>
							<button
								type="button"
								disabled={isLoading}
								onClick={() => handleDeliveryTypeChange("region")}
								className={"w-full h-full text-sm font-medium border-l transition-all " + (deliveryType === "region" ? "bg-primary-600 text-white shadow-inner" : "bg-white text-primary-700 hover:bg-gray-100")}
							>
								Mandal
							</button>
							<button
								type="button"
								disabled={isLoading}
								onClick={() => handleDeliveryTypeChange("usertype")}
								className={"w-full h-full text-sm font-medium border-l transition-all " + (deliveryType === "usertype" ? "bg-primary-600 text-white shadow-inner" : "bg-white text-primary-700 hover:bg-gray-100")}
							>
								User Type
							</button>
							<button
								type="button"
								disabled={isLoading}
								onClick={() => handleDeliveryTypeChange("individualuser")}
								className={"w-full h-full text-sm font-medium border-l transition-all " + (deliveryType === "individualuser" ? "bg-primary-600 text-white shadow-inner" : "bg-white text-primary-700 hover:bg-gray-100")}
							>
								Individual
							</button>
						</div>

						{/* Region Selector */}
						{deliveryType === "region" && (
							<div className="mb-3 animate-fadeIn">
								<select
									disabled={isLoading}
									className={`shadow-inner border bg-white rounded-lg w-full py-3 px-4 text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500 ${errors.region ? "border-red-500" : ""}`}
									value={selectedRegion}
									onChange={(e) => {
										handleRegionChange(e.target.value);
										if (errors.region) setErrors({ ...errors, region: null });
									}}
								>
									<option value="">Select a region...</option>
									{regions.map((region) => (
										<option key={region.id} value={region.id}>
											{region.name}
										</option>
									))}
								</select>
								{errors.region && <p className="text-red-500 text-sm mt-1">{errors.region}</p>}
							</div>
						)}

						{/* User Type Selector */}
						{deliveryType === "usertype" && (
							<div className="mb-3 animate-fadeIn">
								<select
									disabled={isLoading}
									className={`shadow-inner border bg-white rounded-lg w-full py-3 px-4 text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500 ${errors.usertype ? "border-red-500" : ""}`}
									value={selectedUserType}
									onChange={(e) => {
										handleUserTypeChange(e.target.value);
										if (errors.usertype) setErrors({ ...errors, usertype: null });
									}}
								>
									<option value="">Select user type...</option>
									<option value="superadmin">Super Admin</option>
									<option value="regionadmin">Region Admin</option>
									<option value="karyakarta">Karyakarta</option>
									<option value="user">User</option>
								</select>
								{errors.usertype && <p className="text-red-500 text-sm mt-1">{errors.usertype}</p>}
							</div>
						)}

						{/* Recipients Display */}
						{deliveryType !== "individualuser" && deliveryUser.length > 0 && (
							<div className="mb-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
								<p className="text-sm text-blue-800 font-medium">
									📊 {deliveryUser.length} recipient{deliveryUser.length !== 1 ? "s" : ""} selected
								</p>
							</div>
						)}

						{/* Individual User Selection */}
						{deliveryType === "individualuser" && (
							<div className="mb-3 animate-fadeIn">
								<div className="relative">
									<input
										type="text"
										disabled={isLoading}
										className={`shadow-inner border bg-white rounded-lg w-full py-3 px-4 pr-10 text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500 ${errors.recipients ? "border-red-500" : ""}`}
										value={searchQuery}
										onChange={(e) => setSearchQuery(e.target.value)}
										placeholder="🔍 Search users by name or email..."
									/>
									{isSearching && (
										<div className="absolute right-3 top-1/2 transform -translate-y-1/2">
											<div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary-600"></div>
										</div>
									)}
								</div>

								{/* Search Results Dropdown */}
								{showSearchDropdown && searchResults.length > 0 && (
									<div className="mt-2 bg-white border rounded-lg shadow-lg max-h-48 overflow-y-auto animate-fadeIn">
										{searchResults.map((user) => (
											<button
												key={user.id}
												type="button"
												onClick={() => addUserFromSearch(user)}
												className="w-full text-left px-4 py-3 hover:bg-gray-100 transition-colors border-b last:border-b-0"
											>
												<p className="font-medium text-gray-800">{user.name}</p>
												<p className="text-xs text-gray-500">{user.email}</p>
											</button>
										))}
									</div>
								)}

								{/* Selected Users */}
								<div className="mt-3 w-full min-h-20 max-h-48 custom-scrollbar overflow-y-auto bg-white rounded-lg py-2 px-3 shadow-inner border flex gap-2 flex-wrap">
									{deliveryUser.length === 0 ? (
										<p className="text-gray-400 text-sm w-full text-center py-4">No users selected</p>
									) : (
										deliveryUser.map((item, index) => (
											<div key={index} className="bg-primary-100 flex items-center justify-center text-primary-800 h-fit px-3 py-1 rounded-full gap-2 animate-fadeIn">
												<p className="max-w-32 truncate text-sm">{item?.name}</p>
												<button
													type="button"
													disabled={isLoading}
													onClick={() => {
														setDeliveryUser(deliveryUser.filter((_, i) => i !== index));
													}}
													className="hover:scale-110 transition-transform"
												>
													<svg width={16} height={16} className="text-primary-800" viewBox="-0.18 -0.18 0.72 0.72" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMinYMin">
														<path fill="currentColor" d="m0.219 0.177 0.106 -0.106A0.03 0.03 0 1 0 0.283 0.028L0.177 0.135 0.071 0.028A0.03 0.03 0 1 0 0.028 0.071l0.106 0.106L0.028 0.283a0.03 0.03 0 1 0 0.042 0.042l0.106 -0.106 0.106 0.106a0.03 0.03 0 1 0 0.042 -0.042L0.219 0.177z" />
													</svg>
												</button>
											</div>
										))
									)}
								</div>
								{errors.recipients && <p className="text-red-500 text-sm mt-1">{errors.recipients}</p>}
							</div>
						)}
					</div>

					{/* Error Message */}
					{errors.submit && (
						<div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg animate-shake">
							<p className="text-red-700 text-sm">❌ {errors.submit}</p>
						</div>
					)}

					{/* Action Buttons */}
					<div className="flex items-center justify-between gap-3 pt-4 border-t">
						<button
							type="button"
							onClick={() => setFormVisible(false)}
							disabled={isLoading}
							className="bg-white hover:bg-gray-100 border-2 border-gray-300 text-gray-700 py-2.5 px-6 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed"
						>
							Cancel
						</button>
						<button
							type="submit"
							disabled={isLoading}
							className="bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white font-bold py-2.5 px-8 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-400 transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
						>
							{isLoading ? (
								<>
									<div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
									Sending...
								</>
							) : (
								<>
									Submit
									<SendHorizonalIcon className="w-5 h-5" />
								</>
							)}
						</button>
					</div>
				</form>
			</div>

			<style jsx>{`
				@keyframes fadeIn {
					from {
						opacity: 0;
					}
					to {
						opacity: 1;
					}
				}

				@keyframes slideUp {
					from {
						opacity: 0;
						transform: translate(-50%, -40%);
					}
					to {
						opacity: 1;
						transform: translate(-50%, -50%);
					}
				}

				@keyframes scaleIn {
					0% {
						transform: translate(-50%, -50%) scale(0);
					}
					50% {
						transform: translate(-50%, -50%) scale(1.1);
					}
					100% {
						transform: translate(-50%, -50%) scale(1);
					}
				}

				@keyframes checkmark {
					0% {
						stroke-dasharray: 0 100;
					}
					100% {
						stroke-dasharray: 100 100;
					}
				}

				@keyframes shake {
					0%,
					100% {
						transform: translateX(0);
					}
					25% {
						transform: translateX(-10px);
					}
					75% {
						transform: translateX(10px);
					}
				}

				.animate-fadeIn {
					animation: fadeIn 0.3s ease-out;
				}

				.animate-slideUp {
					animation: slideUp 0.4s ease-out;
				}

				.animate-scaleIn {
					animation: scaleIn 0.6s ease-out;
				}

				.animate-checkmark {
					animation: checkmark 0.6s ease-out forwards;
				}

				.animate-shake {
					animation: shake 0.4s ease-out;
				}
			`}</style>
		</div>
	);
};

export default NotificationForm;
