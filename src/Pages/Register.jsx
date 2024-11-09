import React, { useState } from "react";
import Step1 from "./Step1";
import Step2 from "./Step2";

const Register = () => {
    const [currentStep, setCurrentStep] = useState(1);
    const [formData, setFormData] = useState({});

    const handleNext = (data) => {
        setFormData(data);
        setCurrentStep(2);
    };

    const handleRegister = (data) => {
        // Handle registration logic here (e.g., send data to API)
        console.log("Registration data:", data);
    };

    const handleBack = () => {
        setCurrentStep(1);
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-background/90" style={{ backgroundImage: "url(/static/images/background.png)", backgroundRepeat: "repeat", backgroundSize: 200, backgroundBlendMode: "lighten" }}>
            {currentStep === 1 && <Step1 handleNext={handleNext} />}
            {currentStep === 2 && <Step2 formData={formData} handleRegister={handleRegister} handleBack={handleBack} />}
        </div>
    );
};

export default Register;
