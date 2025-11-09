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
                        <div className="relative w-48 h-auto aspect-[2/3] transition ">
                            {/* Front Cover */}
                            <img src={book?.poster ? import.meta.env.VITE_BACKEND_URL + book.poster : '/placeholder-book.jpg'} alt={book?.title} className="absolute inset-0 w-48 h-auto aspect-[2/3] rounded-r-md object-cover" />
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default Books;
