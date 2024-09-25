import React,{useState,useEffect} from "react";

const Notification = () => {
    const [activeCategory, setActiveCategory] = useState("superadmin");
    const [notifications, setNotifications] = useState([]);
    useEffect(() => {
        fetch(`${import.meta.env.VITE_BACKEND_URL}/api/notification-list/`)
            .then((res) => res.json())
            .then((data) => {
                setNotifications(data.notifications);
            });
    }, []);
    const classes1 = "bg-orange-50 bg-green-50 bg-blue-50 bg-red-50 bg-purple-50 bg-yellow-50 bg-pink-50";
    const classes2 = "border-orange-500 border-green-500 border-blue-500 border-red-500 border-purple-500 border-yellow-500 border-pink-500";

    return (
        <div className="p-5 relative">
            <div>
                <p className="text-4xl text-primary-700 font-haspss w-full border-b border-primary-600">Notifications</p>
            </div>
            <div className="flex flex-nowrap gap-x-3 overflow-x-auto my-3 w-fit">
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
            <div className="grid grid-cols-1 md:grid-cols-3 items-center justify-center w-full gap-3 pb-20">
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
                            <p  className="text-sm font-normal text-gray-600 text-right">- {notification?.sender}</p>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
export default Notification;
