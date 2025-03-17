import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const ChangePasswordStep2 = ({ phone }) => {
    const navigate = useNavigate();
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = async () => {
        if (newPassword !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/change-password/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${JSON.parse(localStorage.getItem("hsapss_tokens"))?.access_token}`,
                },
                body: JSON.stringify({ phone, new_password: newPassword }),
            });
            const data = await response.json();
            if (data.status === "success") {
                alert("Password changed successfully");
                navigate("/login");
            } else {
                setError(data.error);
            }
        } catch (error) {
            setError("Failed to change password");
        }
    };

    return (
        <div className="p-8 rounded-lg w-full">
            <div className="mb-4">
                <label className="block text-primary-700 text-sm font-bold mb-2" htmlFor="newPassword">
                    New Password
                </label>
                <div className="relative">
                    <input
                        className="border rounded-lg shadow-inner w-full py-2 px-3 text-primary-700"
                        id="newPassword"
                        type={showPassword ? "text" : "password"}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Enter new password"
                    />
                    <button
                        className="absolute right-3 top-2 text-primary-600"
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                    >
                        {showPassword ? "Hide" : "Show"}
                    </button>
                </div>
            </div>
            <div className="mb-4">
                <label className="block text-primary-700 text-sm font-bold mb-2" htmlFor="confirmPassword">
                    Confirm Password
                </label>
                <input
                    className="border rounded-lg shadow-inner w-full py-2 px-3 text-primary-700"
                    id="confirmPassword"
                    type={showPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm new password"
                />
            </div>
            {error && <div className="text-red-500 text-sm mb-4">{error}</div>}
            <button
                className="bg-primary-500 hover:bg-primary-700 text-white font-bold py-2 px-4 rounded-lg w-full"
                onClick={handleSubmit}
            >
                Change Password
            </button>
        </div>
    );
};

export default ChangePasswordStep2;
