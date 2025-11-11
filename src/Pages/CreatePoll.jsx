import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAtom } from "jotai";
import { userAtom } from "../Variable";
import PollCreateForm from "../Components/PollCreateForm";
import { ChevronLeft } from "lucide-react";

const CreatePoll = () => {
    const navigate = useNavigate();
    const [user] = useAtom(userAtom);
    const [showModal, setShowModal] = useState(true);

    // Check if user is authorized
    const isAuthorized = user && (user.user_type === "superadmin" || user.user_type === "regionadmin" || user.user_type === "karyakarta");

    if (!isAuthorized) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4 bg-background">
                <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full text-center">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                    </div>
                    <h2 className="text-xl font-semibold text-gray-800 mb-2">Access Denied</h2>
                    <p className="text-gray-600 mb-4">You don't have permission to create polls.</p>
                    <button onClick={() => navigate("/")} className="px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg transition-colors">
                        Go to Home
                    </button>
                </div>
            </div>
        );
    }

    const handleSuccess = () => {
        // Poll created successfully, navigate back to home
        setShowModal(false);
        navigate("/");
    };

    const handleClose = () => {
        // User cancelled, navigate back
        setShowModal(false);
        navigate("/");
    };

    return (
        <div className="min-h-screen bg-background">
            {/* Poll Creation Form Modal */}
            {showModal && <PollCreateForm onClose={handleClose} onSuccess={handleSuccess} />}
        </div>
    );
};

export default CreatePoll;