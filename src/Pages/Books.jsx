import React, { useState, useEffect } from "react";
import Loading from "../Components/Loading";
import { Link } from "react-router-dom";

const Books = () => {
	const [books, setBooks] = useState([]);
	const [loadingState, setLoadingState] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		const fetchBooks = async () => {
			try {
				const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/bookList/`);
				const data = await response.json();
				setBooks(data.books);
				setLoadingState(false);
			} catch (err) {
				setError("Failed to load books");
				setLoadingState(false);
			}
		};
		fetchBooks();
	}, []);

	if (loadingState) return <Loading />;
	if (error) return <div className="text-red-500 text-center mt-4">{error}</div>;

	return (
		<div className="min-h-screen p-5">
			<h1 className="z-50 text-4xl text-primary-700 font-haspss w-full border-b border-primary-600 mb-6">Books</h1>

			<div className="flex flex-row flex-wrap items-center justify-center gap-10 p-8">
				{books.map((book) => (
					<Link to={book?.urlId ? `/book/${book.urlId}` : "#"} key={book?.id} rel="noreferrer noopener" className="flex items-center justify-center [perspective:1000px] group">
						<div className="relative w-[200px] h-[300px] [transform-style:preserve-3d] [transform:rotateY(-14deg)] transition duration-1000 animate-[4s_ease_0s_1_initAnimation] group-hover:[transform:rotateY(0deg)]">
							{/* Front Cover */}
							<img src={import.meta.env.VITE_BACKEND_URL + book?.poster} alt={book?.title} className="absolute inset-0 w-[200px] h-[300px] [transform:translateZ(27.5px)] rounded-r-md object-cover" />

							{/* Pages */}
							<div className="absolute left-0 top-[6px] w-[53px] h-[296px] [transform:translateX(169.5px)_rotateY(90deg)] bg-gradient-to-r from-white via-[#f9f9f9] to-white [background-size:5%_100%]"></div>

							{/* Back Cover */}
							<div className="absolute inset-0 w-[200px] h-[300px] [transform:translateZ(-27.5px)] bg-[#847956] rounded-r-md shadow-[-5px_0_5px_10px_#6666] group-hover:shadow-[5px_0_5px_10px_#6666] transition-all duration-1000"></div>
						</div>
					</Link>
				))}
			</div>
		</div>
	);
};

export default Books;
