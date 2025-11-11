import React, { useEffect, useState } from "react";
import { bhajanCategoryAtom, currentBhajanAtom, activeCategoryAtom, audioBaseAtom, lyricsBaseAtom } from "../Variable";
import { useAtom } from "jotai";
import { Link } from "react-router-dom";

const BhajanCategory = () => {
	const [categories, setCategories] = useAtom(bhajanCategoryAtom);
	const [currentBhajan, setCurrentBhajan] = useAtom(currentBhajanAtom);
	const [activeCategory, setActiveCategory] = useAtom(activeCategoryAtom);
	const [audioBase, setAudioBase] = useAtom(audioBaseAtom);
	const [lyricsBase, setLyricsBase] = useAtom(lyricsBaseAtom);
	const [search, setSearch] = useState("");
	useEffect(() => {
		fetch(`${import.meta.env.VITE_BACKEND_URL}/api/bhajan-category-list/`)
			.then((res) => res.json())
			.then((data) => {
				setCategories(data?.categories);
				setAudioBase(data?.audioBase);
				setLyricsBase(data?.lyricsBase);
			});
	}, []);
	return (
		<div className="p-5 relative min-h-screen">
			<div
				className="fixed top-0 left-0 right-0 p-5 pb-2 bg-background"
				style={{
					backgroundImage: "url(/static/images/backgroundLight.png)",
					backgroundRepeat: "repeat",
					backgroundSize: 200,
				}}
			>
				<p className="z-50 text-4xl text-primary-700 font-haspss w-full border-b border-primary-600">
					Bhakti Sudha
				</p>
			</div>
			<div className="mt-16 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
				{categories?.map((category, index) => (
					<Link
						key={index}
						to={"/bhajan/" + category?.link}
						className="flex flex-col items-center justify-center bg-white rounded-lg shadow-md p-3"
					>
						<img
							src={category?.icon}
							alt={category?.name}
							className="w-12 h-12 mb-2"
						/>
						<button
							onClick={() => {
								setActiveCategory(category?.name);
							}}
							className="text-center text-primary-600"
						>
							{category?.name}
						</button>
					</Link>
				))}
			</div>
		</div>
	);
};

export default BhajanCategory;
