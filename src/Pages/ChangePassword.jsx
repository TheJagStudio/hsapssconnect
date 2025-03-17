import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ChangePasswordStep1 from "./ChangePasswordStep1";
import ChangePasswordStep2 from "./ChangePasswordStep2";

const ChangePassword = () => {
    const navigate = useNavigate();
    const [currentStep, setCurrentStep] = useState(1);
    const [phone, setPhone] = useState("");

    const handleNext = (phoneNumber) => {
        setPhone(phoneNumber);
        setCurrentStep(2);
    };

    return (
        <div className="relative w-full min-h-screen bg-background" style={{ backgroundImage: "url(/static/images/backgroundLight.png)", backgroundRepeat: "repeat", backgroundSize: 200 }}>
            <div className="p-4 fixed top-0 left-0 w-full bg-white/80 backdrop-blur-lg z-50 rounded-b-xl custom-shadow flex items-center justify-start gap-3">
                <button
                    onClick={() => {
                        navigate("/");
                    }}
                    className="p-2 rounded-full"
                >
                    <svg className="w-6 h-6 text-primary-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                </button>
                <p className="text-4xl text-primary-700 font-haspss w-full">Change Password</p>
            </div>
            <div className="pt-20">
                {currentStep === 1 && <ChangePasswordStep1 handleNext={handleNext} />}
                {currentStep === 2 && <ChangePasswordStep2 phone={phone} />}
            </div>
        </div>
    );
};

export default ChangePassword;