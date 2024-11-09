import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAtom } from "jotai";
import { userAtom } from "../Variable";

const Notification = () => {
    const [user, setUser] = useAtom(userAtom);
    const [activeCategory, setActiveCategory] = useState("superadmin");
    const [notifications, setNotifications] = useState([]);
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
        fetch(`${import.meta.env.VITE_BACKEND_URL}/api/notification`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${JSON.parse(localStorage.getItem("hsapss_tokens")).access_token}`,
            },
        })
            .then((res) => res.json())
            .then((data) => {
                setNotifications(data.notifications);
            });
    }, []);
    const classes1 = "bg-orange-50 bg-green-50 bg-blue-50 bg-red-50 bg-purple-50 bg-yellow-50 bg-pink-50";
    const classes2 = "border-orange-500 border-green-500 border-blue-500 border-red-500 border-purple-500 border-yellow-500 border-pink-500";

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/notification-create/`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${JSON.parse(localStorage.getItem("hsapss_tokens")).access_token}`,
                },
                body: JSON.stringify({
                    title: notificationTitle,
                    content: notificationContent,
                    type: notificationType,
                }),
            });
            if (response.ok) {
                const data = await response.json();
                setNotifications([...notifications, data.notification]);
                setNotificationTitle("");
                setNotificationContent("");
                setNotificationType("success");
                setFormVisible(false);
            } else {
                console.error("Error creating notification");
            }
        } catch (error) {
            console.error("Error creating notification:", error);
        }
    };

    return (
        <div className="relative bg-background" style={{ backgroundImage: "url(/static/images/backgroundLight.png)", backgroundRepeat: "repeat", backgroundSize: 200 }}>
            {formVisible && (
                <div className="fixed top-0 left-0 w-screen h-screen z-50 backdrop-blur-lg bg-black/50 ">
                    <div className="fixed top-1/2 left-1/2 w-fit min-w-96 transform -translate-x-1/2 -translate-y-1/2 bg-background p-8 rounded-lg shadow-lg " style={{ backgroundImage: "url(/static/images/backgroundLight.png)", backgroundRepeat: "repeat", backgroundSize: 200 }}>
                        <div>
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
                </div>
            )}
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
                {notifications.map((notification, index) => {
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
