import React, { useEffect, useState } from "react";
import { bhajanCategoryAtom, bhajansAtom, currentBhajanAtom, activeCategoryAtom, audioBaseAtom, lyricsBaseAtom } from "../Variable";
import { useAtom } from "jotai";
import { Link, useParams, useNavigate } from "react-router-dom";
import { PlayCircleIcon, PlayIcon } from "lucide-react";

const BhajanHome = () => {
	const { catLink } = useParams();
	const [bhajans, setBhajans] = useAtom(bhajansAtom);
	const [currentBhajan, setCurrentBhajan] = useAtom(currentBhajanAtom);
	const [activeCategory, setActiveCategory] = useAtom(activeCategoryAtom);
	const [audioBase, setAudioBase] = useAtom(audioBaseAtom);
	const [lyricsBase, setLyricsBase] = useAtom(lyricsBaseAtom);
	const [search, setSearch] = useState("");
	const navigate = useNavigate();

	useEffect(() => {
		fetch(`${import.meta.env.VITE_BACKEND_URL}/api/bhajan-list/${catLink}`)
			.then((res) => res.json())
			.then((data) => {
				setBhajans(data?.bhajans);
				setAudioBase(data?.audioBase);
				setLyricsBase(data?.lyricsBase);
				setActiveCategory(data?.category);
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
				<div className="flex items-center justify-start">
					<button
						onClick={() => {
							navigate("/bhajan");
						}}
						className="p-2 rounded-full"
					>
						<svg
							className="w-6 h-6 text-primary-700"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M15 19l-7-7 7-7"
							/>
						</svg>
					</button>
					<p className="z-50 text-4xl text-primary-700 font-haspss w-full">
						{activeCategory}
					</p>
				</div>
				<div className="z-50 w-full h-fit relative">
					<input
						onChange={(event) => {
							setSearch(event.currentTarget.value);
						}}
						value={search}
						type="text"
						className="w-full lg:max-w-96 text-primary-600 h-10 pl-8 peer bg-white/75 focus:bg-white outline-2 outline-offset-1 focus:outline-primary-600 border-2 border-primary-600 rounded-full px-3"
						placeholder={"Search " + activeCategory}
					/>
					<svg
						className="absolute top-3 left-3 w-4 h-4 text-gray-500 peer-focus:text-primary-600"
						viewBox="0 0 0.6 0.6"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path
							fill="currentColor"
							d="M0.246 0c0.136 0 0.246 0.109 0.246 0.243a0.24 0.24 0 0 1 -0.059 0.158l0.162 0.164a0.021 0.021 0 0 1 0 0.029 0.021 0.021 0 0 1 -0.03 0l-0.161 -0.164a0.247 0.247 0 0 1 -0.156 0.055C0.11 0.485 0 0.376 0 0.243 0 0.109 0.11 0 0.246 0m0 0.042c-0.112 0 -0.204 0.09 -0.204 0.201s0.091 0.201 0.204 0.201 0.204 -0.09 0.204 -0.201c0 -0.111 -0.091 -0.201 -0.204 -0.201"
						/>
					</svg>
				</div>
			</div>
			<div className="pt-24 pb-40 grid grid-cols-1 md:grid-cols-3 gap-3">
				{bhajans?.map((bhajan, index) => {
					if (
						search &&
						!bhajan?.title.toLowerCase().includes(search.toLowerCase())
					)
						return null;
					return (
						<div
							key={index}
							className="flex items-center justify-between bg-white rounded-lg shadow-md p-3"
						>
							<div>
								<p className="text-lg text-primary-600">{bhajan?.title}</p>
								<p className="text-sm text-primary-500">{bhajan?.title_guj}</p>
							</div>
							<div className="flex items-center gap-2 justify-between">
								{bhajan?.isAudio && (
									<button
										onClick={() => {
											setCurrentBhajan(bhajan);
										}}
										className="text-primary-700 hover:text-primary-800 transition-colors"
									>
										<PlayCircleIcon size={24} />
									</button>
								)}
								{bhajan?.isEng && <p className="text-primary-500">E</p>}
								<Link
									onClick={() => {
										setCurrentBhajan(bhajan);
									}}
									to={"/bhajan/" + catLink + "/" + bhajan?.id}
									className="text-white bg-primary-500 rounded-md px-2 py-1"
								>
									view
								</Link>
							</div>
						</div>
					);
				})}
			</div>
		</div>
	);
};

export default BhajanHome;
