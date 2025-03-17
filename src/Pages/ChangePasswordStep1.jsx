import React, { useState } from "react";

const ChangePasswordStep1 = ({ handleNext }) => {
    const [phone, setPhone] = useState("");
    const [otp, setOtp] = useState("");
    const [otpSent, setOtpSent] = useState(false);
    const [error, setError] = useState("");

    const handleSendOTP = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/send-otp/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ phone }),
            });
            const data = await response.json();
            if (data.status === "success") {
                setOtpSent(true);
                setError("");
            } else {
                setError(data.error);
            }
        } catch (error) {
            setError("Failed to send OTP");
        }
    };

    const handleVerifyOTP = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/verify-otp/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ phone, otp }),
            });
            const data = await response.json();
            if (data.status === "success") {
                handleNext(phone);
            } else {
                setError(data.error);
            }
        } catch (error) {
            setError("Failed to verify OTP");
        }
    };

    return (
        <div className="p-8 rounded-lg w-full">
            <div className="mb-4">
                <label className="block text-primary-700 text-sm font-bold mb-2" htmlFor="phone">
                    Phone Number
                </label>
                <input
                    className="border rounded-lg shadow-inner w-full py-2 px-3 text-primary-700"
                    id="phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Enter your phone number"
                />
            </div>
            {otpSent && (
                <div className="mb-4">
                    <label className="block text-primary-700 text-sm font-bold mb-2" htmlFor="otp">
                        OTP
                    </label>
                    <input
                        className="border rounded-lg shadow-inner w-full py-2 px-3 text-primary-700"
                        id="otp"
                        type="text"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        placeholder="Enter OTP"
                    />
                </div>
            )}
            {error && <div className="text-red-500 text-sm mb-4">{error}</div>}
            <button
                className="bg-primary-500 hover:bg-primary-700 text-white font-bold py-2 px-4 rounded-lg w-full"
                onClick={otpSent ? handleVerifyOTP : handleSendOTP}
            >
                {otpSent ? "Verify OTP" : "Send OTP"}
            </button>
        </div>
    );
};

export default ChangePasswordStep1;
