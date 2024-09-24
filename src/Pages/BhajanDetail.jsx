import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useAtom } from "jotai";
import { bhajanAtom, lyricsBaseAtom, audioBaseAtom } from "../Variable";

const BhajanDetail = () => {
    const [bhajan, setBhajan] = useAtom(bhajanAtom);
    const [audioBase, setAudioBase] = useAtom(audioBaseAtom);
    const [lyricsBase, setLyricsBase] = useAtom(lyricsBaseAtom);
    const [activeLanguage, setActiveLanguage] = useState("");
    const [musicActive, setMusicActive] = useState(false);
    const [fontSize, setFontSize] = useState(16);
    const { id } = useParams();
    useEffect(() => {
        if (bhajan?.id === undefined) {
            fetch(`${import.meta.env.VITE_BACKEND_URL}/api/bhajan-detail/${id}`)
                .then((res) => res.json())
                .then((data) => {
                    setBhajan(data);
                    setAudioBase(data.audioBase);
                    setLyricsBase(data.lyricsBase);
                    fetch(data?.lyricsBase + data?.lyrics)
                        .then((res) => res.text())
                        .then((data) => {
                            document.getElementById("lyrics").innerHTML = data;
                        });
                });
        }
    }, []);
    useEffect(() => {
        if (lyricsBase !== "") {
            fetch(lyricsBase + activeLanguage + bhajan?.lyrics)
                .then((res) => res.text())
                .then((data) => {
                    document.getElementById("lyrics").innerHTML = data;
                });
        } else {
            fetch(bhajan?.lyricsBase + activeLanguage + bhajan?.lyrics)
                .then((res) => res.text())
                .then((data) => {
                    document.getElementById("lyrics").innerHTML = data;
                });
        }
    }, [activeLanguage]);
    return (
        <div className="p-5">
            <div className="flex items-center justify-between w-full pb-1 border-b border-primary-600 gap-5">
                <div className="flex items-center justify-start gap-5">
                    <Link to={"/bhajan"}>
                        <svg className="text-white bg-primary-600 hover:scale-105 transition-all rounded-xl p-1.5" width={25} height={25} viewBox="-0.006 -0.021 30.688 30.648" xmlns="http://www.w3.org/2000/svg">
                            <path fill="currentColor" d="m6.688 17.403 9.041 9.855a2.044 2.044 0 1 1-3.118 2.646L.587 16.799a2 2 0 0 1-.414-.601 2.04 2.04 0 0 1-.179-.885v-.002a2.05 2.05 0 0 1 .218-.874l.042-.078a2 2 0 0 1 .303-.411L12.899.633a2.046 2.046 0 0 1 3 2.78l-9.176 9.901h21.914a2.046 2.046 0 0 1 0 4.09z" />
                        </svg>
                    </Link>
                    <div>
                        <h1 className="text-3xl text-primary-800 font-haspss whitespace-nowrap text-nowrap">{bhajan.title}</h1>
                        <p className=" text-primary-800 ">{bhajan.title_guj}</p>
                    </div>
                </div>
                <div className="flex items-end justify-end gap-2 mt-5">
                    <button
                        onClick={() => {
                            try {
                                for (let i = 0; i < document.getElementsByClassName("gpara").length; i++) {
                                    document.getElementsByClassName("gpara")[i].style.fontSize = fontSize + 3 + "px";
                                }
                            } catch (e) {}
                            try {
                                for (let i = 0; i < document.getElementsByClassName("gparabhajan3").length; i++) {
                                    document.getElementsByClassName("gparabhajan3")[i].style.fontSize = fontSize + 3 + "px";
                                }
                            } catch (e) {}
                            setFontSize(fontSize + 3);
                        }}
                        className="text-white text-xl bg-primary-600/80 hover:bg-primary-600 border-2 border-primary-600 transition-all rounded-full w-8 h-8"
                    >
                        +
                    </button>
                    <button
                        onClick={() => {
                            try {
                                for (let i = 0; i < document.getElementsByClassName("gpara").length; i++) {
                                    document.getElementsByClassName("gpara")[i].style.fontSize = fontSize - 3 + "px";
                                }
                            } catch (e) {}
                            try {
                                for (let i = 0; i < document.getElementsByClassName("gparabhajan3").length; i++) {
                                    document.getElementsByClassName("gparabhajan3")[i].style.fontSize = fontSize - 3 + "px";
                                }
                            } catch (e) {}
                            setFontSize(fontSize - 3);
                        }}
                        className="text-white text-xl bg-primary-600/80 hover:bg-primary-600 border-2 border-primary-600 transition-all rounded-full w-8 h-8"
                    >
                        -
                    </button>
                </div>
            </div>
            <div className="w-fit max-w-full lg:w-fit flex flex-nowrap items-center justify-start gap-x-3 my-3 overflow-x-scroll">
                <button
                    onClick={() => {
                        setActiveLanguage("");
                        setFontSize(16)
                    }}
                    className={"px-3 py-1 text-center rounded-full w-full max-w-fit h-fit mx-auto text-nowrap border-primary-600 border-2 transition-all " + (activeLanguage === "" ? "bg-gradient-to-tr from-primary-600 to-primary-500 text-white" : " text-primary-600")}
                >
                    Gujarati
                </button>
                {bhajan?.isEng && (
                    <button
                        onClick={() => {
                            setActiveLanguage("E");
                            setFontSize(16)
                        }}
                        className={"px-3 py-1 text-center rounded-full w-full max-w-fit h-fit mx-auto text-nowrap border-primary-600 border-2 transition-all " + (activeLanguage === "E" ? "bg-gradient-to-tr from-primary-600 to-primary-500 text-white" : " text-primary-600")}
                    >
                        English
                    </button>
                )}
                {bhajan?.isHnd && (
                    <button
                        onClick={() => {
                            setActiveLanguage("H");
                            setFontSize(16)
                        }}
                        className={"px-3 py-1 text-center rounded-full w-full max-w-fit h-fit mx-auto text-nowrap border-primary-600 border-2 transition-all " + (activeLanguage === "H" ? "bg-gradient-to-tr from-primary-600 to-primary-500 text-white" : " text-primary-600")}
                    >
                        Hindi
                    </button>
                )}
                {bhajan?.isGer && (
                    <button
                        onClick={() => {
                            setActiveLanguage("G");
                            setFontSize(16)
                        }}
                        className={"px-3 py-1 text-center rounded-full w-full max-w-fit h-fit mx-auto text-nowrap border-primary-600 border-2 transition-all " + (activeLanguage === "G" ? "bg-gradient-to-tr from-primary-600 to-primary-500 text-white" : " text-primary-600")}
                    >
                        Germany
                    </button>
                )}
                {bhajan?.isAudio && (
                    <button
                        onClick={() => {
                            setMusicActive(!musicActive);
                        }}
                        className={"px-3 py-1 text-center rounded-full w-full max-w-fit h-fit mx-auto text-nowrap border-primary-600 border-2 transition-all " + (musicActive ? "bg-gradient-to-tr from-primary-600 to-primary-500 text-white" : " text-primary-600")}
                    >
                        Music
                    </button>
                )}
            </div>
            {bhajan?.isAudio && <audio className="w-full md:max-w-64 mb-2" controls={musicActive} src={audioBase + bhajan?.audio_url}></audio>}
            <div id="lyrics" className={"w-full min-h-32 bg-white rounded-xl shadow-inner p-5 mb-20 " + (activeLanguage == "H" ? "font-ShreeHindi text-xl" : "")}></div>
        </div>
    );
};

export default BhajanDetail;
