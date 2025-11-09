import React, { useState, useEffect } from "react";
import { userAtom } from "../Variable";
import { useAtom } from "jotai";
import { PhotoProvider, PhotoView } from "react-photo-view";
import "react-photo-view/dist/react-photo-view.css";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

const Gallery = () => {
    const [galleryImages, setGalleryImages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [user] = useAtom(userAtom);
    const [showUploadForm, setShowUploadForm] = useState(false);

    useEffect(() => {
        fetchGalleryImages();
    }, []);

    const fetchGalleryImages = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/gallery/`, {
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

    const handleUploadSuccess = () => {
        setShowUploadForm(false);
        fetchGalleryImages();
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        if (date.toDateString() === today.toDateString()) {
            return "Today";
        } else if (date.toDateString() === yesterday.toDateString()) {
            return "Yesterday";
        } else {
            return date.toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
            });
        }
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
        return null; // Hide gallery while loading
    }

    if (error) {
        return null; // Hide gallery on error
    }

    // Show gallery for admins even when no images exist so they can upload
    const isAdmin = user?.user_type === "superadmin" || user?.user_type === "regionadmin";
    if (galleryImages.length === 0 && !isAdmin) {
        return null; // Hide gallery when no images for non-admin users
    }

    const groupedImages = groupImagesByDate();

    return (
        <PhotoProvider>
            <div className="p-3">
                <div className="flex justify-between items-center mb-4">
                    <p className="font-haspss text-3xl text-primary-700">Temple Gallery</p>
                    {(user?.user_type === "superadmin" || user?.user_type === "regionadmin") && (
                        <button onClick={() => setShowUploadForm(true)} className="px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg transition-all text-sm font-medium">
                            Upload Images
                        </button>
                    )}
                </div>

                {showUploadForm && <GalleryUploadForm onClose={() => setShowUploadForm(false)} onUploadSuccess={handleUploadSuccess} />}

                {galleryImages.length > 0 ? (
                    <div className="space-y-4">
                        {Object.entries(groupedImages).map(([dateKey, images]) => (
                            <div key={dateKey} className="bg-white rounded-lg shadow-md p-3 mt-3">
                                <div className="flex items-center justify-start gap-3 mb-4">
                                    <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-primary-600">
                                            <path fillRule="evenodd" d="M1.5 6a2.25 2.25 0 012.25-2.25h16.5A2.25 2.25 0 0122.5 6v12a2.25 2.25 0 01-2.25 2.25H3.75A2.25 2.25 0 011.5 18V6zM3 16.06V18c0 .414.336.75.75.75h16.5A.75.75 0 0021 18v-1.94l-2.69-2.689a1.5 1.5 0 00-2.12 0l-.88.879.97.969a.75.75 0 11-1.06 1.06l-5.16-5.159a1.5 1.5 0 00-2.12 0L3 16.06zm12.725-5.065a1.5 1.5 0 00-2.12 0l-1.58 1.58a.75.75 0 01-1.06-1.06l1.58-1.58a3 3 0 014.24 0l1.293 1.293a.75.75 0 01-1.06 1.06l-1.293-1.293z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="text-primary-800 font-semibold">Smruti {formatDate(dateKey)}</p>
                                        <p className="text-sm text-primary-600">
                                            {images.length} {images.length === 1 ? "image" : "images"}
                                        </p>
                                    </div>
                                </div>

                                <Swiper
                                    modules={[Autoplay, Pagination, Navigation]}
                                    spaceBetween={10}
                                    slidesPerView={"auto"}
                                    autoplay={{
                                        delay: 3000,
                                        disableOnInteraction: false,
                                    }}
                                    loop={true}
                                    pagination={{
                                        clickable: true,
                                        dynamicBullets: true,
                                    }}
                                    navigation={false}
                                    className="mySwiper"
                                >
                                    {images.map((image) => (
                                        <SwiperSlide key={image.id}>
                                            <div className="bg-primary-50 w-fit rounded-lg overflow-hidden border border-primary-200">
                                                <PhotoView src={import.meta.env.VITE_BACKEND_URL + image.image}>
                                                    <img
                                                        src={import.meta.env.VITE_BACKEND_URL + image.image}
                                                        alt="Gallery Image"
                                                        className="w-32 md:w-64 h-auto aspect-square object-cover cursor-pointer hover:opacity-90 transition-opacity"
                                                        onError={(e) => {
                                                            e.target.src = "/placeholder-image.jpg";
                                                        }}
                                                    />
                                                </PhotoView>
                                            </div>
                                        </SwiperSlide>
                                    ))}
                                </Swiper>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="bg-white rounded-lg shadow-md p-6 mt-3 text-center">
                        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary-100 flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 text-primary-600">
                                <path fillRule="evenodd" d="M1.5 6a2.25 2.25 0 012.25-2.25h16.5A2.25 2.25 0 0122.5 6v12a2.25 2.25 0 01-2.25 2.25H3.75A2.25 2.25 0 011.5 18V6zM3 16.06V18c0 .414.336.75.75.75h16.5A.75.75 0 0021 18v-1.94l-2.69-2.689a1.5 1.5 0 00-2.12 0l-.88.879.97.969a.75.75 0 11-1.06 1.06l-5.16-5.159a1.5 1.5 0 00-2.12 0L3 16.06zm12.725-5.065a1.5 1.5 0 00-2.12 0l-1.58 1.58a.75.75 0 01-1.06-1.06l1.58-1.58a3 3 0 014.24 0l1.293 1.293a.75.75 0 01-1.06 1.06l-1.293-1.293z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-semibold text-primary-800 mb-2">No Gallery Images</h3>
                        <p className="text-primary-600 mb-4">There are no images in the gallery yet. Be the first to add some temple photos!</p>
                        {(user?.user_type === "superadmin" || user?.user_type === "regionadmin") && (
                            <button onClick={() => setShowUploadForm(true)} className="px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg transition-all text-sm font-medium">
                                Upload First Image
                            </button>
                        )}
                    </div>
                )}
            </div>
        </PhotoProvider>
    );
};

const GalleryUploadForm = ({ onClose, onUploadSuccess }) => {
    const [images, setImages] = useState([]);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (images.length === 0) {
            setError("Please select at least one image");
            return;
        }

        setUploading(true);
        setError("");

        const formData = new FormData();
        images.forEach((image) => {
            formData.append("images", image);
        });

        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/gallery/upload/`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${JSON.parse(localStorage.getItem("hsapss_tokens"))?.access_token}`,
                },
                body: formData,
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.message || "Upload failed");
            }

            onUploadSuccess();
        } catch (err) {
            setError(err.message);
        } finally {
            setUploading(false);
        }
    };

    const handleImagesChange = (e) => {
        const files = Array.from(e.target.files);
        const validFiles = files.filter((file) => file.type.startsWith("image/"));
        if (validFiles.length !== files.length) {
            setError("Please select only valid image files");
        }
        setImages(validFiles);
    };

    const removeImage = (index) => {
        setImages(images.filter((_, i) => i !== index));
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-screen overflow-y-auto">
                <div className="p-6 border-b border-gray-200">
                    <div className="flex justify-between items-center">
                        <h3 className="text-xl font-semibold text-gray-800">Upload Gallery Images</h3>
                        <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">{error}</div>}

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Select Images *</label>
                        <input type="file" accept="image/*" multiple onChange={handleImagesChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500" required />
                        <p className="text-xs text-gray-500 mt-1">Select as many images as you want</p>
                    </div>

                    {images.length > 0 && (
                        <div className="mt-4">
                            <p className="text-sm font-medium text-gray-700 mb-2">Selected Images ({images.length}):</p>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                                {images.map((image, index) => (
                                    <div key={index} className="relative group">
                                        <img src={URL.createObjectURL(image)} alt={image.name} className="w-full h-20 object-cover rounded border" />
                                        <button type="button" onClick={() => removeImage(index)} className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity">
                                            ×
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="flex justify-end space-x-3 pt-4">
                        <button type="button" onClick={onClose} className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50" disabled={uploading}>
                            Cancel
                        </button>
                        <button type="submit" className="px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600 disabled:opacity-50" disabled={uploading || images.length === 0}>
                            {uploading ? "Uploading..." : `Upload ${images.length} Images`}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Gallery;
