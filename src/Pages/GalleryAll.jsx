import React, { useState, useEffect } from "react";
import { PhotoProvider, PhotoView } from "react-photo-view";
import "react-photo-view/dist/react-photo-view.css";
import { useNavigate } from "react-router-dom";

const GalleryAll = () => {
    const [galleryImages, setGalleryImages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchAllGalleryImages();
    }, []);

    const fetchAllGalleryImages = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/gallery/all/`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${JSON.parse(localStorage.getItem("hsapss_tokens"))?.access_token}`,
                },
            });

            if (!response.ok) {
                throw new Error("Failed to fetch gallery images");
            }

            const data = await response.json();
            setGalleryImages(data.gallery || []);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    const groupImagesByDate = () => {
        const grouped = {};
        galleryImages.forEach((image) => {
            const dateKey = new Date(image.date).toDateString();
            if (!grouped[dateKey]) {
                grouped[dateKey] = [];
            }
            grouped[dateKey].push(image);
        });
        return grouped;
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center relative">
                <div
                    className="fixed top-0 left-0 right-0 bottom-0"
                    style={{
                        backgroundImage: "url(/static/images/backgroundLight.png)",
                        backgroundRepeat: "repeat",
                        backgroundSize: 200,
                    }}
                ></div>
                <div className="flex flex-col items-center z-10">
                    <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
                    <p className="mt-4 text-primary-600">Loading gallery...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center relative">
                <div
                    className="fixed top-0 left-0 right-0 bottom-0"
                    style={{
                        backgroundImage: "url(/static/images/backgroundLight.png)",
                        backgroundRepeat: "repeat",
                        backgroundSize: 200,
                    }}
                ></div>
                <div className="text-center z-10">
                    <p className="text-red-600 mb-4">Error: {error}</p>
                    <button
                        onClick={fetchAllGalleryImages}
                        className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    if (galleryImages.length === 0) {
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
                            onClick={() => navigate(-1)}
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
                            All Gallery Images
                        </p>
                    </div>
                </div>

                <div className="flex items-center justify-center min-h-[60vh] pt-24">
                    <div className="text-center">
                        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary-100 flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 text-primary-600">
                                <path fillRule="evenodd" d="M1.5 6a2.25 2.25 0 012.25-2.25h16.5A2.25 2.25 0 0122.5 6v12a2.25 2.25 0 01-2.25 2.25H3.75A2.25 2.25 0 011.5 18V6zM3 16.06V18c0 .414.336.75.75.75h16.5A.75.75 0 0021 18v-1.94l-2.69-2.689a1.5 1.5 0 00-2.12 0l-.88.879.97.969a.75.75 0 11-1.06 1.06l-5.16-5.159a1.5 1.5 0 00-2.12 0L3 16.06zm12.725-5.065a1.5 1.5 0 00-2.12 0l-1.58 1.58a.75.75 0 01-1.06-1.06l1.58-1.58a3 3 0 014.24 0l1.293 1.293a.75.75 0 01-1.06 1.06l-1.293-1.293z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-semibold text-primary-800 mb-2">No Gallery Images</h3>
                        <p className="text-primary-600">There are no images in the gallery yet.</p>
                    </div>
                </div>
            </div>
        );
    }

    const groupedImages = groupImagesByDate();

    return (
        <PhotoProvider>
            <div className="p-5 relative min-h-screen">
                <div
                    className="fixed top-0 left-0 w-[calc(100%-40px)] mx-auto right-0 py-5 pb-2 bg-background border-b border-primary-700"
                    style={{
                        backgroundImage: "url(/static/images/backgroundLight.png)",
                        backgroundRepeat: "repeat",
                        backgroundSize: 200,
                    }}
                >
                    <div className="flex items-center justify-start">
                        <button
                            onClick={() => navigate(-1)}
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
                            All Gallery Images
                        </p>
                    </div>
                </div>

                {/* Gallery Grid */}
                <div className="pt-14 pb-20">
                    {Object.entries(groupedImages).map(([dateKey, images]) => (
                        <div key={dateKey} className="mb-8">
                            <h2 className="font-haspss text-2xl text-primary-700 mb-2">
                                {formatDate(dateKey)}
                            </h2>
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
                                {images.map((image) => (
                                    <div key={image.id} className="aspect-square rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow bg-white">
                                        <PhotoView src={import.meta.env.VITE_BACKEND_URL + image.image}>
                                            <img
                                                src={import.meta.env.VITE_BACKEND_URL + image.image}
                                                alt="Gallery Image"
                                                className="w-full h-full object-cover cursor-pointer hover:scale-105 transition-transform duration-300"
                                                onError={(e) => {
                                                    e.target.src = "/placeholder-image.jpg";
                                                }}
                                            />
                                        </PhotoView>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </PhotoProvider>
    );
};

export default GalleryAll;