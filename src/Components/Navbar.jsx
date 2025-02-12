import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
    const [userData, setUserData] = useState(null);

    useEffect(() => {
        const storedUserData = localStorage.getItem("hsapss_user_data");
        if (storedUserData) {
            setUserData(JSON.parse(storedUserData));
        }
    }, []);

    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    if (!userData) {
        return null; // Or display a loading indicator
    }

    return (
        <nav className="bg-white/80 backdrop-blur-lg z-50  custom-shadow fixed w-screen top-0 rounded-b-2xl">
            <div className="w-full px-4 py-3 flex items-center justify-between">
                <div className="flex items-center justify-center z-50">
                    {/* User Image */}
                    <img src={userData?.profile_image} alt="User Profile" className="w-10 h-10 rounded-lg mr-2" />

                    {/* User Name and Region */}
                    <div className="flex flex-col">
                        <span className="text-gray-700 font-medium">
                            {userData?.first_name} {userData?.last_name}
                        </span>
                        <span className="text-gray-500 text-sm">{userData?.region}</span>
                    </div>
                </div>

                <div className="flex items-center ">
                    {/* Burger Menu */}
                    <Link to={"/notification"} className="flex flex-col px-1.5 items-center justify-center cursor-pointer z-10 relative">
                        <svg className="w-5 h-5 text-primary-800" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                            <path fill="currentColor" d="M224 0c-17.7 0-32 14.3-32 32v19.2C119 66 64 130.6 64 208v25.4c0 45.4-15.5 89.5-43.8 124.9L5.3 377c-5.8 7.2-6.9 17.1-2.9 25.4S14.8 416 24 416h400c9.2 0 17.6-5.3 21.6-13.6s2.9-18.2-2.9-25.4l-14.9-18.6c-28.3-35.5-43.8-79.6-43.8-125V208c0-77.4-55-142-128-156.8V32c0-17.7-14.3-32-32-32m0 96c61.9 0 112 50.1 112 112v25.4c0 47.9 13.9 94.6 39.7 134.6H72.3c25.8-40 39.7-86.7 39.7-134.6V208c0-61.9 50.1-112 112-112m64 352H160c0 17 6.7 33.3 18.7 45.3S207 512 224 512s33.3-6.7 45.3-18.7S288 465 288 448" />
                        </svg>
                        <p className="bg-white text-primary-800 outline outline-[2px] outline-primary-800 rounded-full w-3 h-3 absolute -top-0 right-0 text-xs text-center leading-3 font-semibold">
                            3
                        </p>
                    </Link>
                    <button onClick={toggleDropdown} className="p-2 px-1.5 rounded-md focus:outline-none z-10">
                        <svg className="w-6 h-6 text-primary-900" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path className={(isDropdownOpen ? "-rotate-45 translate-y-[18%] " : "") + " origin-center transition-all"} strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4" />
                            <path className={(isDropdownOpen ? "scale-x-0 " : " scale-x-100 ") + " origin-center transition-all"} strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 12h16M4" />
                            <path className={(isDropdownOpen ? "rotate-45 -translate-y-[18%] " : "") + " origin-center transition-all"} strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 18h16" />
                        </svg>
                    </button>
                    {/* Dropdown Menu */}
                    <div className="absolute right-2 top-[105%] rounded-lg transition duration-300 ease-in-out transform origin-top-right z-0 bg-[#fffdf8]" style={{ opacity: isDropdownOpen ? 1 : 0, transform: isDropdownOpen ? "translateY(0)" : "translateY(-100%)" }}>
                        <ul className="py-2">
                            <li>
                                <Link to="/profile" className="flex items-center justify-start gap-1.5 px-4 py-2 text-gray-700 hover:bg-primary-100/50">
                                    <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                                        <path fill="currentColor" d="M304 128a80 80 0 1 0 -160 0 80 80 0 1 0 160 0zM96 128a128 128 0 1 1 256 0A128 128 0 1 1 96 128zM49.3 464l349.5 0c-8.9-63.3-63.3-112-129-112l-91.4 0c-65.7 0-120.1 48.7-129 112zM0 482.3C0 383.8 79.8 304 178.3 304l91.4 0C368.2 304 448 383.8 448 482.3c0 16.4-13.3 29.7-29.7 29.7L29.7 512C13.3 512 0 498.7 0 482.3z" />
                                    </svg>
                                    Profile
                                </Link>
                            </li>
                            <li>
                                <Link to="/settings" className="flex items-center justify-start gap-1.5 px-4 py-2 text-gray-700 hover:bg-primary-100/50">
                                    <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                                        <path fill="currentColor" d="M256 0c17 0 33.6 1.7 49.8 4.8 7.9 1.5 21.8 6.1 29.4 20.1 2 3.7 3.6 7.6 4.6 11.8l9.3 38.5c1.4 5.8 11.2 11.5 16.9 9.8l38-11.2c4-1.2 8.1-1.8 12.2-1.9 16.1-.5 27 9.4 32.3 15.4 22.1 25.1 39.1 54.6 49.9 86.3 2.6 7.6 5.6 21.8-2.7 35.4-2.2 3.6-4.9 7-8 10L459 246.3c-4.2 4-4.2 15.5 0 19.5l28.7 27.3c3.1 3 5.8 6.4 8 10 8.2 13.6 5.2 27.8 2.7 35.4-10.8 31.7-27.8 61.1-49.9 86.3-5.3 6-16.3 15.9-32.3 15.4-4.1-.1-8.2-.8-12.2-1.9L366 427c-5.7-1.7-15.5 4-16.9 9.8l-9.3 38.5c-1 4.2-2.6 8.2-4.6 11.8-7.7 14-21.6 18.5-29.4 20.1-16.2 3.1-32.8 4.8-49.8 4.8s-33.6-1.7-49.8-4.8c-7.9-1.5-21.8-6.1-29.4-20.1-2-3.7-3.6-7.6-4.6-11.8l-9.3-38.5c-1.4-5.8-11.2-11.5-16.9-9.8l-38 11.2c-4 1.2-8.1 1.8-12.2 1.9-16.1.5-27-9.4-32.3-15.4-22-25.1-39.1-54.6-49.9-86.3-2.6-7.6-5.6-21.8 2.7-35.4 2.2-3.6 4.9-7 8-10L53 265.7c4.2-4 4.2-15.5 0-19.5l-28.8-27.3c-3.1-3-5.8-6.4-8-10-8.2-13.6-5.2-27.8-2.6-35.3 10.8-31.7 27.8-61.1 49.9-86.3 5.3-6 16.3-15.9 32.3-15.4 4.1.1 8.2.8 12.2 1.9L146 85c5.7 1.7 15.5-4 16.9-9.8l9.3-38.5c1-4.2 2.6-8.2 4.6-11.8 7.7-14 21.6-18.5 29.4-20.1C222.4 1.7 239 0 256 0m-37.9 51.4-8.5 35.1c-7.8 32.3-45.3 53.9-77.2 44.6l-34.5-10.2c-16.5 19.3-29.5 41.7-38 65.7l26.2 24.9c24 22.8 24 66.2 0 89l-26.2 24.9c8.5 24 21.5 46.4 38 65.7l34.6-10.2c31.8-9.4 69.4 12.3 77.2 44.6l8.5 35.1c24.6 4.5 51.3 4.5 75.9 0l8.5-35.1c7.8-32.3 45.3-53.9 77.2-44.6l34.6 10.2c16.5-19.3 29.5-41.7 38-65.7l-26.2-24.9c-24-22.8-24-66.2 0-89l26.2-24.9c-8.5-24-21.5-46.4-38-65.7l-34.6 10.2c-31.8 9.4-69.4-12.3-77.2-44.6l-8.5-35.1c-24.6-4.5-51.3-4.5-75.9 0zM208 256a48 48 0 1 0 96 0 48 48 0 1 0-96 0m48 96a96 96 0 1 1 0-192 96 96 0 1 1 0 192" />
                                    </svg>
                                    Settings
                                </Link>
                            </li>
                            <li>
                                <Link to="/logout" className="flex items-center justify-start gap-1.5 px-4 py-2 text-gray-700 hover:bg-primary-100/50">
                                    <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                                        <path fill="currentColor" d="M352 146.2 462 256 352 365.8V312c0-13.3-10.7-24-24-24H208v-64h120c13.3 0 24-10.7 24-24zM512 256c0-11.5-4.6-22.5-12.7-30.6L383.2 109.6c-8.7-8.7-20.5-13.6-32.8-13.6-25.6 0-46.4 20.8-46.4 46.4V176h-96c-26.5 0-48 21.5-48 48v64c0 26.5 21.5 48 48 48h96v33.6c0 25.6 20.8 46.4 46.4 46.4 12.3 0 24.1-4.9 32.8-13.6l116.1-115.8c8.1-8.1 12.7-19.1 12.7-30.6M168 80c13.3 0 24-10.7 24-24s-10.7-24-24-24H88C39.4 32 0 71.4 0 120v272c0 48.6 39.4 88 88 88h80c13.3 0 24-10.7 24-24s-10.7-24-24-24H88c-22.1 0-40-17.9-40-40V120c0-22.1 17.9-40 40-40z" />
                                    </svg>
                                    Logout
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
