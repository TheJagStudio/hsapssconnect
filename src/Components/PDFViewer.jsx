
import React, { useState, useEffect, useRef } from 'react';

const PDFViewer = ({ pdfUrl, bookId }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [pdf, setPdf] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isFlipping, setIsFlipping] = useState(false);
    const [flipDirection, setFlipDirection] = useState('');
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [zoomLevel, setZoomLevel] = useState(1.0);
    const canvasRef = useRef(null);
    const containerRef = useRef(null);
    const viewerRef = useRef(null);
    const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });
    const [isScriptLoaded, setIsScriptLoaded] = useState(false);
    
    // Load PDF.js library
    useEffect(() => {
        // Check if PDF.js is already loaded
        if (window.pdfjsLib) {
            setIsScriptLoaded(true);
            loadPDF();
            return;
        }

        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
        script.async = true;
        script.onload = () => {
            window.pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
            setIsScriptLoaded(true);
            loadPDF();
        };
        script.onerror = () => {
            setError('Failed to load PDF viewer');
            setLoading(false);
        };
        document.head.appendChild(script);

        return () => {
            if (document.head.contains(script)) {
                document.head.removeChild(script);
            }
        };
    }, []);

    // Load saved page from localStorage
    useEffect(() => {
        if (!totalPages) return; // Wait until PDF is loaded
        
        const savedProgress = localStorage.getItem('bookReadingProgress');
        if (savedProgress) {
            try {
                const progress = JSON.parse(savedProgress);
                if (progress[bookId]) {
                    const savedPage = parseInt(progress[bookId]);
                    
                    // Validate saved page number
                    if (!isNaN(savedPage) && savedPage >= 1 && savedPage <= totalPages) {
                        setCurrentPage(savedPage);
                    } else {
                        // Invalid saved page, default to page 1
                        setCurrentPage(1);
                    }
                }
            } catch (err) {
                console.error('Error loading saved progress:', err);
                setCurrentPage(1);
            }
        }
    }, [bookId, totalPages]);

    const loadPDF = async () => {
        if (!isScriptLoaded && !window.pdfjsLib) {
            // console.log('PDF.js not loaded yet');
            return;
        }

        try {
            // console.log('Loading PDF from:', pdfUrl);
            setLoading(true);
            setError(null);
            
            const loadingTask = window.pdfjsLib.getDocument(pdfUrl);
            const pdfDoc = await loadingTask.promise;
            // console.log('PDF loaded successfully, pages:', pdfDoc.numPages);
            
            setPdf(pdfDoc);
            setTotalPages(pdfDoc.numPages);
            setLoading(false);
        } catch (err) {
            console.error('Error loading PDF:', err);
            setError('Failed to load PDF: ' + err.message);
            setLoading(false);
        }
    };

    // Save current page to localStorage
    const savePageProgress = (pageNumber) => {
        const savedProgress = localStorage.getItem('bookReadingProgress');
        const progress = savedProgress ? JSON.parse(savedProgress) : {};
        progress[bookId] = pageNumber;
        localStorage.setItem('bookReadingProgress', JSON.stringify(progress));
    };

    const renderTaskRef = useRef(null);
    const isRenderingRef = useRef(false);
    
    const renderPage = async (pageNumber) => {
        if (!pdf || !canvasRef.current) {
            // console.log('Cannot render page - missing pdf or canvas');
            return;
        }
        
        // Wait for any ongoing render to complete cancellation
        if (isRenderingRef.current && renderTaskRef.current) {
            try {
                renderTaskRef.current.cancel();
                await new Promise(resolve => setTimeout(resolve, 10)); // Small delay to ensure cancellation completes
            } catch (err) {
                // Ignore cancellation errors
            }
            renderTaskRef.current = null;
        }
        
        // Mark that we're starting a new render
        isRenderingRef.current = true;
        
        try {
            // console.log('Rendering page:', pageNumber, 'with zoom:', zoomLevel);
            const page = await pdf.getPage(pageNumber);
            const canvas = canvasRef.current;
            if (!canvas) {
                isRenderingRef.current = false;
                return; // Check again after async operation
            }
            
            const context = canvas.getContext('2d');
            
            // Clear the canvas before rendering
            context.clearRect(0, 0, canvas.width, canvas.height);
            
            // Apply zoom level to get the final viewport
            const viewport = page.getViewport({ scale: zoomLevel });
            
            // Set canvas dimensions based on zoom level
            canvas.height = viewport.height;
            canvas.width = viewport.width;
            
            // Store canvas size for proper container sizing
            setCanvasSize({ width: viewport.width, height: viewport.height });
            
            const renderContext = {
                canvasContext: context,
                viewport: viewport
            };
            
            // Store the render task so we can cancel it if needed
            renderTaskRef.current = page.render(renderContext);
            await renderTaskRef.current.promise;
            renderTaskRef.current = null;
            isRenderingRef.current = false;
            // console.log('Page rendered successfully');
        } catch (err) {
            isRenderingRef.current = false;
            if (err.name === 'RenderingCancelledException') {
                // console.log('Rendering cancelled');
                return;
            }
            console.error('Error rendering page:', err);
            setError('Failed to render page: ' + err.message);
        }
    };

    useEffect(() => {
        let isMounted = true;
        
        if (pdf && currentPage) {
            // console.log('Rendering page due to dependency change:', currentPage, zoomLevel);
            renderPage(currentPage).then(() => {
                if (isMounted) {
                    savePageProgress(currentPage);
                    
                    // Center the content after rendering
                    if (containerRef.current) {
                        setTimeout(() => {
                            if (!isMounted || !containerRef.current) return;
                            
                            const container = containerRef.current;
                            const scrollWidth = container.scrollWidth;
                            const scrollHeight = container.scrollHeight;
                            const clientWidth = container.clientWidth;
                            const clientHeight = container.clientHeight;
                            
                            // Center horizontally and vertically
                            container.scrollLeft = (scrollWidth - clientWidth) / 2;
                            container.scrollTop = (scrollHeight - clientHeight) / 2;
                        }, 50);
                    }
                }
            });
        }
        
        return () => {
            isMounted = false;
            // Cancel any ongoing render when dependencies change
            if (renderTaskRef.current) {
                renderTaskRef.current.cancel();
                renderTaskRef.current = null;
            }
            isRenderingRef.current = false;
        };
    }, [pdf, currentPage, zoomLevel]);

    const flipToNextPage = () => {
        if (currentPage < totalPages && !isFlipping) {
            setIsFlipping(true);
            setFlipDirection('forward');
            setTimeout(() => {
                setCurrentPage(currentPage + 1);
                setIsFlipping(false);
                setFlipDirection('');
            }, 300);
        }
    };

    const flipToPreviousPage = () => {
        if (currentPage > 1 && !isFlipping) {
            setIsFlipping(true);
            setFlipDirection('backward');
            setTimeout(() => {
                setCurrentPage(currentPage - 1);
                setIsFlipping(false);
                setFlipDirection('');
            }, 300);
        }
    };

    const goToPage = (pageNumber) => {
        // Handle invalid or overshoot page numbers
        if (!pageNumber || isNaN(pageNumber)) {
            // Invalid input - keep current page
            return;
        }
        
        let validPageNumber = pageNumber;
        
        // If user overshoots, use last page automatically
        if (pageNumber > totalPages) {
            validPageNumber = totalPages;
        } else if (pageNumber < 1) {
            // If negative or zero, use first page
            validPageNumber = 1;
        }
        
        if (!isFlipping && validPageNumber !== currentPage) {
            // Directly set the page for overshoot or invalid cases
            setCurrentPage(validPageNumber);
        }
    };

    const toggleFullscreen = () => {
        if (!document.fullscreenElement) {
            if (viewerRef.current.requestFullscreen) {
                viewerRef.current.requestFullscreen();
            } else if (viewerRef.current.webkitRequestFullscreen) {
                viewerRef.current.webkitRequestFullscreen();
            } else if (viewerRef.current.msRequestFullscreen) {
                viewerRef.current.msRequestFullscreen();
            }
            setIsFullscreen(true);
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.webkitExitFullscreen) {
                document.webkitExitFullscreen();
            } else if (document.msExitFullscreen) {
                document.msExitFullscreen();
            }
            setIsFullscreen(false);
        }
    };

    const zoomIn = () => {
        const newZoomLevel = Math.min(zoomLevel + 0.1, 3.0);
        // console.log('Zooming in to:', newZoomLevel);
        setZoomLevel(newZoomLevel);
    };

    const zoomOut = () => {
        const newZoomLevel = Math.max(zoomLevel - 0.1, 0.5);
        // console.log('Zooming out to:', newZoomLevel);
        setZoomLevel(newZoomLevel);
    };

    // Handle fullscreen change events
    useEffect(() => {
        const handleFullscreenChange = () => {
            setIsFullscreen(!!document.fullscreenElement);
        };

        document.addEventListener('fullscreenchange', handleFullscreenChange);
        document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
        document.addEventListener('msfullscreenchange', handleFullscreenChange);

        return () => {
            document.removeEventListener('fullscreenchange', handleFullscreenChange);
            document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
            document.removeEventListener('msfullscreenchange', handleFullscreenChange);
        };
    }, []);

    // Touch/swipe support
    useEffect(() => {
        let touchStartX = 0;
        let touchEndX = 0;

        const handleTouchStart = (e) => {
            touchStartX = e.changedTouches[0].screenX;
        };

        const handleTouchEnd = (e) => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        };

        const handleSwipe = () => {
            if (touchEndX < touchStartX - 50) {
                flipToNextPage(); // Swipe left - next page
            }
            if (touchEndX > touchStartX + 50) {
                flipToPreviousPage(); // Swipe right - previous page
            }
        };

        const container = containerRef.current;
        if (container) {
            container.addEventListener('touchstart', handleTouchStart);
            container.addEventListener('touchend', handleTouchEnd);
        }

        return () => {
            if (container) {
                container.removeEventListener('touchstart', handleTouchStart);
                container.removeEventListener('touchend', handleTouchEnd);
            }
        };
    }, [currentPage, totalPages, isFlipping]);

    // Keyboard navigation
    useEffect(() => {
        const handleKeyPress = (e) => {
            if (e.key === 'ArrowRight' || e.key === ' ') {
                e.preventDefault();
                flipToNextPage();
            } else if (e.key === 'ArrowLeft') {
                e.preventDefault();
                flipToPreviousPage();
            } else if (e.key === 'f' || e.key === 'F') {
                e.preventDefault();
                toggleFullscreen();
            } else if (e.key === '+' || e.key === '=') {
                e.preventDefault();
                zoomIn();
            } else if (e.key === '-') {
                e.preventDefault();
                zoomOut();
            }
        };

        window.addEventListener('keydown', handleKeyPress);
        return () => window.removeEventListener('keydown', handleKeyPress);
    }, [currentPage, totalPages, isFlipping, zoomLevel]);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="text-primary-600 text-lg">Loading Book...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="text-red-600 text-lg">{error}</div>
            </div>
        );
    }

    return (
        <div 
            ref={viewerRef}
            className={`pdf-viewer-container h-full flex flex-col bg-gradient-to-br from-amber-50 to-orange-50 ${isFullscreen ? 'fixed inset-0 z-50' : ''}`}
        >
            {/* Header with page info and fullscreen button */}
            <div className="pdf-header bg-white/80 backdrop-blur-sm p-3 md:p-4 border-b border-amber-200 flex items-center justify-between shadow-sm">
                <div className="flex items-center space-x-2 md:space-x-3">
                    <button
                        onClick={flipToPreviousPage}
                        disabled={currentPage <= 1 || isFlipping}
                        className="p-2 bg-amber-100 hover:bg-amber-200 disabled:bg-gray-200 disabled:cursor-not-allowed rounded-full transition-colors duration-200"
                        aria-label="Previous page"
                    >
                        <svg className="w-4 h-4 md:w-5 md:h-5 text-amber-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                    <span className="text-amber-800 font-medium text-sm md:text-base">
                        {currentPage} / {totalPages}
                    </span>
                    <button
                        onClick={flipToNextPage}
                        disabled={currentPage >= totalPages || isFlipping}
                        className="p-2 bg-amber-100 hover:bg-amber-200 disabled:bg-gray-200 disabled:cursor-not-allowed rounded-full transition-colors duration-200"
                        aria-label="Next page"
                    >
                        <svg className="w-4 h-4 md:w-5 md:h-5 text-amber-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </button>
                </div>
                
                <div className="flex items-center space-x-2 md:space-x-3">
                    <input
                        type="number"
                        min="1"
                        max={totalPages}
                        value={currentPage}
                        onChange={(e) => {
                            const value = e.target.value;
                            if (value === '') {
                                // Allow empty input temporarily
                                return;
                            }
                            goToPage(parseInt(value));
                        }}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                e.target.blur();
                            }
                        }}
                        className="w-12 md:w-16 px-2 py-1 text-xs md:text-sm border border-amber-300 rounded-md text-center bg-white/80"
                    />
                    <span className="text-amber-700 text-xs md:text-sm hidden sm:inline">Go to page</span>
                    <button
                        onClick={toggleFullscreen}
                        className="p-2 bg-amber-100 hover:bg-amber-200 rounded-full transition-colors duration-200"
                        aria-label="Toggle fullscreen"
                        title="Toggle fullscreen (F)"
                    >
                        {isFullscreen ? (
                            <svg className="w-4 h-4 md:w-5 md:h-5 text-amber-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        ) : (
                            <svg className="w-4 h-4 md:w-5 md:h-5 text-amber-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                            </svg>
                        )}
                    </button>
                </div>
            </div>
            
            {/* Book page display area - Maintains aspect ratio */}
            <div 
                ref={containerRef}
                className={`pdf-book-page flex-1 relative overflow-auto cursor-pointer select-none`}
                onClick={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const clickX = e.clientX - rect.left;
                    const clickY = e.clientY - rect.top;
                    
                    // Left side click - previous page, right side click - next page
                    if (clickX < rect.width / 3) {
                        flipToPreviousPage();
                    } else if (clickX > (rect.width * 2) / 3) {
                        flipToNextPage();
                    }
                }}
            >
                {/* Page flip animation overlay - Fixed animation */}
                <div 
                    className={`absolute inset-0 bg-gradient-to-r from-amber-200 to-orange-200 transition-opacity duration-300 ease-in-out ${isFlipping ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                >
                    <div className="w-full h-full flex items-center justify-center">
                        <div className="text-amber-700 text-lg font-medium">Turning page...</div>
                    </div>
                </div>
                
                {/* Main page content - Scrollable when zoomed */}
                <div className={`inline-flex items-center justify-center ${isFullscreen ? 'p-0' : 'p-4 md:p-8'}`} style={{
                    minWidth: '100%',
                    minHeight: '100%'
                }}>
                    <div className="relative bg-white rounded-lg shadow-2xl" style={{ 
                        boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
                        width: `${canvasSize.width}px`,
                        height: `${canvasSize.height}px`
                    }}>
                        <canvas 
                            ref={canvasRef}
                            style={{ 
                                display: 'block',
                                width: '100%',
                                height: '100%'
                            }}
                        />
                        {/* Book spine effect */}
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-r from-amber-200 to-transparent"></div>
                    </div>
                </div>
            </div>
            
            {isFullscreen && (
                <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex items-center space-x-2 bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-lg">
                    <button
                        onClick={zoomOut}
                        className="p-2 bg-amber-100 hover:bg-amber-200 rounded-full transition-colors duration-200"
                        aria-label="Zoom out"
                        title="Zoom out (-)"
                    >
                        <svg className="w-4 h-4 text-amber-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                        </svg>
                    </button>
                    <span className="text-amber-800 font-medium text-sm px-2 min-w-[50px] text-center">
                        {Math.round(zoomLevel * 100)}%
                    </span>
                    <button
                        onClick={zoomIn}
                        className="p-2 bg-amber-100 hover:bg-amber-200 rounded-full transition-colors duration-200"
                        aria-label="Zoom in"
                        title="Zoom in (+)"
                    >
                        <svg className="w-4 h-4 text-amber-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                    </button>
                </div>
            )}
        </div>
    );
};

export default PDFViewer;
