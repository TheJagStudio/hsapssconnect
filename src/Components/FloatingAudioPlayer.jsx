import React, { useState, useRef, useEffect } from "react";
import { useAtom } from "jotai";
import { bhajansAtom, currentBhajanAtom, audioBaseAtom, floatingPlayerActiveAtom } from "../Variable";
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, ChevronDown, ChevronUp, X } from "lucide-react";

const FloatingAudioPlayer = () => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [volume, setVolume] = useState(1);
    const [isMuted, setIsMuted] = useState(false);
    const [isMinimized, setIsMinimized] = useState(false);
    const [currentBhajanIndex, setCurrentBhajanIndex] = useState(0);
    const [isVisible, setIsVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [floatingPlayerActive] = useAtom(floatingPlayerActiveAtom);

    const audioRef = useRef(null);
    const [bhajans] = useAtom(bhajansAtom);
    const [currentBhajan, setCurrentBhajan] = useAtom(currentBhajanAtom);
    const [audioBase] = useAtom(audioBaseAtom);

    // Load volume from localStorage on mount
    useEffect(() => {
        const savedVolume = localStorage.getItem('floatingPlayerVolume');
        if (savedVolume !== null) {
            const volumeValue = parseFloat(savedVolume);
            setVolume(volumeValue);
            setIsMuted(volumeValue === 0);
            // Apply volume to audio element if it exists
            if (audioRef.current) {
                audioRef.current.volume = volumeValue;
            }
        }
    }, []);

    // Update audio source when current bhajan changes
    useEffect(() => {
        if (currentBhajan && currentBhajan.isAudio && audioRef.current) {
            setIsLoading(true);
            const audioUrl = audioBase + currentBhajan.audio_url;
            audioRef.current.src = audioUrl;
            
            // Only show player if floatingPlayerActive is true
            if (floatingPlayerActive) {
                setIsVisible(true);
            }

            // Reset playing state when bhajan changes
            // Don't reset playing state here, let it be controlled by the button
            setIsLoading(false);
        } else if (currentBhajan && !currentBhajan.isAudio) {
            setIsVisible(false);
            setIsPlaying(false);
        }
    }, [currentBhajan, audioBase, floatingPlayerActive]);

    // Auto-play when player becomes visible
    useEffect(() => {
        if (audioRef.current && currentBhajan?.isAudio && floatingPlayerActive && isVisible) {
            setIsPlaying(true);
            audioRef.current.play().catch((error) => {
                console.log("Auto-play prevented:", error);
                setIsPlaying(false);
            });
        }
    }, [floatingPlayerActive, isVisible, currentBhajan]);

    // Set up audio event listeners
    useEffect(() => {
        if (audioRef.current) {
            const audio = audioRef.current;

            const handleLoadedMetadata = () => {
                setDuration(audio.duration);
            };

            const handleTimeUpdate = () => {
                setCurrentTime(audio.currentTime);
            };

            const handleEnded = () => {
                playNextBhajan();
            };

            audio.addEventListener("loadedmetadata", handleLoadedMetadata);
            audio.addEventListener("timeupdate", handleTimeUpdate);
            audio.addEventListener("ended", handleEnded);

            return () => {
                audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
                audio.removeEventListener("timeupdate", handleTimeUpdate);
                audio.removeEventListener("ended", handleEnded);
            };
        }
    }, [currentBhajan, bhajans, currentBhajanIndex]);

    // Find current bhajan index in the list
    useEffect(() => {
        if (currentBhajan && bhajans && bhajans.length > 0) {
            const index = bhajans.findIndex((b) => b.id === currentBhajan.id);
            if (index !== -1) {
                setCurrentBhajanIndex(index);
            }
        }
    }, [currentBhajan, bhajans]);

    const togglePlay = () => {
        if (!audioRef.current || !currentBhajan?.isAudio || isLoading) return;

        if (audioRef.current.paused) {
            audioRef.current.play().catch((error) => {
                console.log("Play failed:", error);
                setIsPlaying(false);
            });
            setIsPlaying(true);
        } else {
            audioRef.current.pause();
            setIsPlaying(false);
        }
    };

    const playNextBhajan = () => {
        if (!bhajans || bhajans.length === 0) return;

        let nextIndex = currentBhajanIndex + 1;

        // Skip bhajans without audio
        while (nextIndex < bhajans.length && !bhajans[nextIndex]?.isAudio) {
            nextIndex++;
        }

        // If we reached the end, start from beginning
        if (nextIndex >= bhajans.length) {
            nextIndex = 0;
            // Skip bhajans without audio from the beginning
            while (nextIndex < currentBhajanIndex && !bhajans[nextIndex]?.isAudio) {
                nextIndex++;
            }
        }

        // If we found a bhajan with audio, play it
        if (nextIndex < bhajans.length && bhajans[nextIndex]?.isAudio) {
            setCurrentBhajan(bhajans[nextIndex]);
            setCurrentBhajanIndex(nextIndex);
        }
    };

    const playPreviousBhajan = () => {
        if (!bhajans || bhajans.length === 0) return;

        let prevIndex = currentBhajanIndex - 1;

        // Skip bhajans without audio
        while (prevIndex >= 0 && !bhajans[prevIndex]?.isAudio) {
            prevIndex--;
        }

        // If we reached the beginning, start from end
        if (prevIndex < 0) {
            prevIndex = bhajans.length - 1;
            // Skip bhajans without audio from the end
            while (prevIndex > currentBhajanIndex && !bhajans[prevIndex]?.isAudio) {
                prevIndex--;
            }
        }

        // If we found a bhajan with audio, play it
        if (prevIndex >= 0 && bhajans[prevIndex]?.isAudio) {
            setCurrentBhajan(bhajans[prevIndex]);
            setCurrentBhajanIndex(prevIndex);
        }
    };

    const handleVolumeChange = (e) => {
        const newVolume = e.target.value;
        setVolume(newVolume);
        if (audioRef.current) {
            audioRef.current.volume = newVolume;
        }
        if (newVolume > 0) {
            setIsMuted(false);
        }
        // Save volume to localStorage
        localStorage.setItem('floatingPlayerVolume', newVolume);
    };

    const toggleMute = () => {
        if (!audioRef.current) return;

        if (isMuted) {
            audioRef.current.volume = volume;
            setIsMuted(false);
        } else {
            audioRef.current.volume = 0;
            setIsMuted(true);
        }
    };

    const handleTimeChange = (e) => {
        const time = e.target.value;
        if (audioRef.current) {
            audioRef.current.currentTime = time;
            setCurrentTime(time);
        }
    };

    const formatTime = (time) => {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds.toString().padStart(2, "0")}`;
    };

    if (!isVisible || !currentBhajan?.isAudio || !floatingPlayerActive) {
        return <audio ref={audioRef} preload="metadata" />;
    }

    const handleClose = () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      setIsVisible(false);
      setIsPlaying(false);
    };
  
    return (
      <>
        <audio ref={audioRef} preload="metadata" />
            <style jsx>{`
                .floating-player {
                    animation: slideUp 0.3s ease-out;
                }

                @keyframes slideUp {
                    from {
                        transform: translateY(100%);
                        opacity: 0;
                    }
                    to {
                        transform: translateY(0);
                        opacity: 1;
                    }
                }

                input[type="range"]::-webkit-slider-thumb {
                    appearance: none;
                    width: 16px;
                    height: 16px;
                    border-radius: 50%;
                    background: #38546c;
                    cursor: pointer;
                    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
                }

                input[type="range"]::-moz-range-thumb {
                    width: 16px;
                    height: 16px;
                    border-radius: 50%;
                    background: #38546c;
                    cursor: pointer;
                    border: none;
                    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
                }
            `}</style>
            <div className="floating-player fixed bottom-20 right-4 z-50 w-[calc(100%-2rem)] md:w-96 bg-gray-100 rounded-xl shadow-inner border border-primary-800 backdrop-blur-xl bg-opacity-95 overflow-hidden">
                {/* Minimized view */}
                {isMinimized ? (
                    <div className="relative">
                        <div className="flex items-center justify-between p-3">
                            <div className="flex items-center gap-3 flex-1">
                                <button onClick={togglePlay} className="w-8 h-8 flex items-center justify-center bg-white hover:bg-gray-100 text-primary-600 border border-primary-700 rounded-full transition-all shadow-md hover:shadow-lg">
                                    {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                                </button>
                                <div className="flex-1 min-w-0">
                                    <p className="text-primary-700 text-xl truncate">{currentBhajan.title}</p>
                                    <p className="text-primary-700 text-md truncate">{currentBhajan.title_guj}</p>
                                </div>
                            </div>
                            <button onClick={() => setIsMinimized(false)} className="w-10 h-10 flex items-center justify-center text-primary-700 hover:text-primary-500">
                                <ChevronUp className="w-6 h-6" />
                            </button>
                            <button onClick={handleClose} className="w-8 h-8 flex items-center justify-center text-primary-700 hover:text-primary-500 ml-1">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        {/* Thick progress bar for minimized view */}
                        <div className="h-2 bg-primary-200/50 overflow-hidden">
                            <div
                                className="h-full bg-primary-600 transition-all duration-300 ease-out"
                                style={{ width: `${duration ? (currentTime / duration) * 100 : 0}%` }}
                            />
                        </div>
                    </div>
                ) : (
                    /* Full view */
                    <div className="p-4">
                        <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-3 flex-1">
                                <button onClick={togglePlay} className="w-10 h-10 flex items-center justify-center bg-white hover:bg-gray-100 text-primary-600 border border-primary-700 rounded-full transition-all shadow-md hover:shadow-lg">
                                    {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                                </button>
                                <div className="flex-1 min-w-0">
                                    <p className="text-primary-700 text-xl truncate">{currentBhajan.title}</p>
                                    <p className="text-primary-700 text-md truncate">{currentBhajan.title_guj}</p>
                                </div>
                            </div>
                            <button onClick={() => setIsMinimized(true)} className="w-10 h-10 flex items-center justify-center text-primary-700 hover:text-primary-500">
                                <ChevronDown className="w-6 h-6" />
                            </button>
                            <button onClick={handleClose} className="w-8 h-8 flex items-center justify-center text-primary-700 hover:text-primary-500 ml-1">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Progress bar */}
                        <div className="mb-3">
                            <input
                                type="range"
                                min="0"
                                max={duration || 0}
                                value={currentTime}
                                onChange={handleTimeChange}
                                className="w-full h-2 bg-primary-400/70 rounded-lg appearance-none cursor-pointer accent-white focus:outline-none focus:ring-2 focus:ring-white/50 transition-all hover:h-3 border border-primary-700/25"
                                style={{
                                    background: `linear-gradient(to right, #38546cAA 0%, #38546cAA ${duration ? (currentTime / duration) * 100 : 0}%, rgba(255,255,255) ${duration ? (currentTime / duration) * 100 : 0}%, rgba(255,255,255) 100%)`,
                                }}
                            />
                            <div className="flex justify-between text-xs text-primary-500 mt-1">
                                <span>{formatTime(currentTime)}</span>
                                <span>{formatTime(duration)}</span>
                            </div>
                        </div>

                        {/* Controls */}
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <button onClick={playPreviousBhajan} className="w-8 h-8 flex items-center justify-center text-primary-700 hover:text-primary-500 transition-colors">
                                    <SkipBack className="w-4 h-4" />
                                </button>
                                <button onClick={playNextBhajan} className="w-8 h-8 flex items-center justify-center text-primary-700 hover:text-primary-500 transition-colors">
                                    <SkipForward className="w-4 h-4" />
                                </button>
                            </div>

                            <div className="flex items-center gap-2">
                                <button onClick={toggleMute} className="w-8 h-8 flex items-center justify-center text-primary-700 hover:text-primary-500 transition-colors">
                                    {isMuted || volume === 0 ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                                </button>
                                <input
                                    type="range"
                                    min="0"
                                    max="1"
                                    step="0.1"
                                    value={isMuted ? 0 : volume}
                                    onChange={handleVolumeChange}
                                    className="w-20 h-2 bg-primary-400/70 rounded-lg appearance-none cursor-pointer accent-white focus:outline-none focus:ring-2 focus:ring-white/50 transition-all hover:h-3 border border-primary-700/25"
                                    style={{
                                        background: `linear-gradient(to right, #38546cAA 0%, #38546cAA ${isMuted ? 0 : volume * 100}%, rgba(255,255,255) ${isMuted ? 0 : volume * 100}%, rgba(255,255,255) 100%)`,
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

export default FloatingAudioPlayer;
