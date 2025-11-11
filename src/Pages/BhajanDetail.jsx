import React, { useEffect, useState, useRef } from "react";
import { Link, useParams } from "react-router-dom";
import { useAtom } from "jotai";
import { currentBhajanAtom, lyricsBaseAtom, audioBaseAtom, bhajansAtom, floatingPlayerActiveAtom } from "../Variable";
import { useNavigate } from "react-router-dom";
import { Music } from "lucide-react";

const BhajanDetail = () => {
	const [currentBhajan, setCurrentBhajan] = useAtom(currentBhajanAtom);
	const [audioBase, setAudioBase] = useAtom(audioBaseAtom);
	const [lyricsBase, setLyricsBase] = useAtom(lyricsBaseAtom);
	const [bhajans, setBhajans] = useAtom(bhajansAtom);
	const [activeLanguage, setActiveLanguage] = useState("");
	const [floatingPlayerActive, setFloatingPlayerActive] = useAtom(floatingPlayerActiveAtom);
	const [fontSize, setFontSize] = useState(16);
	const [isLoading, setIsLoading] = useState(false);
	
	// Three-panel carousel state
	const [panels, setPanels] = useState({ left: null, center: null, right: null });
	const [translateX, setTranslateX] = useState(0);
	const [isTransitioning, setIsTransitioning] = useState(false);
	const touchStartRef = useRef(null);
	const touchStartYRef = useRef(null);
	const isHorizontalSwipeRef = useRef(false);
	
	const { id, catLink } = useParams();
	const navigate = useNavigate();
	const containerRef = useRef(null);

	// Fetch bhajan list for the category
	const fetchBhajanList = async () => {
		try {
			const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/bhajan-list/${catLink}`);
			const data = await response.json();
			if (data?.bhajans) {
				setBhajans(data.bhajans);
			}
		} catch (error) {
			console.error('Error fetching bhajan list:', error);
		}
	};

	// Fetch bhajan details
	const fetchBhajanDetails = async (bhajanId) => {
		try {
			const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/bhajan-detail/${bhajanId}`);
			const data = await response.json();
			return data;
		} catch (error) {
			console.error('Error fetching bhajan details:', error);
			return null;
		}
	};

	// Load lyrics for a bhajan
	const loadLyrics = async (bhajanData, language = "") => {
		try {
			const base = bhajanData.lyricsBase;
			const response = await fetch(base + language + bhajanData.lyrics);
			const lyricsText = await response.text();
			return lyricsText;
		} catch (error) {
			console.error('Error loading lyrics:', error);
			return "";
		}
	};

	// Get adjacent bhajan indices
	const getAdjacentBhajans = (currentId) => {
		if (!bhajans || bhajans.length === 0) return { prev: null, current: null, next: null };
		
		const currentIndex = bhajans.findIndex(b => b.id === parseInt(currentId));
		if (currentIndex === -1) return { prev: null, current: null, next: null };
		
		return {
			prev: currentIndex > 0 ? bhajans[currentIndex - 1] : null,
			current: bhajans[currentIndex],
			next: currentIndex < bhajans.length - 1 ? bhajans[currentIndex + 1] : null
		};
	};

	// Initialize three panels
	const initializePanels = async (currentId) => {
		// First, always fetch the current bhajan
		const centerData = await fetchBhajanDetails(currentId);
		
		if (!centerData) return;
		
		// Update main bhajan state
		const centerLyrics = await loadLyrics(centerData, activeLanguage);
		setCurrentBhajan(centerData);
		setAudioBase(centerData.audioBase);
		setLyricsBase(centerData.lyricsBase);
		
		// Try to get adjacent bhajans if the list is available
		let leftData = null;
		let rightData = null;
		
		if (bhajans && bhajans.length > 0) {
			const { prev, next } = getAdjacentBhajans(currentId);
			leftData = prev ? await fetchBhajanDetails(prev.id) : null;
			rightData = next ? await fetchBhajanDetails(next.id) : null;
		}
		
		setPanels({
			left: leftData ? { ...leftData, lyrics_html: await loadLyrics(leftData, activeLanguage) } : null,
			center: { ...centerData, lyrics_html: centerLyrics },
			right: rightData ? { ...rightData, lyrics_html: await loadLyrics(rightData, activeLanguage) } : null
		});
	};

	// Touch handlers
	const handleTouchStart = (e) => {
		if (isTransitioning) return;
		touchStartRef.current = e.touches[0].clientX;
		touchStartYRef.current = e.touches[0].clientY;
		isHorizontalSwipeRef.current = null;
	};

	const handleTouchMove = (e) => {
		if (!touchStartRef.current || isTransitioning) return;
		
		const currentX = e.touches[0].clientX;
		const currentY = e.touches[0].clientY;
		const diffX = currentX - touchStartRef.current;
		const diffY = currentY - touchStartYRef.current;
		
		// Determine swipe direction on first move
		if (isHorizontalSwipeRef.current === null) {
			isHorizontalSwipeRef.current = Math.abs(diffX) > Math.abs(diffY);
		}
		
		// Only handle horizontal swipes
		if (isHorizontalSwipeRef.current) {
			e.preventDefault();
			
			// Limit swipe range
			if ((diffX > 0 && !panels.left) || (diffX < 0 && !panels.right)) {
				// Reduce resistance when there's no adjacent panel
				setTranslateX(diffX * 0.3);
			} else {
				setTranslateX(diffX);
			}
		}
	};

	const handleTouchEnd = () => {
		if (isTransitioning || !touchStartRef.current) return;
		
		const threshold = window.innerWidth * 0.25;
		
		if (isHorizontalSwipeRef.current && Math.abs(translateX) > threshold) {
			setIsTransitioning(true);
			
			if (translateX > 0 && panels.left) {
				// Swipe right - go to previous
				setTranslateX(window.innerWidth);
				
				setTimeout(async () => {
					const { prev } = getAdjacentBhajans(panels.left.id);
					const newLeftData = prev ? await fetchBhajanDetails(prev.id) : null;
					const newLeftLyrics = newLeftData ? await loadLyrics(newLeftData, activeLanguage) : null;
					
					setPanels({
						left: newLeftData ? { ...newLeftData, lyrics_html: newLeftLyrics } : null,
						center: panels.left,
						right: panels.center
					});
					
					setCurrentBhajan(panels.left);
					setAudioBase(panels.left.audioBase);
					setLyricsBase(panels.left.lyricsBase);
					navigate(`/bhajan/${catLink}/${panels.left.id}`, { replace: true });
					
					setTranslateX(0);
					setIsTransitioning(false);
					touchStartRef.current = null;
					touchStartYRef.current = null;
					isHorizontalSwipeRef.current = null;
				}, 300);
			} else if (translateX < 0 && panels.right) {
				// Swipe left - go to next
				setTranslateX(-window.innerWidth);
				
				setTimeout(async () => {
					const { next } = getAdjacentBhajans(panels.right.id);
					const newRightData = next ? await fetchBhajanDetails(next.id) : null;
					const newRightLyrics = newRightData ? await loadLyrics(newRightData, activeLanguage) : null;
					
					setPanels({
						left: panels.center,
						center: panels.right,
						right: newRightData ? { ...newRightData, lyrics_html: newRightLyrics } : null
					});
					
					setCurrentBhajan(panels.right);
					setAudioBase(panels.right.audioBase);
					setLyricsBase(panels.right.lyricsBase);
					navigate(`/bhajan/${catLink}/${panels.right.id}`, { replace: true });
					
					setTranslateX(0);
					setIsTransitioning(false);
					touchStartRef.current = null;
					touchStartYRef.current = null;
					isHorizontalSwipeRef.current = null;
				}, 300);
			} else {
				// Reset
				setTranslateX(0);
				setIsTransitioning(false);
				touchStartRef.current = null;
				touchStartYRef.current = null;
				isHorizontalSwipeRef.current = null;
			}
		} else {
			// Reset
			setTranslateX(0);
			touchStartRef.current = null;
			touchStartYRef.current = null;
			isHorizontalSwipeRef.current = null;
		}
	};

	// Initialize panels on mount or when ID changes
	useEffect(() => {
		// If bhajans is empty, fetch the list first
		if (!bhajans || bhajans.length === 0) {
			fetchBhajanList();
		} else {
			initializePanels(id);
		}
	}, [id, bhajans]);

	// Reload lyrics when language changes
	useEffect(() => {
		const reloadAllLyrics = async () => {
			if (panels.center) {
				const centerLyrics = await loadLyrics(panels.center, activeLanguage);
				const leftLyrics = panels.left ? await loadLyrics(panels.left, activeLanguage) : null;
				const rightLyrics = panels.right ? await loadLyrics(panels.right, activeLanguage) : null;
				
				setPanels({
					left: panels.left ? { ...panels.left, lyrics_html: leftLyrics } : null,
					center: { ...panels.center, lyrics_html: centerLyrics },
					right: panels.right ? { ...panels.right, lyrics_html: rightLyrics } : null
				});
			}
		};
		
		if (panels.center) {
			reloadAllLyrics();
		}
	}, [activeLanguage]);
	
	return (
        <div
            className="relative h-screen overflow-hidden bg-background "
            style={{
                backgroundImage: "url(/static/images/backgroundLight.png)",
                backgroundRepeat: "repeat",
                backgroundSize: 200,
            }}
        >
            {/* Sticky Header */}
            <div className="sticky top-0 z-20 bg-white shadow-sm border-b border-primary-600">
                <div className="flex items-center justify-between w-full p-5 pb-1 gap-5">
                    <div className="flex items-center justify-start gap-2">
                        <button
                            onClick={() => {
                                navigate("/bhajan/" + catLink);
                            }}
                            className="rounded-full"
                        >
                            <svg className="w-6 h-6 text-primary-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>
                        <div>
                            <h1 className="text-3xl text-primary-800 font-haspss whitespace-nowrap text-nowrap">{currentBhajan.title}</h1>
                            <p className=" text-primary-800 ">{currentBhajan.title_guj}</p>
                        </div>
                    </div>
                </div>
                <div className="w-full flex flex-nowrap items-center justify-between gap-x-1 py-2 overflow-x-scroll px-5 border-t border-primary-700">
                    <div className="flex flex-row flex-nowrap items-center justify-start gap-1">
                        {currentBhajan?.isAudio && (
                            <button
                                onClick={() => {
                                    if (!floatingPlayerActive) {
                                        // First time activation - show player and set current bhajan
                                        setFloatingPlayerActive(true);
                                        if (panels.center) {
                                            setCurrentBhajan(panels.center);
                                            setAudioBase(panels.center.audioBase);
                                            setLyricsBase(panels.center.lyricsBase);
                                        }
                                    } else {
                                        // Hide the FloatingAudioPlayer
                                        setFloatingPlayerActive(false);
                                    }
                                }}
                                className={"px-3 py-1 text-center rounded-full w-full max-w-fit h-fit mx-auto text-nowrap border-primary-600 border-2 transition-all " + (floatingPlayerActive ? "bg-gradient-to-tr from-primary-600 to-primary-500 text-white" : " text-primary-600")}
                            >
                                <Music className="w-5 h-5" />
                            </button>
                        )}
                        <button
                            onClick={() => {
                                setActiveLanguage("");
                                setFontSize(16);
                            }}
                            className={"px-3 py-1 text-center rounded-full w-full max-w-fit h-fit mx-auto text-nowrap border-primary-600 border-2 transition-all " + (activeLanguage === "" ? "bg-gradient-to-tr from-primary-600 to-primary-500 text-white" : " text-primary-600")}
                        >
                            Gujarati
                        </button>
                        {currentBhajan?.isEng && (
                            <button
                                onClick={() => {
                                    setActiveLanguage("E");
                                    setFontSize(16);
                                }}
                                className={"px-3 py-1 text-center rounded-full w-full max-w-fit h-fit mx-auto text-nowrap border-primary-600 border-2 transition-all " + (activeLanguage === "E" ? "bg-gradient-to-tr from-primary-600 to-primary-500 text-white" : " text-primary-600")}
                            >
                                English
                            </button>
                        )}
                        {currentBhajan?.isHnd && (
                            <button
                                onClick={() => {
                                    setActiveLanguage("H");
                                    setFontSize(16);
                                }}
                                className={"px-3 py-1 text-center rounded-full w-full max-w-fit h-fit mx-auto text-nowrap border-primary-600 border-2 transition-all " + (activeLanguage === "H" ? "bg-gradient-to-tr from-primary-600 to-primary-500 text-white" : " text-primary-600")}
                            >
                                Hindi
                            </button>
                        )}
                    </div>
                    <div className="flex items-end justify-end gap-1">
                        <button
                            onClick={() => {
                                try {
                                    for (let i = 0; i < document.getElementsByClassName("gpara").length; i++) {
                                        document.getElementsByClassName("gpara")[i].style.fontSize = fontSize + 3 + "px";
                                    }
                                } catch (e) {}
                                try {
                                    for (let i = 0; i < document.getElementsByClassName("gparabhajan3").length; i++) {
                                        document.getElementsByClassName("gparabhajan3")[i].style.fontSize = fontSize + 3 + "px";
                                    }
                                } catch (e) {}
                                setFontSize(fontSize + 3);
                            }}
                            className="text-white text-xl bg-primary-600/80 hover:bg-primary-600 border-2 border-primary-600 transition-all rounded-full w-8 h-8"
                        >
                            +
                        </button>
                        <button
                            onClick={() => {
                                try {
                                    for (let i = 0; i < document.getElementsByClassName("gpara").length; i++) {
                                        document.getElementsByClassName("gpara")[i].style.fontSize = fontSize - 3 + "px";
                                    }
                                } catch (e) {}
                                try {
                                    for (let i = 0; i < document.getElementsByClassName("gparabhajan3").length; i++) {
                                        document.getElementsByClassName("gparabhajan3")[i].style.fontSize = fontSize - 3 + "px";
                                    }
                                } catch (e) {}
                                setFontSize(fontSize - 3);
                            }}
                            className="text-white text-xl bg-primary-600/80 hover:bg-primary-600 border-2 border-primary-600 transition-all rounded-full w-8 h-8"
                        >
                            -
                        </button>
                    </div>
                </div>
            </div>

            {/* Three-Panel Carousel */}
            <div className="relative h-full overflow-hidden">
                <div
                    className={`flex h-full pb-32 ${isTransitioning ? "transition-transform duration-300 ease-out" : ""}`}
                    style={{
                        transform: `translateX(calc(-100vw + ${translateX}px))`,
                    }}
                    onTouchStart={handleTouchStart}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleTouchEnd}
                >
                    {/* Left Panel */}
                    <div className="h-full flex-shrink-0 overflow-y-auto p-5" style={{ width: "100vw" }}>
                        {panels.left && (
                            <>
                                <div className={"w-full min-h-32 bg-white rounded-xl shadow-inner p-5 mb-20 " + (activeLanguage === "H" ? "font-ShreeHindi text-xl" : "")} dangerouslySetInnerHTML={{ __html: panels.left.lyrics_html || "" }} />
                            </>
                        )}
                    </div>

                    {/* Center Panel (Current) */}
                    <div className="h-full flex-shrink-0 overflow-y-auto p-5" style={{ width: "100vw" }}>
                        {panels.center && (
                            <>
                                <div className={"w-full min-h-32 bg-white rounded-xl shadow-inner p-5 mb-20 " + (activeLanguage === "H" ? "font-ShreeHindi text-xl" : "")} dangerouslySetInnerHTML={{ __html: panels.center.lyrics_html || "" }} />
                            </>
                        )}
                    </div>

                    {/* Right Panel */}
                    <div className="h-full flex-shrink-0 overflow-y-auto p-5" style={{ width: "100vw" }}>
                        {panels.right && (
                            <>
                                <div className={"w-full min-h-32 bg-white rounded-xl shadow-inner p-5 mb-20 " + (activeLanguage === "H" ? "font-ShreeHindi text-xl" : "")} dangerouslySetInnerHTML={{ __html: panels.right.lyrics_html || "" }} />
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BhajanDetail;
