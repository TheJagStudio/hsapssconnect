import React, { useState, useEffect } from "react";
import { useAtom } from "jotai";
import { userAtom } from "../Variable";
import { X, Upload, Plus, Trash2 } from "lucide-react";

const PollEditForm = ({ pollData, onClose, onSuccess }) => {
    const [user] = useAtom(userAtom);

    // Form state - Initialize with existing poll data
    const [question, setQuestion] = useState(pollData?.question || "");
    const [options, setOptions] = useState(pollData?.options?.map(opt => opt.optionText) || ["", ""]);
    const [image, setImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(pollData?.image ? `${import.meta.env.VITE_BACKEND_URL}${pollData.image}` : null);
    const [removeImage, setRemoveImage] = useState(false);

    // UI state
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [showSuccess, setShowSuccess] = useState(false);

    // Handle image upload
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                setErrors({ ...errors, image: "Image size should be less than 5MB" });
                return;
            }
            setImage(file);
            setImagePreview(URL.createObjectURL(file));
            setRemoveImage(false);
            setErrors({ ...errors, image: "" });
        }
    };

    // Handle option change
    const handleOptionChange = (index, value) => {
        const newOptions = [...options];
        newOptions[index] = value;
        setOptions(newOptions);
    };

    // Add new option
    const addOption = () => {
        if (options.length < 10) {
            setOptions([...options, ""]);
        }
    };

    // Remove option
    const removeOption = (index) => {
        if (options.length > 2) {
            const newOptions = options.filter((_, i) => i !== index);
            setOptions(newOptions);
        }
    };

    // Remove existing image
    const handleRemoveImage = () => {
        setImage(null);
        setImagePreview(null);
        setRemoveImage(true);
    };

    // Validate form
    const validateForm = () => {
        const newErrors = {};

        if (!question.trim()) {
            newErrors.question = "Question is required";
        }

        const validOptions = options.filter((opt) => opt.trim());
        if (validOptions.length < 2) {
            newErrors.options = "At least 2 options are required";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Handle form submit
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setIsLoading(true);

        try {
            const formData = new FormData();
            formData.append("question", question);
            formData.append("delivery_type", "all"); // Keep existing participants
            formData.append("remove_image", removeImage);

            // Add valid options
            const validOptions = options.filter((opt) => opt.trim());
            formData.append("options", JSON.stringify(validOptions));

            // Add participants (empty to keep existing)
            formData.append("participants", JSON.stringify([]));

            // Add new image if present
            if (image) {
                formData.append("image", image);
            }

            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/edit-poll/${pollData.id}/`, {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${JSON.parse(localStorage.getItem("hsapss_tokens"))?.access_token}`,
                },
                body: formData,
            });

            const data = await response.json();

            if (data.status === "success") {
                setShowSuccess(true);
                setTimeout(() => {
                    setShowSuccess(false);
                    onSuccess();
                    onClose();
                }, 2000);
            } else {
                setErrors({ submit: data.message || "Failed to update poll" });
            }
        } catch (error) {
            setErrors({ submit: "An error occurred while updating the poll" });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed top-0 left-0 w-screen h-screen z-50 bg-black/75 backdrop-blur-sm animate-fadeIn">
            {/* Success Animation Overlay */}
            {showSuccess && (
                <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-60 animate-scaleIn">
                    <div className="bg-white rounded-full p-6 shadow-2xl">
                        <svg className="w-20 h-20 text-green-500 animate-checkmark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                </div>
            )}

            <div className="fixed top-1/2 left-1/2 w-fit max-w-2xl min-w-96 max-h-[90vh] overflow-y-auto custom-scrollbar transform -translate-x-1/2 -translate-y-1/2 bg-background rounded-2xl shadow-2xl animate-slideUp" style={{ backgroundImage: "url(/static/images/backgroundLight.png)", backgroundRepeat: "repeat", backgroundSize: 200 }}>
                {/* Header */}
                <div className="flex items-center justify-between bg-white p-2">
                    <h2 className="text-2xl font-bold text-primary-700">Edit Poll</h2>
                    <button
                        onClick={onClose}
                        disabled={isLoading}
                        className="p-2 rounded-full hover:bg-gray-200 transition-colors"
                    >
                        <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6">
                    {/* Question */}
                    <div className="mb-4">
                        <label htmlFor="question" className="block text-gray-700 font-semibold mb-2">
                            Poll Question <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            id="question"
                            value={question}
                            onChange={(e) => setQuestion(e.target.value)}
                            disabled={isLoading}
                            placeholder="Enter your poll question..."
                            className={`shadow-inner border rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all resize-none ${errors.question ? "border-red-500" : ""}`}
                            rows={3}
                        />
                        {errors.question && <p className="text-red-500 text-sm mt-1">{errors.question}</p>}
                    </div>

                    {/* Image Upload */}
                    <div className="mb-4">
                        <label className="block text-gray-700 font-semibold mb-2">Poll Image (Optional)</label>
                        <div className="flex items-center gap-4">
                            <label className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg cursor-pointer transition-colors shadow-inner border">
                                <Upload className="w-4 h-4" />
                                <span className="text-sm">{imagePreview ? "Change Image" : "Choose Image"}</span>
                                <input type="file" accept="image/*" onChange={handleImageChange} disabled={isLoading} className="hidden" />
                            </label>
                            {imagePreview && (
                                <div className="relative animate-fadeIn">
                                    <img src={imagePreview} alt="Preview" className="h-20 w-20 object-cover rounded-lg shadow-md" />
                                    <button
                                        type="button"
                                        disabled={isLoading}
                                        onClick={handleRemoveImage}
                                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 hover:scale-110 transition-transform"
                                    >
                                        <X className="w-3 h-3" />
                                    </button>
                                </div>
                            )}
                        </div>
                        {errors.image && <p className="text-red-500 text-sm mt-1">{errors.image}</p>}
                    </div>

                    {/* Options */}
                    <div className="mb-4">
                        <label className="block text-gray-700 font-semibold mb-2">
                            Poll Options <span className="text-red-500">*</span>
                        </label>
                        <div className="mb-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                            <p className="text-sm text-yellow-800">
                                <strong>Warning:</strong> Editing options will reset all existing votes for this poll.
                            </p>
                        </div>
                        <div className="space-y-2">
                            {options.map((option, index) => (
                                <div key={index} className="flex items-center gap-2 animate-fadeIn">
                                    <input
                                        type="text"
                                        value={option}
                                        onChange={(e) => handleOptionChange(index, e.target.value)}
                                        disabled={isLoading}
                                        placeholder={`Option ${index + 1}`}
                                        className="flex-1 shadow-inner border rounded-lg py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
                                    />
                                    {options.length > 2 && (
                                        <button 
                                            type="button" 
                                            onClick={() => removeOption(index)} 
                                            disabled={isLoading}
                                            className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-all hover:scale-110"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                        {options.length < 10 && (
                            <button 
                                type="button" 
                                onClick={addOption} 
                                disabled={isLoading}
                                className="mt-2 flex items-center gap-2 px-3 py-2 text-primary-600 hover:bg-primary-50 rounded-lg transition-colors text-sm font-medium"
                            >
                                <Plus className="w-4 h-4" />
                                Add Option
                            </button>
                        )}
                        {errors.options && <p className="text-red-500 text-sm mt-1">{errors.options}</p>}
                    </div>

                    {/* Participant Info */}
                    <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                        <p className="text-sm text-blue-800">
                            Poll participants cannot be changed during editing. The current participants will remain the same.
                        </p>
                    </div>

                    {/* Error Message */}
                    {errors.submit && (
                        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg animate-shake">
                            <p className="text-red-700 text-sm">❌ {errors.submit}</p>
                        </div>
                    )}

                    {/* Submit Buttons */}
                    <div className="flex items-center justify-between gap-3 pt-4 border-t">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={isLoading}
                            className="bg-white hover:bg-gray-100 border-2 border-gray-300 text-gray-700 py-2.5 px-6 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold py-2.5 px-8 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                            {isLoading ? (
                                <>
                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                    Updating...
                                </>
                            ) : (
                                "Update Poll"
                            )}
                        </button>
                    </div>
                </form>
            </div>

            <style jsx>{`
                @keyframes fadeIn {
                    from {
                        opacity: 0;
                    }
                    to {
                        opacity: 1;
                    }
                }

                @keyframes slideUp {
                    from {
                        opacity: 0;
                        transform: translate(-50%, -40%);
                    }
                    to {
                        opacity: 1;
                        transform: translate(-50%, -50%);
                    }
                }

                @keyframes scaleIn {
                    0% {
                        transform: translate(-50%, -50%) scale(0);
                    }
                    50% {
                        transform: translate(-50%, -50%) scale(1.1);
                    }
                    100% {
                        transform: translate(-50%, -50%) scale(1);
                    }
                }

                @keyframes checkmark {
                    0% {
                        stroke-dasharray: 0 100;
                    }
                    100% {
                        stroke-dasharray: 100 100;
                    }
                }

                @keyframes shake {
                    0%,
                    100% {
                        transform: translateX(0);
                    }
                    25% {
                        transform: translateX(-10px);
                    }
                    75% {
                        transform: translateX(10px);
                    }
                }

                .animate-fadeIn {
                    animation: fadeIn 0.3s ease-out;
                }

                .animate-slideUp {
                    animation: slideUp 0.4s ease-out;
                }

                .animate-scaleIn {
                    animation: scaleIn 0.6s ease-out;
                }

                .animate-checkmark {
                    animation: checkmark 0.6s ease-out forwards;
                }

                .animate-shake {
                    animation: shake 0.4s ease-out;
                }
            `}</style>
        </div>
    );
};

export default PollEditForm;
