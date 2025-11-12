import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
    const [userData, setUserData] = useState(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    useEffect(() => {
        const storedUserData = localStorage.getItem("hsapss_user_data");
        if (storedUserData) {
            setUserData(JSON.parse(storedUserData));
        }
    }, []);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const closeSidebar = () => {
        setIsSidebarOpen(false);
    };

    if (!userData) {
        return null;
    }

    return (
        <>
            <nav className="bg-white/80 backdrop-blur-lg z-50 custom-shadow fixed w-screen top-0 rounded-b-2xl">
                <div className="w-full px-4 py-3 flex items-center justify-between">
                    <div className="flex items-center justify-center z-50">
                        {/* User Image */}
                        <img src={import.meta.env.VITE_BACKEND_URL + userData?.profile_image} alt="User Profile" className="w-10 h-10 rounded-lg mr-2" />

                        {/* User Name and Region */}
                        <div className="flex flex-col">
                            <span className="text-gray-700 font-medium">
                                {userData?.first_name} {userData?.last_name}
                            </span>
                            <span className="text-gray-500 text-sm">{userData?.region}</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        {/* Notification Icon */}
                        <Link to="/notification" className="flex flex-col px-1.5 items-center justify-center cursor-pointer z-10 relative">
                            <svg className="w-5 h-5 text-primary-800" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                                <path fill="currentColor" d="M224 0c-17.7 0-32 14.3-32 32v19.2C119 66 64 130.6 64 208v25.4c0 45.4-15.5 89.5-43.8 124.9L5.3 377c-5.8 7.2-6.9 17.1-2.9 25.4S14.8 416 24 416h400c9.2 0 17.6-5.3 21.6-13.6s2.9-18.2-2.9-25.4l-14.9-18.6c-28.3-35.5-43.8-79.6-43.8-125V208c0-77.4-55-142-128-156.8V32c0-17.7-14.3-32-32-32m0 96c61.9 0 112 50.1 112 112v25.4c0 47.9 13.9 94.6 39.7 134.6H72.3c25.8-40 39.7-86.7 39.7-134.6V208c0-61.9 50.1-112 112-112m64 352H160c0 17 6.7 33.3 18.7 45.3S207 512 224 512s33.3-6.7 45.3-18.7S288 465 288 448" />
                            </svg>
                            <p className="bg-white text-primary-800 outline outline-[2px] outline-primary-800 rounded-full w-3 h-3 absolute -top-0 right-0 text-xs text-center leading-3 font-semibold">
                                3
                            </p>
                        </Link>

                        {/* Burger Menu */}
                        <button onClick={toggleSidebar} className="p-2 px-1.5 rounded-md focus:outline-none z-10">
                            <svg className="w-6 h-6 text-primary-900" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path className={(isSidebarOpen ? "-rotate-45 translate-y-[18%] " : "") + " origin-center transition-all"} strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16" />
                                <path className={(isSidebarOpen ? "scale-x-0 " : " scale-x-100 ") + " origin-center transition-all"} strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 12h16" />
                                <path className={(isSidebarOpen ? "rotate-45 -translate-y-[18%] " : "") + " origin-center transition-all"} strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 18h16" />
                            </svg>
                        </button>
                    </div>
                </div>
            </nav>

            {/* Overlay */}
            {isSidebarOpen && (
                <div 
                    className="fixed inset-0 bg-black/50 z-[60] transition-opacity duration-300"
                    onClick={closeSidebar}
                />
            )}

            {/* Side Drawer - From Right */}
            <div 
                className={`fixed top-0 right-0 h-full w-72 bg-gradient-to-b from-[#1a3d5c] to-[#0f2940] z-[70] transform transition-transform duration-300 ease-in-out ${
                    isSidebarOpen ? 'translate-x-0' : 'translate-x-full'
                }`}
            >
                <div className="flex flex-col h-full text-white/80">
                    {/* Close Button */}
                    <button 
                        onClick={closeSidebar}
                        className="absolute top-4 left-4 p-2 rounded-full bg-white/10 hover:bg-white/20 transition"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>

                    {/* Menu Items */}
                    <nav className="flex-1 pt-16 px-4 overflow-y-auto">
                        <ul className="space-y-2">
                            <li>
                                <Link 
                                    to="/" 
                                    onClick={closeSidebar}
                                    className="flex items-center gap-4 px-4 py-3 rounded-lg hover:bg-white/10 transition"
                                >
                                    <svg className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512">
                                        <path fill="currentColor" d="M575.8 255.5c0 18-15 32.1-32 32.1l-32 0 .7 160.2c0 2.7-.2 5.4-.5 8.1l0 16.2c0 22.1-17.9 40-40 40l-16 0c-1.1 0-2.2 0-3.3-.1c-1.4 .1-2.8 .1-4.2 .1L416 512l-24 0c-22.1 0-40-17.9-40-40l0-24 0-64c0-17.7-14.3-32-32-32l-64 0c-17.7 0-32 14.3-32 32l0 64 0 24c0 22.1-17.9 40-40 40l-24 0-31.9 0c-1.5 0-3-.1-4.5-.2c-1.2 .1-2.4 .2-3.6 .2l-16 0c-22.1 0-40-17.9-40-40l0-112c0-.9 0-1.9 .1-2.8l0-69.7-32 0c-18 0-32-14-32-32.1c0-9 3-17 10-24L266.4 8c7-7 15-8 22-8s15 2 21 7L564.8 231.5c8 7 12 15 11 24z"/>
                                    </svg>
                                    <span className="text-lg">Home</span>
                                </Link>
                            </li>
                            
                            <li>
                                <Link
                                    to="/wallpapers"
                                    onClick={closeSidebar}
                                    className="flex items-center gap-4 px-4 py-3 rounded-lg hover:bg-white/10 transition"
                                >
                                    <svg className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                                        <path fill="currentColor" d="M0 64C0 28.7 28.7 0 64 0L384 0c35.3 0 64 28.7 64 64l0 384c0 35.3-28.7 64-64 64L64 512c-35.3 0-64-28.7-64-64L0 64zM128 256a64 64 0 1 0 128 0 64 64 0 1 0 -128 0zM80 432c0-44.2 35.8-80 80-80l96 0c44.2 0 80 35.8 80 80c0 8.8-7.2 16-16 16L96 448c-8.8 0-16-7.2-16-16z"/>
                                    </svg>
                                    <span className="text-lg">Wallpapers</span>
                                </Link>
                            </li>

                            <li>
                                <Link 
                                    to="/notes" 
                                    onClick={closeSidebar}
                                    className="flex items-center gap-4 px-4 py-3 rounded-lg hover:bg-white/10 transition"
                                >
                                    <svg className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512">
                                        <path fill="currentColor" d="M64 0C28.7 0 0 28.7 0 64L0 448c0 35.3 28.7 64 64 64l256 0c35.3 0 64-28.7 64-64l0-288-128 0c-17.7 0-32-14.3-32-32L224 0 64 0zM256 0l0 128 128 0L256 0zM112 256l160 0c8.8 0 16 7.2 16 16s-7.2 16-16 16l-160 0c-8.8 0-16-7.2-16-16s7.2-16 16-16zm0 64l160 0c8.8 0 16 7.2 16 16s-7.2 16-16 16l-160 0c-8.8 0-16-7.2-16-16s7.2-16 16-16zm0 64l160 0c8.8 0 16 7.2 16 16s-7.2 16-16 16l-160 0c-8.8 0-16-7.2-16-16s7.2-16 16-16z"/>
                                    </svg>
                                    <span className="text-lg">My Notes</span>
                                </Link>
                            </li>

                            <li>
                                <Link 
                                    to="/search" 
                                    onClick={closeSidebar}
                                    className="flex items-center gap-4 px-4 py-3 rounded-lg hover:bg-white/10 transition"
                                >
                                    <svg className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                                        <path fill="currentColor" d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z"/>
                                    </svg>
                                    <span className="text-lg">Search</span>
                                </Link>
                            </li>

                            <li>
                                <Link 
                                    to="/info" 
                                    onClick={closeSidebar}
                                    className="flex items-center gap-4 px-4 py-3 rounded-lg hover:bg-white/10 transition"
                                >
                                    <svg className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                                        <path fill="currentColor" d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM216 336l24 0 0-64-24 0c-13.3 0-24-10.7-24-24s10.7-24 24-24l48 0c13.3 0 24 10.7 24 24l0 88 8 0c13.3 0 24 10.7 24 24s-10.7 24-24 24l-80 0c-13.3 0-24-10.7-24-24s10.7-24 24-24zm40-208a32 32 0 1 1 0 64 32 32 0 1 1 0-64z"/>
                                    </svg>
                                    <span className="text-lg">Info</span>
                                </Link>
                            </li>

                            <li>
                                <Link 
                                    to="/share" 
                                    onClick={closeSidebar}
                                    className="flex items-center gap-4 px-4 py-3 rounded-lg hover:bg-white/10 transition"
                                >
                                    <svg className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                                        <path fill="currentColor" d="M307 34.8c-11.5 5.1-19 16.6-19 29.2l0 64-112 0C78.8 128 0 206.8 0 304C0 417.3 81.5 467.9 100.2 478.1c2.5 1.4 5.3 1.9 8.1 1.9c10.9 0 19.7-8.9 19.7-19.7c0-7.5-4.3-14.4-9.8-19.5C108.8 431.9 96 414.4 96 384c0-53 43-96 96-96l96 0 0 64c0 12.6 7.4 24.1 19 29.2s25 3 34.4-5.4l160-144c6.7-6.1 10.6-14.7 10.6-23.8s-3.8-17.7-10.6-23.8l-160-144c-9.4-8.5-22.9-10.6-34.4-5.4z"/>
                                    </svg>
                                    <span className="text-lg">Share App</span>
                                </Link>
                            </li>

                            <li>
                                <Link 
                                    to="/feedback" 
                                    onClick={closeSidebar}
                                    className="flex items-center gap-4 px-4 py-3 rounded-lg hover:bg-white/10 transition"
                                >
                                    <svg className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                                        <path fill="currentColor" d="M256 448c141.4 0 256-93.1 256-208S397.4 32 256 32S0 125.1 0 240c0 45.1 17.7 86.8 47.7 120.9c-1.9 24.5-11.4 46.3-21.4 62.9c-5.5 9.2-11.1 16.6-15.2 21.6c-2.1 2.5-3.7 4.4-4.9 5.7c-.6 .6-1 1.1-1.3 1.4l-.3 .3c-4.6 4.6-5.9 11.4-3.4 17.4c2.5 6 8.3 9.9 14.8 9.9c28.7 0 57.6-8.9 81.6-19.3c22.9-10 42.4-21.9 54.3-30.6c31.8 11.5 67 17.9 104.1 17.9zM128 208a32 32 0 1 1 0 64 32 32 0 1 1 0-64zm128 0a32 32 0 1 1 0 64 32 32 0 1 1 0-64zm96 32a32 32 0 1 1 64 0 32 32 0 1 1 -64 0z"/>
                                    </svg>
                                    <span className="text-lg">Feedback</span>
                                </Link>
                            </li>

                            <li>
                                <Link 
                                    to="/settings" 
                                    onClick={closeSidebar}
                                    className="flex items-center gap-4 px-4 py-3 rounded-lg hover:bg-white/10 transition"
                                >
                                    <svg className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                                        <path fill="currentColor" d="M495.9 166.6c3.2 8.7 .5 18.4-6.4 24.6l-43.3 39.4c1.1 8.3 1.7 16.8 1.7 25.4s-.6 17.1-1.7 25.4l43.3 39.4c6.9 6.2 9.6 15.9 6.4 24.6c-4.4 11.9-9.7 23.3-15.8 34.3l-4.7 8.1c-6.6 11-14 21.4-22.1 31.2c-5.9 7.2-15.7 9.6-24.5 6.8l-55.7-17.7c-13.4 10.3-28.2 18.9-44 25.4l-12.5 57.1c-2 9.1-9 16.3-18.2 17.8c-13.8 2.3-28 3.5-42.5 3.5s-28.7-1.2-42.5-3.5c-9.2-1.5-16.2-8.7-18.2-17.8l-12.5-57.1c-15.8-6.5-30.6-15.1-44-25.4L83.1 425.9c-8.8 2.8-18.6 .3-24.5-6.8c-8.1-9.8-15.5-20.2-22.1-31.2l-4.7-8.1c-6.1-11-11.4-22.4-15.8-34.3c-3.2-8.7-.5-18.4 6.4-24.6l43.3-39.4C64.6 273.1 64 264.6 64 256s.6-17.1 1.7-25.4L22.4 191.2c-6.9-6.2-9.6-15.9-6.4-24.6c4.4-11.9 9.7-23.3 15.8-34.3l4.7-8.1c6.6-11 14-21.4 22.1-31.2c5.9-7.2 15.7-9.6 24.5-6.8l55.7 17.7c13.4-10.3 28.2-18.9 44-25.4l12.5-57.1c2-9.1 9-16.3 18.2-17.8C227.3 1.2 241.5 0 256 0s28.7 1.2 42.5 3.5c9.2 1.5 16.2 8.7 18.2 17.8l12.5 57.1c15.8 6.5 30.6 15.1 44 25.4l55.7-17.7c8.8-2.8 18.6-.3 24.5 6.8c8.1 9.8 15.5 20.2 22.1 31.2l4.7 8.1c6.1 11 11.4 22.4 15.8 34.3zM256 336a80 80 0 1 0 0-160 80 80 0 1 0 0 160z"/>
                                    </svg>
                                    <span className="text-lg">Settings</span>
                                </Link>
                            </li>
                        </ul>
                    </nav>

                    {/* User Profile Section at Bottom */}
                    <div className="p-4 border-t border-white/20">
                        <Link 
                            to="/profile" 
                            onClick={closeSidebar}
                            className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/10 transition"
                        >
                            <img 
                                src={import.meta.env.VITE_BACKEND_URL + userData?.profile_image} 
                                alt="Profile" 
                                className="w-12 h-12 rounded-full border-2 border-white/30"
                            />
                            <div className="flex-1">
                                <p className="font-medium text-white">
                                    {userData?.first_name} {userData?.last_name}
                                </p>
                                <p className="text-sm text-white/60">{userData?.region}</p>
                            </div>
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Navbar;
