import { useState, useEffect, useRef } from 'react';

const useSwipeNavigation = (onSwipeLeft, onSwipeRight, threshold = 50) => {
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const elementRef = useRef(null);

  const onTouchStart = (e) => {
    if (isAnimating) return;
    setTouchEnd(null);
    setTouchStart({
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY,
    });
  };

  const onTouchMove = (e) => {
    if (isAnimating) return;
    setTouchEnd({
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY,
    });
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd || isAnimating) return;
    
    const deltaX = touchStart.x - touchEnd.x;
    const deltaY = touchStart.y - touchEnd.y;
    
    // Check if horizontal swipe is more significant than vertical
    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > threshold) {
      setIsAnimating(true);
      if (deltaX > 0) {
        // Swipe left - next item
        onSwipeLeft && onSwipeLeft();
      } else {
        // Swipe right - previous item
        onSwipeRight && onSwipeRight();
      }
      // Reset animation state after animation completes
      setTimeout(() => setIsAnimating(false), 300);
    }
  };

  useEffect(() => {
    const element = elementRef.current;
    if (element) {
      element.addEventListener('touchstart', onTouchStart, { passive: true });
      element.addEventListener('touchmove', onTouchMove, { passive: true });
      element.addEventListener('touchend', onTouchEnd, { passive: true });
      
      return () => {
        element.removeEventListener('touchstart', onTouchStart);
        element.removeEventListener('touchmove', onTouchMove);
        element.removeEventListener('touchend', onTouchEnd);
      };
    }
  }, [touchStart, touchEnd, isAnimating]);

  return { elementRef, isAnimating };
};

export default useSwipeNavigation;