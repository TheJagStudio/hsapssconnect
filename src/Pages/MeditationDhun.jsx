import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import './dhun.css'

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
        </div>
    );
};

export default MeditationDhun;
