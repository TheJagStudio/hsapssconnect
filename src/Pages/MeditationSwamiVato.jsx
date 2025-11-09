import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../Components/Navbar";

const MeditationSwamiVato = () => {
    const navigate = useNavigate();
    const [currentVato, setCurrentVato] = useState(0);
    const [isReading, setIsReading] = useState(false);
    const [readingProgress, setReadingProgress] = useState(0);

    const swamiVato = [
        {
            id: 1,
            title: "First Vato",
            teaching: "In the company of the holy, the mind becomes pure. Associate with those who uplift your spiritual consciousness.",
            reflection: "How can I choose better company today?",
            duration: 60,
            icon: "1️⃣"
        },
        {
            id: 2,
            title: "Second Vato",
            teaching: "Service to humanity is service to God. Every act of kindness is a prayer in action.",
            reflection: "What service can I offer today?",
            duration: 60,
            icon: "2️⃣"
        },
        {
            id: 3,
            title: "Third Vato",
            teaching: "True wisdom lies in humility. The more we learn, the more we realize how little we know.",
            reflection: "How can I practice humility today?",
            duration: 60,
            icon: "3️⃣"
        },
        {
            id: 4,
            title: "Fourth Vato",
            teaching: "Peace comes from within. Do not seek it without. The kingdom of heaven is within you.",
            reflection: "Where do I find my inner peace?",
            duration: 60,
            icon: "4️⃣"
        },
        {
            id: 5,
            title: "Fifth Vato",
            teaching: "Love is the highest form of worship. To love is to know God, for God is love.",
            reflection: "How can I express more love today?",
            duration: 60,
            icon: "5️⃣"
        }
    ];

    useEffect(() => {
        let interval;
        if (isReading && readingProgress < 100) {
            interval = setInterval(() => {
                setReadingProgress(prev => Math.min(prev + 1, 100));
            }, (swamiVato[currentVato]?.duration * 1000) / 100);
        }
        return () => clearInterval(interval);
    }, [isReading, readingProgress, currentVato]);

    const startReading = () => {
        setIsReading(true);
        setReadingProgress(0);
    };

    const nextVato = () => {
        if (currentVato < swamiVato.length - 1) {
            setCurrentVato(prev => prev + 1);
            setIsReading(false);
            setReadingProgress(0);
        }
    };

    const previousVato = () => {
        if (currentVato > 0) {
            setCurrentVato(prev => prev - 1);
            setIsReading(false);
            setReadingProgress(0);
        }
    };

    const resetReading = () => {
        setIsReading(false);
        setReadingProgress(0);
    };

    const completeVato = () => {
        setIsReading(false);
        setReadingProgress(0);
        if (currentVato < swamiVato.length - 1) {
            setCurrentVato(prev => prev + 1);
        }
    };

    return (
        <div className="min-h-screen pb-20">
            <Navbar />
            <div className="pt-20 px-4">
                <div className="max-w-2xl mx-auto">
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
                        <div className="text-center mb-8">
                            <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
                                5 Swami ni Vato
                            </h1>
                            <p className="text-gray-600 dark:text-gray-300">
                                Five sacred teachings for contemplation
                            </p>
                        </div>

                        {/* Progress Indicator */}
                        <div className="flex justify-center mb-6">
                            {swamiVato.map((vato, index) => (
                                <div
                                    key={vato.id}
                                    className={`w-3 h-3 rounded-full mx-1 ${
                                        index === currentVato
                                            ? "bg-orange-500"
                                            : index < currentVato
                                            ? "bg-orange-300"
                                            : "bg-gray-300 dark:bg-gray-600"
                                    }`}
                                ></div>
                            ))}
                        </div>

                        {/* Current Vato */}
                        <div className="text-center mb-8">
                            <div className="text-4xl mb-4">{swamiVato[currentVato].icon}</div>
                            <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">
                                {swamiVato[currentVato].title}
                            </h2>
                            
                            <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-6 mb-6">
                                <p className="text-gray-800 dark:text-gray-200 text-lg leading-relaxed mb-4">
                                    {swamiVato[currentVato].teaching}
                                </p>
                                <p className="text-orange-600 dark:text-orange-400 font-medium">
                                    Reflection: {swamiVato[currentVato].reflection}
                                </p>
                            </div>

                            {/* Reading Progress */}
                            {isReading && (
                                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-4">
                                    <div
                                        className="bg-orange-500 h-2 rounded-full transition-all duration-100"
                                        style={{ width: `${readingProgress}%` }}
                                    ></div>
                                </div>
                            )}
                        </div>

                        {/* Control Buttons */}
                        <div className="flex justify-center space-x-4 mb-8">
                            <button
                                onClick={previousVato}
                                disabled={currentVato === 0}
                                className="bg-gray-500 hover:bg-gray-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-6 py-2 rounded-lg font-semibold transition-colors duration-200"
                            >
                                Previous
                            </button>
                            
                            {!isReading ? (
                                <button
                                    onClick={startReading}
                                    className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-lg font-semibold transition-colors duration-200"
                                >
                                    Read & Contemplate
                                </button>
                            ) : (
                                <button
                                    onClick={resetReading}
                                    className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg font-semibold transition-colors duration-200"
                                >
                                    Stop Reading
                                </button>
                            )}
                            
                            <button
                                onClick={nextVato}
                                disabled={currentVato === swamiVato.length - 1}
                                className="bg-gray-500 hover:bg-gray-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-6 py-2 rounded-lg font-semibold transition-colors duration-200"
                            >
                                Next
                            </button>
                        </div>

                        {/* Complete Button (shown when reading is done) */}
                        {readingProgress === 100 && (
                            <div className="text-center mb-6">
                                <button
                                    onClick={completeVato}
                                    className="bg-green-500 hover:bg-green-600 text-white px-8 py-3 rounded-lg font-semibold transition-colors duration-200"
                                >
                                    Complete & Continue
                                </button>
                            </div>
                        )}

                        {/* Instructions */}
                        <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-6">
                            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">
                                How to Practice
                            </h3>
                            <ul className="text-gray-700 dark:text-gray-300 space-y-2 text-sm">
                                <li>• Read each vato slowly and contemplatively</li>
                                <li>• Reflect on the teaching and how it applies to your life</li>
                                <li>• Consider the reflection question deeply</li>
                                <li>• Take your time - there's no rush</li>
                                <li>• Let the wisdom sink into your consciousness</li>
                            </ul>
                        </div>

                        <div className="text-center mt-8">
                            <button
                                onClick={() => navigate("/")}
                                className="text-orange-500 hover:text-orange-600 font-medium"
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

export default MeditationSwamiVato;