import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../Components/Navbar";

const MeditationShikshapatri = () => {
    const navigate = useNavigate();
    const [currentSlok, setCurrentSlok] = useState(0);
    const [isMeditating, setIsMeditating] = useState(false);
    const [meditationTime, setMeditationTime] = useState(0);

    const shikshapatriSloks = [
        {
            id: 1,
            title: "Slok 1",
            verse: "Shree Krishna Bhagwan is the supreme God, and all other deities reside within him.",
            meaning: "This establishes the supremacy of Lord Krishna as the ultimate divine being.",
            reflection: "Contemplate on the oneness of the divine presence.",
            duration: 90,
            icon: "1️⃣"
        },
        {
            id: 2,
            title: "Slok 2",
            verse: "All souls are eternal and distinct from the physical body.",
            meaning: "Our true nature is spiritual, not material.",
            reflection: "Reflect on your eternal spiritual identity.",
            duration: 90,
            icon: "2️⃣"
        },
        {
            id: 3,
            title: "Slok 3",
            verse: "Liberation is attained through devotion to God combined with righteousness.",
            meaning: "Both bhakti (devotion) and dharma (righteousness) are essential for spiritual liberation.",
            reflection: "How can I strengthen both my devotion and righteousness?",
            duration: 90,
            icon: "3️⃣"
        },
        {
            id: 4,
            title: "Slok 4",
            verse: "One should observe non-violence, truthfulness, and celibacy.",
            meaning: "These ethical principles form the foundation of spiritual life.",
            reflection: "Which of these principles can I focus on improving today?",
            duration: 90,
            icon: "4️⃣"
        },
        {
            id: 5,
            title: "Slok 5",
            verse: "One should regularly study the scriptures and associate with holy men.",
            meaning: "Spiritual knowledge and saintly association are vital for spiritual progress.",
            reflection: "How can I deepen my scriptural study and holy association?",
            duration: 90,
            icon: "5️⃣"
        }
    ];

    useEffect(() => {
        let interval;
        if (isMeditating && meditationTime < shikshapatriSloks[currentSlok]?.duration) {
            interval = setInterval(() => {
                setMeditationTime(prev => prev + 1);
            }, 1000);
        } else if (meditationTime >= shikshapatriSloks[currentSlok]?.duration) {
            setIsMeditating(false);
        }
        return () => clearInterval(interval);
    }, [isMeditating, meditationTime, currentSlok]);

    const startMeditation = () => {
        setIsMeditating(true);
        setMeditationTime(0);
    };

    const stopMeditation = () => {
        setIsMeditating(false);
    };

    const nextSlok = () => {
        if (currentSlok < shikshapatriSloks.length - 1) {
            setCurrentSlok(prev => prev + 1);
            setIsMeditating(false);
            setMeditationTime(0);
        }
    };

    const previousSlok = () => {
        if (currentSlok > 0) {
            setCurrentSlok(prev => prev - 1);
            setIsMeditating(false);
            setMeditationTime(0);
        }
    };

    const formatTime = (seconds) => {
        return `${seconds.toString().padStart(2, '0')}:00`;
    };

    const getMeditationProgress = () => {
        const totalDuration = shikshapatriSloks[currentSlok]?.duration || 90;
        return (meditationTime / totalDuration) * 100;
    };

    return (
        <div className="min-h-screen pb-20">
            <Navbar />
            <div className="pt-20 px-4">
                <div className="max-w-2xl mx-auto">
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
                        <div className="text-center mb-8">
                            <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
                                5 Slok from Shikshapatri
                            </h1>
                            <p className="text-gray-600 dark:text-gray-300">
                                Sacred verses for meditation and contemplation
                            </p>
                        </div>

                        {/* Progress Indicator */}
                        <div className="flex justify-center mb-6">
                            {shikshapatriSloks.map((slok, index) => (
                                <div
                                    key={slok.id}
                                    className={`w-3 h-3 rounded-full mx-1 ${
                                        index === currentSlok
                                            ? "bg-indigo-500"
                                            : index < currentSlok
                                            ? "bg-indigo-300"
                                            : "bg-gray-300 dark:bg-gray-600"
                                    }`}
                                ></div>
                            ))}
                        </div>

                        {/* Current Slok */}
                        <div className="text-center mb-8">
                            <div className="text-4xl mb-4">{shikshapatriSloks[currentSlok].icon}</div>
                            <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">
                                {shikshapatriSloks[currentSlok].title}
                            </h2>
                            
                            <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-lg p-6 mb-6">
                                <div className="mb-4">
                                    <h3 className="text-lg font-semibold text-indigo-800 dark:text-indigo-300 mb-2">
                                        Verse:
                                    </h3>
                                    <p className="text-gray-800 dark:text-gray-200 text-lg leading-relaxed">
                                        "{shikshapatriSloks[currentSlok].verse}"
                                    </p>
                                </div>
                                
                                <div className="mb-4">
                                    <h3 className="text-lg font-semibold text-indigo-800 dark:text-indigo-300 mb-2">
                                        Meaning:
                                    </h3>
                                    <p className="text-gray-700 dark:text-gray-300">
                                        {shikshapatriSloks[currentSlok].meaning}
                                    </p>
                                </div>

                                <div>
                                    <h3 className="text-lg font-semibold text-indigo-800 dark:text-indigo-300 mb-2">
                                        Reflection:
                                    </h3>
                                    <p className="text-indigo-600 dark:text-indigo-400 font-medium">
                                        {shikshapatriSloks[currentSlok].reflection}
                                    </p>
                                </div>
                            </div>

                            {/* Meditation Timer */}
                            {isMeditating && (
                                <div className="mb-4">
                                    <div className="text-xl font-mono text-gray-800 dark:text-white mb-2">
                                        {formatTime(meditationTime)}
                                    </div>
                                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                        <div
                                            className="bg-indigo-500 h-2 rounded-full transition-all duration-1000"
                                            style={{ width: `${getMeditationProgress()}%` }}
                                        ></div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Control Buttons */}
                        <div className="flex justify-center space-x-4 mb-8">
                            <button
                                onClick={previousSlok}
                                disabled={currentSlok === 0}
                                className="bg-gray-500 hover:bg-gray-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-6 py-2 rounded-lg font-semibold transition-colors duration-200"
                            >
                                Previous
                            </button>
                            
                            {!isMeditating ? (
                                <button
                                    onClick={startMeditation}
                                    className="bg-indigo-500 hover:bg-indigo-600 text-white px-8 py-3 rounded-lg font-semibold transition-colors duration-200"
                                >
                                    Begin Meditation
                                </button>
                            ) : (
                                <button
                                    onClick={stopMeditation}
                                    className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg font-semibold transition-colors duration-200"
                                >
                                    Stop Meditation
                                </button>
                            )}
                            
                            <button
                                onClick={nextSlok}
                                disabled={currentSlok === shikshapatriSloks.length - 1}
                                className="bg-gray-500 hover:bg-gray-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-6 py-2 rounded-lg font-semibold transition-colors duration-200"
                            >
                                Next
                            </button>
                        </div>

                        {/* Instructions */}
                        <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-lg p-6">
                            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">
                                How to Meditate on Shikshapatri
                            </h3>
                            <ul className="text-gray-700 dark:text-gray-300 space-y-2 text-sm">
                                <li>• Read each verse slowly and contemplatively</li>
                                <li>• Understand the meaning of the teaching</li>
                                <li>• Reflect on how it applies to your life</li>
                                <li>• Meditate on the reflection question</li>
                                <li>• Let the wisdom guide your actions</li>
                                <li>• Take your time - spiritual understanding unfolds gradually</li>
                            </ul>
                        </div>

                        <div className="text-center mt-8">
                            <button
                                onClick={() => navigate("/")}
                                className="text-indigo-500 hover:text-indigo-600 font-medium"
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

export default MeditationShikshapatri;