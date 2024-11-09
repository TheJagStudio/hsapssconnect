import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { userAtom } from "../Variable";
import { useAtom } from "jotai";
const Footer = () => {
    const [currentPage, setCurrentPage] = useState("home");
    const [user, setUser] = useAtom(userAtom);

	useEffect(() => {
		if(window.location.pathname == "/") {
			setCurrentPage("home");
		} else if(window.location.pathname == "/notification") {
			setCurrentPage("notification");
		} else if(window.location.pathname == "/calendar") {
			setCurrentPage("calendar");
		} else if(window.location.pathname.includes("/bhajan")) {
			setCurrentPage("bhajan");
		} else if(window.location.pathname == "/setting") {
			setCurrentPage("setting");
		}
        // alert(user?.user_type);
	}, []);
    return (
        <div className="fixed bottom-0 md:bottom-3 left-0 md:left-1/2 translate-x-0 md:-translate-x-1/2 rounded-t-3xl md:rounded-full grid grid-cols-5 items-center justify-center w-screen md:w-[50%] lg:w-[40%] h-18 py-3 z-40 bg-white md:bg-white/80 md:backdrop-blur-lg custom-shadow lg:shadow-xl overflow-x-hidden">
            <Link
                onClick={() => {
                    setCurrentPage("home");
                }}
                to={"/"}
                className="flex flex-col items-center justify-center cursor-pointer"
            >
                {currentPage == "home" ? (
                    <svg className="w-6 h-6 text-primary-700" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512">
                        <path fill="currentColor" d="M575.8 255.5c0 18-15 32.1-32 32.1l-32 0 .7 160.2c0 2.7-.2 5.4-.5 8.1l0 16.2c0 22.1-17.9 40-40 40l-16 0c-1.1 0-2.2 0-3.3-.1c-1.4 .1-2.8 .1-4.2 .1L416 512l-24 0c-22.1 0-40-17.9-40-40l0-24 0-64c0-17.7-14.3-32-32-32l-64 0c-17.7 0-32 14.3-32 32l0 64 0 24c0 22.1-17.9 40-40 40l-24 0-31.9 0c-1.5 0-3-.1-4.5-.2c-1.2 .1-2.4 .2-3.6 .2l-16 0c-22.1 0-40-17.9-40-40l0-112c0-.9 0-1.9 .1-2.8l0-69.7-32 0c-18 0-32-14-32-32.1c0-9 3-17 10-24L266.4 8c7-7 15-8 22-8s15 2 21 7L564.8 231.5c8 7 12 15 11 24z" />
                    </svg>
                ) : (
                    <svg className="w-6 h-6 text-primary-700 opacity-80" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512">
                        <path fill="currentColor" d="M298.6 4c-6-5.3-15.1-5.3-21.2 0L5.4 244c-6.6 5.8-7.3 16-1.4 22.6s16 7.3 22.6 1.4L64 235l0 197c0 44.2 35.8 80 80 80l288 0c44.2 0 80-35.8 80-80l0-197 37.4 33c6.6 5.8 16.7 5.2 22.6-1.4s5.2-16.7-1.4-22.6L298.6 4zM96 432l0-225.3L288 37.3 480 206.7 480 432c0 26.5-21.5 48-48 48l-64 0 0-160c0-17.7-14.3-32-32-32l-96 0c-17.7 0-32 14.3-32 32l0 160-64 0c-26.5 0-48-21.5-48-48zm144 48l0-160 96 0 0 160-96 0z" />
                    </svg>
                )}
                <p className={"text-sm md:text-md " + (currentPage == "home" ? "text-primary-600" : "text-primary-600/75")}>Home</p>
            </Link>
            <Link
                onClick={() => {
                    setCurrentPage("calendar");
                }}
                to={"/calendar"}
                className="flex flex-col items-center justify-center cursor-pointer"
            >
                {currentPage == "calendar" ? (
                    <svg className="w-6 h-6 text-primary-700" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                        <path fill="currentColor" d="M96 32l0 32L48 64C21.5 64 0 85.5 0 112l0 48 448 0 0-48c0-26.5-21.5-48-48-48l-48 0 0-32c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 32L160 64l0-32c0-17.7-14.3-32-32-32S96 14.3 96 32zM448 192L0 192 0 464c0 26.5 21.5 48 48 48l352 0c26.5 0 48-21.5 48-48l0-272z" />
                    </svg>
                ) : (
                    <svg className="w-6 h-6 text-primary-700 opacity-80" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                        <path fill="currentColor" d="M112 0c8.8 0 16 7.2 16 16l0 48 192 0 0-48c0-8.8 7.2-16 16-16s16 7.2 16 16l0 48 32 0c35.3 0 64 28.7 64 64l0 32 0 32 0 256c0 35.3-28.7 64-64 64L64 512c-35.3 0-64-28.7-64-64L0 192l0-32 0-32C0 92.7 28.7 64 64 64l32 0 0-48c0-8.8 7.2-16 16-16zM416 192L32 192l0 256c0 17.7 14.3 32 32 32l320 0c17.7 0 32-14.3 32-32l0-256zM384 96L64 96c-17.7 0-32 14.3-32 32l0 32 384 0 0-32c0-17.7-14.3-32-32-32z" />
                    </svg>
                )}
                <p className={"text-sm md:text-md " + (currentPage == "calendar" ? "text-primary-600" : "text-primary-600/75")}>Calendar</p>
            </Link>
            <Link
                onClick={() => {
                    setCurrentPage("bhajan");
                }}
                to={"/bhajan"}
                className="flex flex-col items-center justify-center cursor-pointer"
            >
                {currentPage == "bhajan" ? (
                    <svg className="w-6 h-6 text-primary-700" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                        <path fill="currentColor" d="M499.1 6.3c8.1 6 12.9 15.6 12.9 25.7l0 72 0 264c0 44.2-43 80-96 80s-96-35.8-96-80s43-80 96-80c11.2 0 22 1.6 32 4.6L448 147 192 223.8 192 432c0 44.2-43 80-96 80s-96-35.8-96-80s43-80 96-80c11.2 0 22 1.6 32 4.6L128 200l0-72c0-14.1 9.3-26.6 22.8-30.7l320-96c9.7-2.9 20.2-1.1 28.3 5z" />
                    </svg>
                ) : (
                    <svg className="w-6 h-6 text-primary-700 opacity-80" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                        <path fill="currentColor" d="M512 23c0-12.7-10.3-23-23-23c-2.3 0-4.6 .3-6.8 1l-311 95.7C164.6 98.8 160 105 160 112l0 120 0 140.4C143 359.7 120.6 352 96 352c-53 0-96 35.8-96 80s43 80 96 80s96-35.8 96-80l0-185.7 288-88.6 0 150.7c-17-12.7-39.4-20.4-64-20.4c-53 0-96 35.8-96 80s43 80 96 80s96-35.8 96-80l0-231.6c0-.2 0-.5 0-.7L512 23zM480 368c0 21.3-22.9 48-64 48s-64-26.7-64-48s22.9-48 64-48s64 26.7 64 48zM160 432c0 21.3-22.9 48-64 48s-64-26.7-64-48s22.9-48 64-48s64 26.7 64 48zM480 124.2L192 212.8l0-89L480 35.2l0 89z" />
                    </svg>
                )}
                <p className={"text-sm md:text-md " + (currentPage == "bhajan" ? "text-primary-600" : "text-primary-600/75")}>Bhajan</p>
            </Link>
            <Link
                onClick={() => {
                    setCurrentPage("setting");
                }}
                to={"/setting"}
                className="flex flex-col items-center justify-center cursor-pointer"
            >
                {currentPage == "setting" ? (
                    <svg className="w-6 h-6 text-primary-700" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                        <path fill="currentColor" d="M495.9 166.6c3.2 8.7.5 18.4-6.4 24.6l-43.3 39.4c1.1 8.3 1.7 16.8 1.7 25.4s-.6 17.1-1.7 25.4l43.3 39.4c6.9 6.2 9.6 15.9 6.4 24.6-4.4 11.9-9.7 23.3-15.8 34.3l-4.7 8.1c-6.6 11-14 21.4-22.1 31.2-5.9 7.2-15.7 9.6-24.5 6.8l-55.7-17.7c-13.4 10.3-28.2 18.9-44 25.4l-12.5 57.1c-2 9.1-9 16.3-18.2 17.8-13.8 2.3-28 3.5-42.5 3.5s-28.7-1.2-42.5-3.5c-9.2-1.5-16.2-8.7-18.2-17.8l-12.5-57.1c-15.8-6.5-30.6-15.1-44-25.4l-55.6 17.8c-8.8 2.8-18.6.3-24.5-6.8-8.1-9.8-15.5-20.2-22.1-31.2l-4.7-8.1c-6.1-11-11.4-22.4-15.8-34.3-3.2-8.7-.5-18.4 6.4-24.6l43.3-39.4c-1.1-8.4-1.7-16.9-1.7-25.5s.6-17.1 1.7-25.4l-43.3-39.4c-6.9-6.2-9.6-15.9-6.4-24.6 4.4-11.9 9.7-23.3 15.8-34.3l4.7-8.1c6.6-11 14-21.4 22.1-31.2 5.9-7.2 15.7-9.6 24.5-6.8l55.7 17.7c13.4-10.3 28.2-18.9 44-25.4l12.5-57.1c2-9.1 9-16.3 18.2-17.8C227.3 1.2 241.5 0 256 0s28.7 1.2 42.5 3.5c9.2 1.5 16.2 8.7 18.2 17.8l12.5 57.1c15.8 6.5 30.6 15.1 44 25.4l55.7-17.7c8.8-2.8 18.6-.3 24.5 6.8 8.1 9.8 15.5 20.2 22.1 31.2l4.7 8.1c6.1 11 11.4 22.4 15.8 34.3zM256 336a80 80 0 1 0 0-160 80 80 0 1 0 0 160" />
                    </svg>
                ) : (
                    <svg className="w-6 h-6 text-primary-700 opacity-80" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                        <path fill="currentColor" d="M223.3 37.8c.4-1.5 1.3-2.8 2.4-3.8 9.9-1.3 20-2 30.3-2s20.4.7 30.3 2c1.1 1 1.9 2.3 2.4 3.8l13.7 47.7c3.5 12.1 12.2 21.1 22.5 26.1 7.6 3.6 14.8 7.8 21.7 12.5 9.4 6.5 21.7 9.5 33.9 6.5l48.2-12c1.5-.4 3-.3 4.4.2 5.4 6.9 10.4 14.2 14.9 21.8l4.3 7.4c4.2 7.5 7.9 15.3 11.2 23.3-.3 1.5-1 2.9-2.1 4L426.8 211c-8.7 9-12.2 21.1-11.3 32.5.3 4.1.5 8.3.5 12.5s-.2 8.4-.5 12.5c-.9 11.4 2.6 23.5 11.3 32.5l34.5 35.7c1.1 1.1 1.8 2.5 2.1 4-3.3 8-7 15.8-11.2 23.4l-4.2 7.3c-4.6 7.6-9.6 14.8-14.9 21.8-1.4.5-2.9.5-4.4.2l-48.2-12c-12.2-3-24.4 0-33.9 6.5-6.9 4.7-14.1 8.9-21.7 12.5-10.3 4.9-19.1 14-22.5 26.1l-13.7 47.7c-.4 1.5-1.3 2.8-2.4 3.8-9.9 1.3-20 2-30.3 2s-20.4-.7-30.3-2c-1.1-1-1.9-2.3-2.4-3.8l-13.7-47.7c-3.5-12.1-12.2-21.1-22.5-26.1-7.6-3.6-14.8-7.8-21.7-12.5-9.4-6.5-21.7-9.5-33.9-6.5l-48.2 12c-1.5.4-3 .3-4.4-.2-5.4-7-10.4-14.2-15-21.8l-4.2-7.3c-4.2-7.5-7.9-15.3-11.2-23.4.3-1.5 1-2.9 2.1-4L85.2 301c8.7-9 12.2-21.1 11.3-32.5-.3-4.1-.5-8.3-.5-12.5s.2-8.4.5-12.5c.9-11.4-2.6-23.5-11.3-32.5l-34.5-35.8c-1.1-1.1-1.8-2.5-2.1-4 3.3-8 7-15.8 11.2-23.4l4.2-7.3c4.6-7.6 9.6-14.8 15-21.8 1.4-.5 2.9-.5 4.4-.2l48.2 12c12.2 3 24.4 0 33.9-6.5 6.9-4.7 14.1-8.9 21.7-12.5 10.3-4.9 19.1-14 22.5-26.1l13.7-47.7zM256 0c-13 0-25.9 1-38.4 2.9-1.7.3-3.4.8-5 1.6-9.5 4.9-16.9 13.6-20 24.5l-13.7 47.7c-.6 2.2-2.5 4.5-5.6 6-9.1 4.3-17.8 9.4-26 15-2.8 1.9-5.8 2.4-8 1.8l-48.2-12C80.2 84.8 69 86.9 60 92.6c-1.5.9-2.8 2.1-3.9 3.5-7.1 8.9-13.7 18.2-19.6 28l-.1.3L32 132l-.1.3c-5.4 9.8-10.2 19.9-14.3 30.4-.6 1.6-1 3.3-1.1 5-.5 10.8 3.3 21.6 11.2 29.8l34.5 35.7c1.6 1.7 2.7 4.4 2.4 7.8q-.6 7.5-.6 15s.2 10.1.6 15c.3 3.4-.8 6.2-2.4 7.8l-34.5 35.8c-7.9 8.2-11.7 19-11.2 29.8.1 1.7.5 3.4 1.1 5 4.1 10.5 8.9 20.6 14.3 30.4l.1.3 4.4 7.6.1.3c5.9 9.8 12.4 19.2 19.6 28.1 1.1 1.4 2.4 2.6 3.9 3.5 9 5.7 20.2 7.8 31.1 5.1l48.2-12c2.2-.6 5.2-.1 8 1.8 8.2 5.7 16.9 10.7 26 15 3.1 1.5 4.9 3.8 5.6 6l13.7 47.5c3.1 10.8 10.5 19.5 20 24.5 1.6.8 3.2 1.4 5 1.6C230.1 511 243 512 256 512s25.9-1 38.4-2.9c1.7-.3 3.4-.8 5-1.6 9.5-4.9 16.9-13.6 20-24.5l13.7-47.7c.6-2.2 2.5-4.5 5.6-6 9.1-4.3 17.8-9.4 26-15 2.8-1.9 5.8-2.4 8-1.8l48.2 12c10.9 2.7 22.1.7 31.1-5.1 1.5-.9 2.8-2.1 3.9-3.5 7.1-8.9 13.6-18.2 19.5-28l.2-.3 4.4-7.6.1-.3c5.4-9.7 10.2-19.9 14.3-30.4.6-1.6 1-3.3 1.1-5 .5-10.8-3.3-21.6-11.2-29.8l-34.5-35.7c-1.6-1.7-2.7-4.4-2.4-7.8a188 188 0 0 0 0-30c-.3-3.4.8-6.2 2.4-7.8l34.5-35.7c7.9-8.2 11.7-19 11.2-29.8-.1-1.7-.5-3.4-1.1-5-4.1-10.5-8.9-20.6-14.3-30.4l-.1-.3-4.4-7.6-.2-.3c-5.9-9.8-12.4-19.2-19.5-28-1.1-1.4-2.4-2.6-3.9-3.5-9-5.7-20.2-7.8-31.1-5.1l-48.2 12c-2.2.6-5.2.1-8-1.8-8.2-5.7-16.9-10.7-26-15-3.1-1.5-4.9-3.8-5.6-6L319.4 29c-3.1-10.8-10.5-19.5-20-24.5-1.6-.8-3.2-1.4-5-1.6C281.9 1 269 0 256 0m-56 256a56 56 0 1 1 112 0 56 56 0 1 1-112 0m144 0a88 88 0 1 0-176 0 88 88 0 1 0 176 0" />
                    </svg>
                )}
                <p className={"text-sm md:text-md " + (currentPage == "setting" ? "text-primary-600" : "text-primary-600/75")}>Setting</p>
            </Link>
        </div>
    );
};

export default Footer;
