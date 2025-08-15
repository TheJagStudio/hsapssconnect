import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Loading from "../Components/Loading";

const BooksDetails = () => {
	const { urlId } = useParams();
	const navigate = useNavigate();
	const [book, setBook] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [showFullDescription, setShowFullDescription] = useState(false);
	const [openSection, setOpenSection] = useState(null); // Replace openSections state

	const toggleSection = (index) => {
		setOpenSection(openSection === index ? null : index);
	};

	useEffect(() => {
		const fetchBook = async () => {
			try {
				const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/book/${urlId}`);
				const data = await response.json();
				setBook(data.book);
				setLoading(false);
			} catch (err) {
				setError("Failed to load book details");
				setLoading(false);
			}
		};
		fetchBook();
	}, [urlId]);

	// Function to truncate text to a specific number of lines
	const truncateDescription = (text, lines = 4) => {
		if (!text) return "";
		const words = text.split(" ");
		// Approximate 10 words per line
		const truncated = words.slice(0, lines * 10).join(" ");
		return words.length > lines * 10 ? `${truncated}...` : truncated;
	};

	if (loading) return <Loading />;
	if (error) return <div className="text-secondary-500 text-center mt-4 font-semibold">{error}</div>;
	return (
		<div className="p-2 relative min-h-screen">
			<div
				className="fixed top-0 left-0 right-0 p-2 pb-2 bg-background"
				style={{
					backgroundImage: "url(/static/images/backgroundLight.png)",
					backgroundRepeat: "repeat",
					backgroundSize: 200,
				}}
			>
				<div className="flex items-center justify-start border-b border-primary-600">
					<button onClick={() => navigate(-1)} className="p-2 rounded-full">
						<svg className="w-6 h-6 text-primary-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
						</svg>
					</button>
					<p className="z-50 text-4xl text-primary-700 font-haspss w-full">Book Details</p>
				</div>
			</div>
			<div className="px-5 pt-14 pb-20">
				<div className="md:flex gap-6">
					{/* Left Column: Book Info Section */}
					<div className="md:w-1/2 bg-white rounded-lg shadow-md overflow-hidden mb-6 md:mb-0">
						{/* Book Cover */}
						<div className="p-6 flex justify-center">
							<img 
								src={import.meta.env.VITE_BACKEND_URL + book?.poster} 
								alt={book?.title} 
								className="max-w-full max-h-[300px] md:max-h-[400px] object-contain rounded-lg shadow-md" 
							/>
						</div>

						{/* Book Details */}
						<div className="p-6 pt-0">
							<h2 className="text-2xl md:text-3xl font-bold text-primary-800 mb-2 font-haspss">{book?.title}</h2>
							<p className="text-lg italic text-primary-600 mb-4">by {book?.author}</p>

							<div className="bg-white shadow-inner p-4 md:p-5 rounded-lg mb-6 border border-primary-100">
								<h3 className="text-lg md:text-xl font-semibold mb-2 md:mb-3 text-primary-700">Description</h3>
								<p className="text-primary-600 leading-relaxed">
									{showFullDescription ? book?.description : truncateDescription(book?.description)}
								</p>
								{book?.description && book.description.split(" ").length > 40 && (
									<button 
										onClick={() => setShowFullDescription(!showFullDescription)} 
										className="px-3 py-1 text-center rounded-full w-full max-w-fit h-fit mx-auto text-nowrap border-primary-600 border-2 transition-all bg-gradient-to-tr from-primary-600 to-primary-500 text-white"
									>
										{showFullDescription ? "Show Less" : "Show More"}
									</button>
								)}
							</div>
						</div>
					</div>

					{/* Right Column: Chapter List */}
					<div className="md:w-1/2 bg-white rounded-lg shadow-md p-6 md:overflow-auto ">
						<h3 className="text-xl font-bold mb-4 text-primary-800">Contents</h3>

						{book?.sections && book.sections.length > 0 ? (
							<div className="space-y-6">
								{book.sections.map((section, index) => (
									<div key={index} className="bg-white p-4 rounded-lg shadow-inner border border-primary-100">
										<button 
											onClick={() => toggleSection(index)}
											className="w-full flex items-center justify-between text-left"
										>
											<h4 className={`font-bold w-full text-primary-700 pb-2 ${openSection === index ? 'border-b border-primary-200' : ''}`}>
												{section?.title}
											</h4>
											<svg
												className={`w-5 h-5 transform transition-transform duration-200 ${openSection === index ? 'rotate-180' : ''}`}
												fill="none"
												stroke="currentColor"
												viewBox="0 0 24 24"
											>
												<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
											</svg>
										</button>

										<div className={`transition-all duration-300 ease-in-out overflow-hidden ${openSection === index ? 'max-h-[100%] opacity-100 mt-3' : 'max-h-0 opacity-0'}`}>
											{section?.chapters && section?.chapters.length > 0 ? (
												<ul className="space-y-2">
													{section?.chapters.map((chapter, idx) => (														<li key={idx} 
															onClick={() => navigate(`/book/${urlId}/${chapter.urlId}`)}
															className="hover:bg-primary-50 transition-colors duration-200 p-3 rounded-lg cursor-pointer"
														>
															<div className="flex items-center">
																<span className="flex-shrink-0 w-7 h-7 rounded-lg md:rounded-full bg-primary-100 text-primary-700 font-medium flex items-center justify-center mr-3">
																	{idx + 1}
																</span>
																<span className="text-primary-700 truncate">
																	{chapter?.title} - &nbsp;
																	{chapter?.data?.contentGuj?.substring(0, 100)}...
																</span>
															</div>
														</li>
													))}
												</ul>
											) : (
												<p className="text-primary-500 italic">No chapters in this section</p>
											)}
										</div>
									</div>
								))}
							</div>
						) : (
							<div className="text-center py-8">
								<p className="text-primary-500 italic">No content available for this book</p>
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
};

export default BooksDetails;
