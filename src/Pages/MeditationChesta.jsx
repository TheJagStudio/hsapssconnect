import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../Components/Navbar";

const MeditationChesta = () => {
    const navigate = useNavigate();
    const [currentStep, setCurrentStep] = useState(0);
    const [isActive, setIsActive] = useState(false);
    const [breathCount, setBreathCount] = useState(0);

    const chestaSteps = [
        {
            title: "Preparation",
            description: "Sit comfortably with your back straight",
            duration: 30,
            icon: "🧘"
        },
        {
            title: "Centering",
            description: "Take three deep breaths to center yourself",
            duration: 45,
            icon: "🌟"
        },
        {
            title: "Chesta Begins",
            description: "Focus on the sacred chesta with Swamiji",
            duration: 120,
            icon: "🙏"
        },
        {
            title: "Deep Meditation",
            description: "Immerse yourself in the divine experience",
            duration: 180,
            icon: "✨"
        },
        {
            title: "Gratitude",
            description: "Express gratitude for the experience",
            duration: 60,
            icon: "🌸"
        }
    ];

    useEffect(() => {
        let timer;
        if (isActive && currentStep < chestaSteps.length) {
            timer = setTimeout(() => {
                if (currentStep === 2) { // During chesta meditation
                    setBreathCount(prev => prev + 1);
                }
                setCurrentStep(prev => prev + 1);
            }, chestaSteps[currentStep]?.duration * 1000 || 1000);
        }
        return () => clearTimeout(timer);
    }, [isActive, currentStep]);

    const startChesta = () => {
        setIsActive(true);
        setCurrentStep(0);
        setBreathCount(0);
    };

    const resetChesta = () => {
        setIsActive(false);
        setCurrentStep(0);
        setBreathCount(0);
    };

    const getCurrentProgress = () => {
        return ((currentStep + 1) / chestaSteps.length) * 100;
    };

    return (
        <div className="min-h-screen pb-20">
            <Navbar />
            <div className="pt-20 px-4">
                <div className="max-w-2xl mx-auto">
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
                        <div className="text-center mb-8">
                            <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
                                Chesta with Swamiji
                            </h1>
                            <p className="text-gray-600 dark:text-gray-300">
                                A sacred chesta meditation experience
                            </p>
                        </div>

                        {/* Progress Bar */}
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-8">
                            <div 
                                className="bg-purple-500 h-2 rounded-full transition-all duration-500"
                                style={{ width: `${getCurrentProgress()}%` }}
                            ></div>
                        </div>

                        {currentStep < chestaSteps.length ? (
                            <div className="text-center mb-8">
                                <div className="text-6xl mb-4">{chestaSteps[currentStep].icon}</div>
                                <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-2">
                                    {chestaSteps[currentStep].title}
                                </h2>
                                <p className="text-gray-600 dark:text-gray-300 mb-4">
                                    {chestaSteps[currentStep].description}
                                </p>
                                {currentStep === 2 && (
                                    <p className="text-sm text-purple-600 dark:text-purple-400">
                                        Breath cycles completed: {breathCount}
                                    </p>
                                )}
                            </div>
                        ) : (
                            <div className="text-center mb-8">
                                <div className="text-6xl mb-4">🌺</div>
                                <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-2">
                                    Chesta Complete
                                </h2>
                                <p className="text-gray-600 dark:text-gray-300">
                                    Your sacred chesta meditation is complete. Feel the divine presence within.
                                </p>
                            </div>
                        )}

                        <div className="flex justify-center space-x-4 mb-8">
                            {!isActive && currentStep === 0 && (
                                <button
                                    onClick={startChesta}
                                    className="bg-purple-500 hover:bg-purple-600 text-white px-8 py-3 rounded-lg font-semibold transition-colors duration-200"
                                >
                                    Begin Chesta
                                </button>
                            )}
                            {isActive && currentStep < chestaSteps.length && (
                                <button
                                    onClick={resetChesta}
                                    className="bg-red-500 hover:bg-red-600 text-white px-8 py-3 rounded-lg font-semibold transition-colors duration-200"
                                >
                                    Stop Chesta
                                </button>
                            )}
                            {currentStep >= chestaSteps.length && (
                                <button
                                    onClick={resetChesta}
                                    className="bg-green-500 hover:bg-green-600 text-white px-8 py-3 rounded-lg font-semibold transition-colors duration-200"
                                >
                                    Start New Chesta
                                </button>
                            )}
                        </div>

                        <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-6">
                            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">
                                About Chesta Meditation
                            </h3>
                            <p className="text-gray-700 dark:text-gray-300 text-sm">
                                Chesta is a sacred form of meditation that involves mindful breathing and spiritual contemplation. 
                                This practice helps connect with the divine presence of Swamiji through rhythmic breathing patterns 
                                and focused awareness.
                            </p>
                        </div>

                        <div className="text-center mt-8">
                            <button
                                onClick={() => navigate("/")}
                                className="text-purple-500 hover:text-purple-600 font-medium"
                            >
                                ← Back to Home
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MeditationChesta;