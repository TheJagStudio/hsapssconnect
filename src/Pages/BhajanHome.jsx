import React, { useEffect, useState } from "react";
import { bhajanCategoryAtom, bhajansAtom,bhajanAtom, activeCategoryAtom, audioBaseAtom, lyricsBaseAtom } from "../Variable";
import { useAtom } from "jotai";
import { Link } from "react-router-dom";

const BhajanHome = () => {
    const [categories, setCategories] = useAtom(bhajanCategoryAtom);
    const [bhajans, setBhajans] = useAtom(bhajansAtom);
    const [bhajan, setBhajan] = useAtom(bhajanAtom);
    const [activeCategory, setActiveCategory] = useAtom(activeCategoryAtom);
    const [audioBase, setAudioBase] = useAtom(audioBaseAtom);
    const [lyricsBase, setLyricsBase] = useAtom(lyricsBaseAtom);
    const [search, setSearch] = useState("");
    useEffect(() => {
        fetch(`${import.meta.env.VITE_BACKEND_URL}/api/bhajan-category-list/`)
            .then((res) => res.json())
            .then((data) => {
                setCategories(data.categories);
                setBhajans(data.bhajans);
                setAudioBase(data.audioBase);
                setLyricsBase(data.lyricsBase);
            });
    }, []);
    return (
        <div className="p-5 relative">
            <div className="fixed top-0 left-0 right-0 p-5 pb-2 bg-background">
                <p className="text-4xl text-primary-700 font-haspss w-full border-b border-primary-600">Bhakti Sudha</p>
                <div className="flex flex-nowrap gap-x-3 overflow-x-auto my-3">
                    {categories.map((category, item) => (
                        <button
                            onClick={() => {
                                setActiveCategory(category.name);
                            }}
                            key={item}
                            className={"px-3 py-1 text-center rounded-full w-full h-fit mx-auto text-nowrap border-primary-600 border-2 transition-all " + (activeCategory == category.name ? "bg-gradient-to-tr from-primary-600 to-primary-500 text-white" : " text-primary-600")}
                        >
                            {category.name}
                        </button>
                    ))}
                </div>
                <div className="w-full h-fit relative">
                    <input
                        onChange={(event) => {
                            setSearch(event.currentTarget.value);
                        }}
                        value={search}
                        type="text"
                        className="w-full lg:max-w-96 text-primary-600 h-10 pl-8 peer bg-white/75 focus:bg-white outline-2 outline-offset-1 focus:outline-primary-600 border-2 border-primary-600 rounded-full px-3"
                        placeholder={"Search " + activeCategory}
                    />
                    <svg className="absolute top-3 left-3 w-4 h-4 text-gray-500 peer-focus:text-primary-600" viewBox="0 0 0.6 0.6" xmlns="http://www.w3.org/2000/svg">
                        <path fill="currentColor" d="M0.246 0c0.136 0 0.246 0.109 0.246 0.243a0.24 0.24 0 0 1 -0.059 0.158l0.162 0.164a0.021 0.021 0 0 1 0 0.029 0.021 0.021 0 0 1 -0.03 0l-0.161 -0.164a0.247 0.247 0 0 1 -0.156 0.055C0.11 0.485 0 0.376 0 0.243 0 0.109 0.11 0 0.246 0m0 0.042c-0.112 0 -0.204 0.09 -0.204 0.201s0.091 0.201 0.204 0.201 0.204 -0.09 0.204 -0.201c0 -0.111 -0.091 -0.201 -0.204 -0.201" />
                    </svg>
                </div>
            </div>
            <div className="pt-[9.5rem] pb-20 grid grid-cols-1 md:grid-cols-3 gap-3 ">
                {bhajans.map((bhajan, index) => {
                    if(activeCategory !== "All Kirtan" && bhajan?.category !== activeCategory) return null;
                    if (search && !bhajan?.title.toLowerCase().includes(search.toLowerCase())) return null;
                    return (
                        <div key={index} className="flex items-center justify-between bg-white rounded-lg shadow-md p-3">
                            <div>
                                <p className="text-lg text-primary-600">{bhajan?.title}</p>
                                <p className="text-sm text-primary-500">{bhajan?.title_guj}</p>
                            </div>
                            <div className="flex items-center gap-2 justify-between">
                                {bhajan?.isAudio && (
                                    <svg className="text-secondary-500" width={24} height={24} viewBox="0 0 1.44 1.44" xmlns="http://www.w3.org/2000/svg">
                                        <g fill="currentColor">
                                            <path d="M.84.99a.27.27 0 0 1-.27.27A.27.27 0 0 1 .3.99a.27.27 0 0 1 .54 0" />
                                            <path d="M.72.18v.81h.12V.42l.33.09V.3z" />
                                        </g>
                                    </svg>
                                )}
                                {bhajan?.isEng && <p className="text-primary-500">E</p>}
                                <Link onClick={()=>{
                                    setBhajan(bhajan);
                                }} to={"/bhajan/"+bhajan?.id} className="text-white bg-primary-500 rounded-md px-2 py-1">view</Link>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default BhajanHome;
