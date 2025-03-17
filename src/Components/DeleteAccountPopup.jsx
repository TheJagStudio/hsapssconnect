import { useState } from "react";
import { useNavigate } from "react-router-dom";

function DeleteAccountPopup({ isOpen, onClose }) {
    const navigate = useNavigate();

    if (!isOpen) {
        return null;
    }

    const handleDeleteAccount = async () => {
        navigate("/logout");
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-[999]">
            <div className="w-full h-full absolute" onClick={onClose}></div>
            <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 relative">
                <button 
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                    onClick={onClose}
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                <div className="text-center mb-6">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 flex items-center justify-center">
                        <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900">Delete Account</h2>
                    <p className="mt-2 text-gray-600">Are you sure you want to delete your account? This action cannot be undone.</p>
                </div>

                <div className="flex flex-col space-y-3">
                    <button
                        onClick={handleDeleteAccount}
                        className="w-full py-3 px-4 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors"
                    >
                        Yes, Delete My Account
                    </button>
                    <button
                        onClick={onClose}
                        className="w-full py-3 px-4 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
}

export default DeleteAccountPopup;
