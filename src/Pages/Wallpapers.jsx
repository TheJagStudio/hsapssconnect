import React, { useState, useEffect } from "react";
import { PhotoProvider, PhotoView } from "react-photo-view";
import "react-photo-view/dist/react-photo-view.css";
import { useNavigate } from "react-router-dom";

const Wallpapers = () => {
    const [wallpapers, setWallpapers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [downloadingId, setDownloadingId] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchWallpapers();
    }, []);

    const fetchWallpapers = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/wallpaper/`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${JSON.parse(localStorage.getItem("hsapss_tokens"))?.access_token}`,
                },
            });

            if (!response.ok) {
                throw new Error("Failed to fetch wallpapers");
            }

            const data = await response.json();
            setWallpapers(data.wallpaper || []);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const downloadImage = async (imageUrl, imageName, wallpaperId) => {
        setDownloadingId(wallpaperId);
        try {
            const response = await fetch(imageUrl, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${JSON.parse(localStorage.getItem("hsapss_tokens"))?.access_token}`,
                },
            });
            
            if (!response.ok) {
                throw new Error('Failed to fetch image');
            }
            
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = imageName || 'wallpaper.jpg';
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
            
            // Show success feedback
            setTimeout(() => {
                setDownloadingId(null);
            }, 1000);
        } catch (error) {
            console.error('Download failed:', error);
            alert('Failed to download image. Please try again.');
            setDownloadingId(null);
        }
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
                    <p className="mt-4 text-primary-600">Loading wallpapers...</p>
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
                        onClick={fetchWallpapers}
                        className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    if (wallpapers.length === 0) {
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
                            Wallpapers
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
                        <h3 className="text-lg font-semibold text-primary-800 mb-2">No Wallpapers Available</h3>
                        <p className="text-primary-600">There are no wallpapers available yet.</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <PhotoProvider
            toolbarRender={({ images, index }) => {
                const currentWallpaper = images[index] ?
                    wallpapers.find(w => import.meta.env.VITE_BACKEND_URL + w.image === images[index].src) : null;

                if (!currentWallpaper) return null;

                return (
                    <button onClick={() => downloadImage(import.meta.env.VITE_BACKEND_URL + currentWallpaper.image, `wallpaper-${currentWallpaper.id}.jpg`, currentWallpaper.id)} className="" title="Download wallpaper" disabled={downloadingId !== null}>
                        {downloadingId === currentWallpaper.id ? (
                            <div className="w-7 h-7 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        ) : (
                            <div className="flex flex-row gap-1 mt-1 items-center text-black bg-white rounded-full pl-2 pr-4 py-0.5 hover:bg-gray-100 border border-gray-300">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 rotate-90">
                                    <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm4.28 10.28a.75.75 0 000-1.06l-3-3a.75.75 0 10-1.06 1.06l1.72 1.72H9a.75.75 0 000 1.5h5.44l-1.72 1.72a.75.75 0 101.06 1.06l3-3z" clipRule="evenodd" />
                                </svg>
                                Download
                            </div>
                        )}
                    </button>
                );
            }}
        >
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
                            Wallpapers
                        </p>
                    </div>
                </div>

                {/* Wallpapers Grid */}
                <div className="pt-14 pb-20">
                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
                        {wallpapers.map((wallpaper) => (
                            <div key={wallpaper.id} className="rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow bg-white">
                                <PhotoView src={import.meta.env.VITE_BACKEND_URL + wallpaper.image}>
                                    <img
                                        src={import.meta.env.VITE_BACKEND_URL + wallpaper.image}
                                        alt="Wallpaper"
                                        className="w-full h-full object-contain cursor-pointer hover:scale-105 transition-transform duration-300"
                                        onError={(e) => {
                                            e.target.src = "/placeholder-image.jpg";
                                        }}
                                    />
                                </PhotoView>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </PhotoProvider>
    );
};

export default Wallpapers;