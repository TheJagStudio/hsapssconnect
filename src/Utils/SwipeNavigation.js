import { useState, useEffect, useRef, useCallback } from 'react';

const useSwipeNavigation = (onSwipeLeft, onSwipeRight, threshold = 50, onTouchMove = null, onTouchEnd = null) => {
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const elementRef = useRef(null);
  const [swipeProgress, setSwipeProgress] = useState(0);

  const onTouchStart = (e) => {
    if (isAnimating) return;
    setTouchEnd(null);
    setTouchStart({
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY,
    });
  };

  const handleTouchMove = useCallback((e) => {
    if (isAnimating) return;
    
    const currentTouch = {
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY,
    };
    
    setTouchEnd(currentTouch);
    
    // Calculate real-time progress for visual feedback
    if (touchStart) {
      const deltaX = currentTouch.x - touchStart.x; // Reversed direction
      const element = elementRef.current;
      if (element) {
        const elementWidth = element.offsetWidth;
        const progress = (deltaX / elementWidth) * 100;
        setSwipeProgress(Math.max(-50, Math.min(50, progress)));
        
        // Call external touch move handler if provided
        if (onTouchMove) {
          onTouchMove(e, progress);
        }
      }
    }
  }, [isAnimating, touchStart, onTouchMove]);

  const handleTouchEnd = useCallback(() => {
    if (!touchStart || !touchEnd || isAnimating) return;
    
    const deltaX = touchStart.x - touchEnd.x;
    const deltaY = touchStart.y - touchEnd.y;
    
    // Call external touch end handler if provided
    if (onTouchEnd) {
      onTouchEnd();
    }
    
    // Reset progress
    setSwipeProgress(0);
    
    // Check if horizontal swipe is more significant than vertical
    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > threshold) {
      setIsAnimating(true);
      if (deltaX < 0) { // Reversed: negative deltaX means swipe left
        // Swipe left - next item
        onSwipeLeft && onSwipeLeft();
      } else {
        // Swipe right - previous item
        onSwipeRight && onSwipeRight();
      }
      // Reset animation state after animation completes
      setTimeout(() => setIsAnimating(false), 300);
    }
  }, [touchStart, touchEnd, isAnimating, threshold, onSwipeLeft, onSwipeRight, onTouchEnd]);

  useEffect(() => {
    const element = elementRef.current;
    if (element) {
      element.addEventListener('touchstart', onTouchStart, { passive: true });
      element.addEventListener('touchmove', handleTouchMove, { passive: true });
      element.addEventListener('touchend', handleTouchEnd, { passive: true });
      
      return () => {
        element.removeEventListener('touchstart', onTouchStart);
        element.removeEventListener('touchmove', handleTouchMove);
        element.removeEventListener('touchend', handleTouchEnd);
      };
    }
  }, [touchStart, touchEnd, isAnimating, handleTouchMove, handleTouchEnd]);

  return { elementRef, isAnimating, swipeProgress };
};

export default useSwipeNavigation;