import React from "react";
import { useNavigate } from "react-router-dom";

const MeditationSection = () => {
    const navigate = useNavigate();

    const meditationFunctions = [
        {
            id: 1,
            title: "Dhun with Swamiji",
            description: "Experience divine dhun with Swamiji",

            image: "/static/images/activity/dhun.png",
            path: "/meditation/dhun",
            bgColor: "from-yellow-200/50 to-yellow-100/50",
        },
        {
            id: 2,
            title: "Chesta with Swamiji",
            description: "Sacred chesta experience",

            image: "/static/images/activity/chesta.png",
            path: "/meditation/chesta",
            bgColor: "from-pink-200/50 to-pink-100/50",
        },
        {
            id: 3,
            title: "5 Swami ni Vato",
            description: "Five sacred teachings",

            image: "/static/images/activity/swaminivato.png",
            path: "/meditation/swami-vato",
            bgColor: "from-teal-200/50 to-teal-100/50",
        },
        {
            id: 4,
            title: "5 Slok from Shikshapatri",
            description: "Five verses from Shikshapatri",

            image: "/static/images/activity/shikshapatri.png",
            path: "/meditation/shikshapatri-slok",
            bgColor: "from-orange-200/50 to-orange-100/50",
        },
    ];

    const handleMeditationClick = (path) => {
        navigate(path);
    };

    return (
        <div className="p-4 md:p-6">
            <div className="flex justify-between items-center mb-6">
                <p className="font-haspss text-2xl md:text-3xl text-primary-700">Meditation & Breathing</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-6">
                {meditationFunctions.map((item) => (
                    <div key={item.id} onClick={() => handleMeditationClick(item.path)} className={`bg-gradient-to-br ${item.bgColor} rounded-2xl md:rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:scale-105 active:scale-95 overflow-hidden`}>
                        <div className="h-full flex flex-col">
                            <div className="relative mb-4">
                                <img
                                    src={item.image}
                                    alt={item.title}
                                    className="w-full h-auto aspect-square object-cover rounded-xl"
                                    onError={(e) => {
                                        e.target.style.display = "none";
                                        e.target.nextSibling.style.display = "block";
                                    }}
                                />
                            </div>

                            <div className="flex flex-row justify-between px-5">
                                <div>
                                    <h3 className="text-base md:text-lg font-bold text-gray-800 mb-2 line-clamp-2">{item.title}</h3>
                                    <p className="text-xs md:text-sm text-gray-600 mb-4 line-clamp-2">{item.description}</p>
                                </div>

                                <div className="flex items-center justify-center">
                                    <button type="button" className="py-2 md:py-3 px-3 md:px-4 rounded-full bg-primary-500 hover:bg-primary-600 text-white transition-all duration-300 flex items-center justify-center shadow-md hover:shadow-lg">
                                        <span className="text-lg md:text-xl">▶</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MeditationSection;
