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
        <div className="min-h-screen pb-20 pt-20">
            <div className="z-50 fixed top-0 bg-background px-5 pt-5 text-4xl text-primary-700 font-haspss w-full " style={{ backgroundImage: "url(/static/images/backgroundLight.png)", backgroundRepeat: "repeat", backgroundSize: 200 }}>
                <h1 className="border-b border-primary-600">Books</h1>
            </div>

            <div className="grid grid-cols-2 px-5 md:flex md:flex-row md:flex-wrap items-start justify-center gap-5 p-2 md:p-8 md:gap-10">
                {books.map((book) => (
                    <Link to={book?.urlId ? `/book/${book.urlId}` : "#"} key={book?.id} rel="noreferrer noopener" className="flex items-start justify-center">
                        <div className="relative w-48 h-auto aspect-[2/3] transition ">
                            {/* Front Cover */}
                            <img src={book?.poster ? import.meta.env.VITE_BACKEND_URL + book.poster : "/placeholder-book.jpg"} alt={book?.title} className="w-48 h-auto aspect-[2/3] rounded-xl shadow-lg border border-secondary-900 object-cover" />
							<p className="text-lg text-primary-900 text-center mt-2 font- ">{book?.title}</p>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default Books;
