import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Loading from "../Components/Loading";
import AudioPlayer from "../Components/AudioPlayer";

const BookChapter = () => {
	const { urlId, chapterId } = useParams();
	const navigate = useNavigate();
	const [chapter, setChapter] = useState(null);
	const [isLoading, setIsLoading] = useState(true);
	const [activeLanguage, setActiveLanguage] = useState("Gujarati");

	useEffect(() => {
		fetch(`${import.meta.env.VITE_BACKEND_URL}/api/book/${urlId}/${chapterId}`)
			.then((res) => res.json())
			.then((data) => {
				if (data) {
					setChapter(data["chapter"]);
				}
				setIsLoading(false);
			})
			.catch((err) => {
				console.error(err);
				setIsLoading(false);
			});
	}, [urlId, chapterId]);

	if (isLoading) return <Loading />;
	if (!chapter) return <div>Chapter not found</div>;

	return (
		<div className="p-5 pb-20 h-screen overflow-y-auto">
			<div>
				<div className="flex items-center justify-between w-full pb-1 border-b border-primary-600">
					<div className="flex items-center justify-start gap-2">
						<button
							onClick={() => navigate(-1)}
							className="rounded-full"
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
						<div>
							<h1 className="text-2xl text-primary-800 font-semibold">
								{activeLanguage === "Gujarati"?`પ્રકરણ ${chapter.data.prakaran}, વાત ${chapter.data.vato}`:`Prakaran ${chapter.data.prakaran}, Vat ${chapter.data.vato}`}
							</h1>
						</div>
					</div>
					<div className="flex items-center justify-end gap-2">
						<button
							onClick={() => setActiveLanguage("Gujarati")}
							className={`px-3 py-1 text-center rounded-full border-2 border-primary-600 transition-all ${
								activeLanguage === "Gujarati"
									? "bg-gradient-to-tr from-primary-600 to-primary-500 text-white"
									: "text-primary-600"
							}`}
						>
							GUJ
						</button>
						<button
							onClick={() => setActiveLanguage("English")}
							className={`px-3 py-1 text-center rounded-full border-2 border-primary-600 transition-all ${
								activeLanguage === "English"
									? "bg-gradient-to-tr from-primary-600 to-primary-500 text-white"
									: "text-primary-600"
							}`}
						>
							EN
						</button>
					</div>
				</div>
				<div className="mt-4 max-w-4xl mx-auto space-y-4">
					<div className="max-w-none prose prose-lg">
						{activeLanguage === "Gujarati" ? (
							<>
								<p className="text-lg text-primary-800 leading-relaxed">
									{chapter.data.contentGuj}
								</p>
								{chapter.data.footnoteGuj && (
									<div className="mt-8 text-sm text-primary-600 border-t pt-4">
										<strong>Footnote:</strong>{" "}
										{chapter.data.footnoteGuj}
									</div>
								)}
							</>
						) : (
							<>
								<p className="text-lg text-gray-800 leading-relaxed">
									{chapter.data.contentEng}
								</p>
								{chapter.data.footnoteEng && (
									<div className="mt-8 text-sm text-gray-600 border-t pt-4">
										<strong>Footnote:</strong>{" "}
										{chapter.data.footnoteEng}
									</div>
								)}
							</>
						)}
					</div>
					{chapter.data.mp3 && (
						<div className="mt-8">
							<AudioPlayer
								className="w-full max-w-lg mx-auto"
								src={chapter.data.mp3}
							/>
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

export default BookChapter;
