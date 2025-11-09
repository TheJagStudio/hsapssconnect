import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

const CelestialSerenityCircle = ({ isActive, sessionTime, totalTime }) => {
    const [celestialState, setCelestialState] = useState({
        glowIntensity: 0.4,
        particleCount: 32,
        ripplePhase: 0,
        auraOpacity: 0.2,
        floatingOrbsAngle: 0
    });

    useEffect(() => {
        if (isActive) {
            const interval = setInterval(() => {
                setCelestialState(prev => {
                    const time = Date.now() / 1000;
                    const sessionProgress = sessionTime / totalTime;
                    const baseGlow = 0.6 + Math.sin(time * 0.4) * 0.2 + Math.cos(time * 0.6) * 0.2;
                    const progressGlow = sessionProgress * 0.4;
                    const ripple = (time * 1.2) % (Math.PI * 2);
                    const aura = 0.2 + Math.sin(time * 0.3) * 0.1;
                    const orbsRotation = (time * 20) % 360;
                    
                    return {
                        ...prev,
                        glowIntensity: Math.max(0.5, Math.min(1, baseGlow + progressGlow)),
                        ripplePhase: ripple,
                        auraOpacity: aura,
                        floatingOrbsAngle: orbsRotation
                    };
                });
            }, 40);
            return () => clearInterval(interval);
        }
    }, [isActive, sessionTime, totalTime]);

    return (
        <div className="celestial-serenity-container">
            <div 
                className={`celestial-circle ${isActive ? 'active' : ''}`}
                style={{
                    '--glow-intensity': celestialState.glowIntensity,
                    '--hue-rotation': `${(sessionTime / totalTime) * 120}deg`,
                    '--ripple-phase': `${celestialState.ripplePhase}rad`,
                    '--aura-opacity': celestialState.auraOpacity,
                    '--orbs-angle': `${celestialState.floatingOrbsAngle}deg`
                }}
            >
                {/* Outer glow aura */}
                <div className="celestial-outer-aura"></div>
                <div className="celestial-outer-aura-2"></div>
                
                {/* Core light */}
                <div className="celestial-core"></div>
                <div className="celestial-core-inner-light"></div>
                
                {/* Ripple waves */}
                <div className="celestial-ripple"></div>
                <div className="celestial-ripple-secondary"></div>
                
                {/* Floating orbs */}
                <div className="celestial-floating-orbs">
                    {[...Array(8)].map((_, i) => (
                        <div 
                            key={`orb-${i}`} 
                            className="celestial-floating-orb"
                            style={{
                                '--orb-angle': `${i * (360 / 8)}deg`,
                                '--orb-delay': `${i * 0.2}s`,
                                '--orb-size': `${4 + (i % 3) * 2}px`
                            }}
                        />
                    ))}
                </div>

                {/* Light particles */}
                <div className="celestial-particle-field">
                    {[...Array(celestialState.particleCount)].map((_, i) => (
                        <div 
                            key={`particle-${i}`}
                            className="celestial-particle"
                            style={{
                                '--particle-delay': `${i * 0.1}s`,
                                '--particle-angle': `${i * (360 / celestialState.particleCount)}deg`,
                                '--particle-radius': `${40 + (i % 5) * 20}px`,
                                '--particle-speed': `${4 + (i % 5)}s`,
                                '--particle-size': `${1 + (i % 2)}px`
                            }}
                        />
                    ))}
                </div>

                {/* Inner orbiting lights */}
                <div className="celestial-inner-lights">
                    {[...Array(3)].map((_, i) => (
                        <div 
                            key={`light-${i}`}
                            className="celestial-inner-light"
                            style={{
                                '--light-angle': `${i * 120}deg`,
                                '--light-delay': `${i * 0.5}s`
                            }}
                        />
                    ))}
                </div>

                {/* Flowing waves */}
                <div className="celestial-flowing-waves">
                    {[...Array(6)].map((_, i) => (
                        <div 
                            key={`wave-${i}`}
                            className="celestial-wave"
                            style={{
                                '--wave-delay': `${i * 0.5}s`,
                                '--wave-duration': `${5 + i * 0.5}s`
                            }}
                        />
                    ))}
                </div>

                {/* Pulsing light rings */}
                <div className="celestial-pulse-rings">
                    {[...Array(4)].map((_, i) => (
                        <div 
                            key={`ring-${i}`}
                            className="celestial-pulse-ring"
                            style={{
                                '--ring-delay': `${i * 1}s`,
                                '--ring-scale': `${1 + i * 0.3}`
                            }}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

const TimerDisplay = ({ timeRemaining, totalTime }) => {
    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const progress = ((totalTime - timeRemaining) / totalTime) * 100;

    return (
        <div className="celestial-timer-container">
            <div className="celestial-timer-wrapper">
                <svg className="celestial-timer-ring" viewBox="0 0 120 120">
                    {/* Background ring */}
                    <circle 
                        cx="60" 
                        cy="60" 
                        r="50" 
                        fill="none" 
                        stroke="#f0f0f5" 
                        strokeWidth="2"
                    />
                    {/* Progress ring */}
                    <circle 
                        cx="60" 
                        cy="60" 
                        r="50" 
                        fill="none" 
                        stroke="url(#timerGradient)" 
                        strokeWidth="4"
                        strokeDasharray={`${(progress / 100) * 314.159} 314.159`}
                        strokeDashoffset="78.54"
                        strokeLinecap="round"
                        style={{ transition: 'stroke-dasharray 1s linear' }}
                    />
                    <defs>
                        <linearGradient id="timerGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#8a2be2" />
                            <stop offset="100%" stopColor="#d946ef" />
                        </linearGradient>
                    </defs>
                </svg>
                <div className="celestial-timer-text">{formatTime(timeRemaining)}</div>
            </div>
        </div>
    );
};

const TimePeriodSelector = ({ selectedTime, onTimeChange, isSessionActive }) => {
    const timeOptions = [
        { value: 300, label: '5 min', description: 'Quick Reset' },
        { value: 600, label: '10 min', description: 'Brief Session' },
        { value: 900, label: '15 min', description: 'Mindful Break' },
        { value: 1200, label: '20 min', description: 'Deep Focus' },
        { value: 1800, label: '30 min', description: 'Sacred Journey' }
    ];

    return (
        <div className={`time-period-selector ${isSessionActive ? 'hidden' : ''}`}>
            <h3 className="time-selector-title">Choose Your Sacred Journey</h3>
            <div className="time-options-grid">
                {timeOptions.map((option) => (
                    <button
                        key={option.value}
                        className={`time-option ${selectedTime === option.value ? 'selected' : ''}`}
                        onClick={() => onTimeChange(option.value)}
                        disabled={isSessionActive}
                    >
                        <div className="time-label">{option.label}</div>
                        <div className="time-description">{option.description}</div>
                    </button>
                ))}
            </div>
        </div>
    );
};

const MeditationDhun = () => {
    const navigate = useNavigate();
    const [sessionState, setSessionState] = useState('pre-start');
    const [selectedTime, setSelectedTime] = useState(1800);
    const [timeRemaining, setTimeRemaining] = useState(selectedTime);
    const audioRef = useRef(null);
    const [isAudioReady, setIsAudioReady] = useState(false);
    const timerRef = useRef(null);
    const [showBackButton, setShowBackButton] = useState(true);

    useEffect(() => {
        const audio = new Audio(`${import.meta.env.VITE_BACKEND_URL}/media/audio/dhun.mp3`);
        audio.loop = true;
        audio.preload = 'auto';
        audio.oncanplaythrough = () => {
            setIsAudioReady(true);
        };
        audioRef.current = audio;

        return () => {
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current = null;
            }
        };
    }, []);

    useEffect(() => {
        if (sessionState === 'pre-start') {
            setTimeRemaining(selectedTime);
        }
    }, [selectedTime, sessionState]);

    useEffect(() => {
        if (sessionState === 'active' && timeRemaining > 0) {
            timerRef.current = setInterval(() => {
                setTimeRemaining(prev => {
                    if (prev <= 1) {
                        setSessionState('completed');
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        } else {
            if (timerRef.current) {
                clearInterval(timerRef.current);
            }
        }

        return () => {
            if (timerRef.current) {
                clearInterval(timerRef.current);
            }
        };
    }, [sessionState, timeRemaining]);

    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        if (sessionState === 'active') {
            if (!audio.playing) {
                audio.play().catch(e => console.error('Audio play failed:', e));
            }
            let currentVolume = audio.volume;
            if (currentVolume < 0.3) {
                const fadeInInterval = setInterval(() => {
                    currentVolume = Math.min(0.3, currentVolume + 0.01);
                    audio.volume = currentVolume;
                    if (currentVolume >= 0.3) {
                        clearInterval(fadeInInterval);
                    }
                }, 50);
            }
        } else if (sessionState === 'paused') {
            audio.pause();
        } else if (sessionState === 'pre-start' || sessionState === 'completed') {
            let currentVolume = audio.volume;
            const fadeOutInterval = setInterval(() => {
                currentVolume = Math.max(0, currentVolume - 0.02);
                audio.volume = currentVolume;
                if (currentVolume <= 0) {
                    audio.pause();
                    audio.currentTime = 0;
                    clearInterval(fadeOutInterval);
                }
            }, 50);
        }
    }, [sessionState]);

    const handleStart = () => {
        setSessionState('active');
    };

    const handlePauseResume = () => {
        if (sessionState === 'paused') {
            setSessionState('active');
        } else {
            setSessionState('paused');
        }
    };

    const handleStop = () => {
        setSessionState('pre-start');
        setTimeRemaining(selectedTime);
    };

    const handleTimeChange = (newTime) => {
        setSelectedTime(newTime);
        if (sessionState === 'pre-start') {
            setTimeRemaining(newTime);
        }
    };

    if (sessionState === 'completed') {
        return (
            <div className="meditation-dhun-container completion">
                <div className="completion-overlay">
                    <div className="completion-content">
                        <div className="completion-icon">✨</div>
                        <h1 className="completion-title">Journey Complete</h1>
                        <p className="completion-text">
                            {selectedTime >= 1800 ? 'Your sacred meditation journey has concluded.' :
                             selectedTime >= 1200 ? 'Your focused meditation session has ended.' :
                             'Your mindful break is complete.'}
                        </p>
                        <div className="completion-actions">
                            <button onClick={() => navigate('/')} className="btn-home">
                                Return Home
                            </button>
                            <button onClick={handleStop} className="btn-restart">
                                Begin Anew
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    const handleBack = () => {
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
        }
        if (timerRef.current) {
            clearInterval(timerRef.current);
        }
        navigate(-1);
    };

    return (
        <div className="meditation-dhun-container">
            {showBackButton && (
                <button onClick={handleBack} className="back-button" aria-label="Go back">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M19 12H5M12 19l-7-7 7-7" />
                    </svg>
                    <span className="back-button-text">Back</span>
                </button>
            )}

            <div className="content-wrapper">
                {sessionState === "pre-start" && (
                    <div className="pre-start-section pb-20">
                        <div className="title-section">
                            <h1 className="main-title">Nirvikap Dhun</h1>
                            <p className="description">Enter a realm of profound silence and inner peace, where the sacred sounds of Nirvikap Dhun guide your spiritual journey.</p>
                        </div>

                        <TimePeriodSelector selectedTime={selectedTime} onTimeChange={handleTimeChange} />

                        <CelestialSerenityCircle isActive={false} sessionTime={0} totalTime={selectedTime} />

                        <button onClick={handleStart} className="start-btn z-20" disabled={!isAudioReady}>
                            {isAudioReady ? 'Begin Sacred Journey' : 'Preparing...'}
                        </button>
                    </div>
                )}

                {(sessionState === "active" || sessionState === "paused") && (
                    <div className="active-session">
                        <CelestialSerenityCircle isActive={sessionState === "active"} sessionTime={selectedTime - timeRemaining} totalTime={selectedTime} />

                        <TimerDisplay timeRemaining={timeRemaining} totalTime={selectedTime} />

                        <div className="session-controls">
                            <button onClick={handlePauseResume} className="control-btn">
                                {sessionState === "paused" ? "Resume" : "Pause"}
                            </button>
                            <button onClick={handleStop} className="control-btn stop-btn">
                                End Session
                            </button>
                        </div>
                    </div>
                )}
            </div>

            <style jsx>{`
                .meditation-dhun-container {
                    min-height: 100vh;
                    background: radial-gradient(ellipse at center, #fdfdfd 0%, #f0f0f5 50%, #e0e0ee 100%);
                    color: #333;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    position: relative;
                    overflow: hidden;
                    transition: all 2s ease;
                    animation: hue-rotate 60s linear infinite;
                }

                @keyframes hue-rotate {
                    0% {
                        filter: hue-rotate(0deg);
                    }
                    100% {
                        filter: hue-rotate(360deg);
                    }
                }

                .meditation-dhun-container.completion {
                    background: radial-gradient(ellipse at center, #f0f8ff 0%, #e6e6fa 50%, #d8bfd8 100%);
                }

                .app-logo {
                    position: absolute;
                    top: 2rem;
                    left: 2rem;
                    font-size: 1.1rem;
                    font-weight: 400;
                    color: #8a2be2;
                    letter-spacing: 2px;
                    z-index: 10;
                    opacity: 0.8;
                }

                .content-wrapper {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    width: 100%;
                    max-width: 900px;
                    padding: 2rem;
                    z-index: 5;
                }

                .pre-start-section {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    text-align: center;
                    gap: 2.5rem;
                    animation: fadeInUp 1s ease-out;
                }

                .title-section {
                    margin-bottom: 1rem;
                }

                .main-title {
                    font-size: 2.8rem;
                    font-weight: 300;
                    color: #8a2be2;
                    margin-bottom: 1.5rem;
                    letter-spacing: 3px;
                    text-shadow: 0 0 20px rgba(138, 43, 226, 0.2);
                    animation: titleGlow 3s ease-in-out infinite alternate;
                }

                @keyframes titleGlow {
                    0% {
                        text-shadow: 0 0 20px rgba(138, 43, 226, 0.2);
                    }
                    100% {
                        text-shadow: 0 0 30px rgba(138, 43, 226, 0.4);
                    }
                }

                .description {
                    font-size: 1.1rem;
                    color: #555;
                    line-height: 1.7;
                    max-width: 500px;
                    opacity: 0.9;
                }

                .time-period-selector {
                    margin: 2rem 0;
                    width: 100%;
                    max-width: 600px;
                }

                .time-selector-title {
                    font-size: 1.2rem;
                    color: #8a2be2;
                    margin-bottom: 1.5rem;
                    font-weight: 400;
                    letter-spacing: 1px;
                }

                .time-options-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
                    gap: 1rem;
                    margin-bottom: 2rem;
                }

                .time-option {
                    background: rgba(255, 255, 255, 0.5);
                    border: 1px solid rgba(138, 43, 226, 0.2);
                    color: #555;
                    padding: 1.2rem 0.5rem;
                    border-radius: 15px;
                    cursor: pointer;
                    transition: all 0.4s ease;
                    backdrop-filter: blur(10px);
                    text-align: center;
                }

                .time-option:hover {
                    background: rgba(138, 43, 226, 0.1);
                    border-color: rgba(138, 43, 226, 0.4);
                    transform: translateY(-2px);
                }

                .time-option.selected {
                    background: rgba(138, 43, 226, 0.15);
                    border-color: rgba(138, 43, 226, 0.6);
                    color: #8a2be2;
                    box-shadow: 0 0 20px rgba(138, 43, 226, 0.2);
                }

                .time-label {
                    font-size: 1rem;
                    font-weight: 500;
                    margin-bottom: 0.3rem;
                }

                .time-description {
                    font-size: 0.8rem;
                    opacity: 0.7;
                }

                .start-btn {
                    background: linear-gradient(135deg, #8a2be2, #9932cc);
                    color: #fff;
                    border: none;
                    padding: 1rem 2.5rem;
                    border-radius: 50px;
                    font-size: 1rem;
                    font-weight: 500;
                    cursor: pointer;
                    transition: all 0.4s ease;
                    box-shadow: 0 4px 15px rgba(138, 43, 226, 0.3);
                }

                .start-btn:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 6px 20px rgba(138, 43, 226, 0.4);
                }

                .active-session {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    gap: 2rem;
                    animation: fadeIn 1s ease-out;
                }

                .session-controls {
                    display: flex;
                    gap: 1.5rem;
                    margin-top: 2rem;
                    z-index: 10;
                }

                .control-btn {
                    background: rgba(255, 255, 255, 0.7);
                    color: #8a2be2;
                    border: 1px solid rgba(138, 43, 226, 0.3);
                    padding: 0.8rem 1.8rem;
                    border-radius: 50px;
                    font-size: 0.9rem;
                    font-weight: 500;
                    cursor: pointer;
                    transition: all 0.3s ease;
                }

                .control-btn:hover {
                    background: #fff;
                    border-color: #8a2be2;
                    transform: translateY(-2px);
                }

                .stop-btn {
                    background: rgba(255, 182, 193, 0.8);
                    color: #c71585;
                    border-color: rgba(199, 21, 133, 0.4);
                }

                .stop-btn:hover {
                    background: #ffb6c1;
                    border-color: #c71585;
                }

                .back-button {
                    position: absolute;
                    top: 2rem;
                    left: 2rem;
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    background: rgba(255, 255, 255, 0.5);
                    border: 1px solid rgba(0, 0, 0, 0.1);
                    color: #555;
                    padding: 0.6rem 1.2rem;
                    border-radius: 50px;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    z-index: 10;
                    backdrop-filter: blur(5px);
                }

                .back-button:hover {
                    background: #fff;
                    border-color: #8a2be2;
                    color: #8a2be2;
                }

                .completion-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(255, 255, 255, 0.3);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    backdrop-filter: blur(10px);
                    animation: fadeIn 1s ease;
                }

                .completion-content {
                    background: #fff;
                    padding: 4rem 3rem;
                    border-radius: 20px;
                    text-align: center;
                    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
                    max-width: 500px;
                }

                .completion-icon {
                    font-size: 3rem;
                    margin-bottom: 1rem;
                    animation: pulse 2s infinite;
                }

                .completion-title {
                    font-size: 2.5rem;
                    color: #8a2be2;
                    margin-bottom: 1rem;
                }

                .completion-text {
                    color: #555;
                    margin-bottom: 2.5rem;
                }

                .completion-actions {
                    display: flex;
                    justify-content: center;
                    gap: 1.5rem;
                }

                .btn-home,
                .btn-restart {
                    padding: 0.8rem 2rem;
                    border-radius: 50px;
                    font-size: 1rem;
                    cursor: pointer;
                    transition: all 0.3s ease;
                }

                .btn-home {
                    background: #8a2be2;
                    color: #fff;
                    border: 1px solid #8a2be2;
                }

                .btn-restart {
                    background: transparent;
                    color: #8a2be2;
                    border: 1px solid #8a2be2;
                }

                .celestial-serenity-container {
                    position: relative;
                    width: 200px;
                    height: 200px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .celestial-circle {
                    position: absolute;
                    width: 100%;
                    height: 100%;
                    border-radius: 50%;
                    transform-style: preserve-3d;
                    transition: transform 1.5s cubic-bezier(0.2, 0.8, 0.2, 1);
                    filter: hue-rotate(var(--hue-rotation, 0deg));
                }

                .celestial-circle.active {
                    transform: scale(1.1);
                    animation: celestial-breath 8s ease-in-out infinite;
                }

                @keyframes celestial-breath {
                    0%,
                    100% {
                        transform: scale(1.1);
                    }
                    50% {
                        transform: scale(1.15);
                    }
                }

                .celestial-outer-aura {
                    position: absolute;
                    width: 100%;
                    height: 100%;
                    border-radius: 50%;
                    background: radial-gradient(ellipse at center, rgba(138, 43, 226, 0) 40%, rgba(138, 43, 226, 0.2) 60%, rgba(218, 112, 214, 0.15) 80%, rgba(255, 182, 193, 0.1) 100%);
                    filter: blur(20px) brightness(1.2);
                    transform: scale(1.5);
                    opacity: var(--aura-opacity);
                    transition: opacity 1s ease;
                }

                .celestial-outer-aura-2 {
                    position: absolute;
                    width: 100%;
                    height: 100%;
                    border-radius: 50%;
                    background: radial-gradient(ellipse at center, rgba(255, 105, 180, 0) 50%, rgba(255, 105, 180, 0.1) 70%, rgba(25, 25, 112, 0.05) 90%);
                    filter: blur(15px);
                    transform: scale(1.8);
                    opacity: calc(var(--aura-opacity) * 0.8);
                    transition: opacity 1.2s ease;
                }

                .celestial-core {
                    position: absolute;
                    width: 50%;
                    height: 50%;
                    top: 25%;
                    left: 25%;
                    border-radius: 50%;
                    background: radial-gradient(ellipse at center, #fff 0%, rgba(230, 230, 250, 0.8) 50%, rgba(216, 191, 216, 0.5) 100%);
                    box-shadow: 0 0 60px 20px #fff, 0 0 100px 50px rgba(138, 43, 226, 0.5);
                    opacity: var(--glow-intensity);
                    transition: opacity 1s ease;
                }

                .celestial-core-inner-light {
                    position: absolute;
                    width: 20%;
                    height: 20%;
                    top: 40%;
                    left: 40%;
                    border-radius: 50%;
                    background: #fff;
                    box-shadow: 0 0 20px 10px #fff;
                    animation: core-pulse 4s ease-in-out infinite;
                }

                @keyframes core-pulse {
                    0%,
                    100% {
                        transform: scale(0.9);
                        opacity: 0.8;
                    }
                    50% {
                        transform: scale(1.1);
                        opacity: 1;
                    }
                }

                .celestial-ripple {
                    position: absolute;
                    width: 100%;
                    height: 100%;
                    border-radius: 50%;
                    border: 1px solid rgba(138, 43, 226, 0.3);
                    transform: scale(1.2);
                    opacity: 0;
                    animation: ripple-effect 4s ease-out infinite;
                }

                .celestial-ripple-secondary {
                    position: absolute;
                    width: 100%;
                    height: 100%;
                    border-radius: 50%;
                    border: 1px solid rgba(218, 112, 214, 0.2);
                    transform: scale(1.1);
                    opacity: 0;
                    animation: ripple-effect 4s 2s ease-out infinite;
                }

                @keyframes ripple-effect {
                    0% {
                        transform: scale(1);
                        opacity: 0.8;
                    }
                    100% {
                        transform: scale(1.8);
                        opacity: 0;
                    }
                }

                .celestial-floating-orbs {
                    position: absolute;
                    width: 100%;
                    height: 100%;
                    transform: rotate(var(--orbs-angle));
                    transition: transform 0.1s linear;
                }

                .celestial-floating-orb {
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    width: var(--orb-size);
                    height: var(--orb-size);
                    background: radial-gradient(circle, #fff, rgba(230, 230, 250, 0.7));
                    border-radius: 50%;
                    box-shadow: 0 0 10px #fff, 0 0 20px rgba(138, 43, 226, 0.7);
                    transform-origin: calc(-100px - var(--orb-size) / 2) center;
                    transform: rotate(var(--orb-angle));
                    animation: float-orb 6s var(--orb-delay) ease-in-out infinite;
                }

                @keyframes float-orb {
                    0%,
                    100% {
                        transform: rotate(var(--orb-angle)) translateY(0);
                    }
                    50% {
                        transform: rotate(var(--orb-angle)) translateY(-15px);
                    }
                }

                .celestial-particle-field {
                    position: absolute;
                    width: 250%;
                    height: 250%;
                    top: -75%;
                    left: -75%;
                }

                .celestial-particle {
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    width: var(--particle-size);
                    height: var(--particle-size);
                    background: #fff;
                    border-radius: 50%;
                    box-shadow: 0 0 5px #fff;
                    transform-origin: 0 0;
                    animation: particle-orbit var(--particle-speed) var(--particle-delay) linear infinite;
                }

                @keyframes particle-orbit {
                    from {
                        transform: rotate(0deg) translateX(var(--particle-radius)) rotate(0deg);
                    }
                    to {
                        transform: rotate(360deg) translateX(var(--particle-radius)) rotate(-360deg);
                    }
                }

                .celestial-inner-lights {
                    position: absolute;
                    width: 100%;
                    height: 100%;
                }

                .celestial-inner-light {
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    width: 8px;
                    height: 8px;
                    background: #fff;
                    border-radius: 50%;
                    transform-origin: 0 0;
                    animation: inner-light-orbit 8s var(--light-delay) ease-in-out infinite;
                    filter: blur(2px);
                }

                @keyframes inner-light-orbit {
                    0%,
                    100% {
                        transform: rotate(var(--light-angle)) translateX(60px) scale(1);
                    }
                    50% {
                        transform: rotate(calc(var(--light-angle) + 180deg)) translateX(40px) scale(1.5);
                    }
                }

                .celestial-flowing-waves {
                    position: absolute;
                    width: 100%;
                    height: 100%;
                    transform-style: preserve-3d;
                }

                .celestial-wave {
                    position: absolute;
                    width: 100%;
                    height: 100%;
                    border-radius: 50%;
                    border: 1px solid;
                    opacity: 0;
                    animation: wave-flow var(--wave-duration) var(--wave-delay) ease-in-out infinite;
                }

                .celestial-wave:nth-child(1) {
                    border-color: rgba(138, 43, 226, 0.3);
                }
                .celestial-wave:nth-child(2) {
                    border-color: rgba(218, 112, 214, 0.3);
                }
                .celestial-wave:nth-child(3) {
                    border-color: rgba(255, 182, 193, 0.3);
                }
                .celestial-wave:nth-child(4) {
                    border-color: rgba(173, 216, 230, 0.3);
                }
                .celestial-wave:nth-child(5) {
                    border-color: rgba(144, 238, 144, 0.3);
                }
                .celestial-wave:nth-child(6) {
                    border-color: rgba(255, 255, 224, 0.3);
                }

                @keyframes wave-flow {
                    0% {
                        transform: scale(0.8);
                        opacity: 0;
                    }
                    50% {
                        opacity: 0.5;
                    }
                    100% {
                        transform: scale(2.5);
                        opacity: 0;
                    }
                }

                .celestial-pulse-rings {
                    position: absolute;
                    width: 100%;
                    height: 100%;
                }

                .celestial-pulse-ring {
                    position: absolute;
                    width: 100%;
                    height: 100%;
                    border-radius: 50%;
                    border: 2px solid rgba(255, 255, 255, 0.3);
                    opacity: 0;
                    animation: pulse-ring-expand 5s var(--ring-delay) cubic-bezier(0.2, 0.8, 0.2, 1) infinite;
                }

                @keyframes pulse-ring-expand {
                    0% {
                        transform: scale(0.5);
                        opacity: 0;
                    }
                    50% {
                        opacity: 0.7;
                    }
                    90% {
                        transform: scale(var(--ring-scale));
                        opacity: 0;
                    }
                    100% {
                        opacity: 0;
                    }
                }

                .celestial-timer-container {
                    position: absolute;
                    width: 100%;
                    height: 100%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .celestial-timer-wrapper {
                    position: relative;
                    width: 120px;
                    height: 120px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .celestial-timer-ring {
                    width: 100%;
                    height: 100%;
                    transform: rotate(-90deg);
                }

                .celestial-timer-text {
                    position: absolute;
                    font-size: 1.5rem;
                    font-weight: 300;
                    color: #333;
                }

                @keyframes fadeIn {
                    from {
                        opacity: 0;
                    }
                    to {
                        opacity: 1;
                    }
                }

                @keyframes fadeInUp {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                @keyframes pulse {
                    0%,
                    100% {
                        transform: scale(1);
                    }
                    50% {
                        transform: scale(1.1);
                    }
                }

                /* Responsive Design */
                @media (max-width: 768px) {
                    .main-title {
                        font-size: 2.2rem;
                    }

                    .celestial-circle {
                        width: 200px;
                        height: 200px;
                    }

                    .start-btn {
                        padding: 0.8rem 2rem;
                        font-size: 0.9rem;
                    }

                    .session-controls {
                        flex-direction: column;
                        gap: 1rem;
                    }

                    .back-button {
                        top: 1rem;
                        left: 1rem;
                        padding: 0.5rem 1rem;
                        font-size: 0.8rem;
                    }

                    .back-button-text {
                        display: none;
                    }

                    .celestial-timer-container {
                        bottom: 2rem;
                    }

                    .celestial-timer-ring {
                        width: 70px;
                        height: 70px;
                    }

                    .celestial-timer-text {
                        font-size: 0.8rem;
                    }

                    .time-options-grid {
                        grid-template-columns: repeat(2, 1fr);
                    }

                    .completion-content {
                        padding: 3rem 2rem;
                        margin: 1rem;
                    }

                    .completion-title {
                        font-size: 2rem;
                    }

                    .completion-actions {
                        flex-direction: column;
                        gap: 1rem;
                    }
                }

                @media (max-width: 480px) {
                    .main-title {
                        font-size: 1.8rem;
                    }

                    .celestial-circle {
                        width: 160px;
                        height: 160px;
                    }

                    .description {
                        font-size: 1rem;
                        padding: 0 1rem;
                    }

                    .time-options-grid {
                        grid-template-columns: 1fr;
                    }
                }
            `}</style>
        </div>
    );
};

export default MeditationDhun;
