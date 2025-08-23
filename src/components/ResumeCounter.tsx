import { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import ResumeCounterService from '@/services/resumeCounter';

interface ResumeCounterProps {
  className?: string;
}

export const ResumeCounter = ({ className }: ResumeCounterProps) => {
  const [count, setCount] = useState(0);
  const [displayCount, setDisplayCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const animationRef = useRef<number>();
  const lastCountRef = useRef(0);

  // Fetch count from service
  const fetchCount = async () => {
    try {
      const { count: resumeCount, error: fetchError } = await ResumeCounterService.getCount();
      if (fetchError) {
        setError(fetchError);
      } else {
        setCount(resumeCount);
        lastCountRef.current = resumeCount;
      }
    } catch (err) {
      setError('Network error');
    } finally {
      setIsLoading(false);
    }
  };

  // Refresh count when component mounts or when user navigates back to home
  useEffect(() => {
    fetchCount();
    
    // Listen for custom event to refresh counter (when user publishes/downloads)
    const handleCounterUpdate = () => {
      fetchCount();
    };
    
    window.addEventListener('resumeCounterUpdated', handleCounterUpdate);
    
    return () => {
      window.removeEventListener('resumeCounterUpdated', handleCounterUpdate);
    };
  }, []);

  // Animate the counter
  const animateCounter = (target: number, duration: number = 2000) => {
    const start = displayCount;
    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const currentValue = Math.floor(start + (target - start) * easeOutQuart);
      
      setDisplayCount(currentValue);

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      }
    };

    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    animationRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    if (count > 0) {
      animateCounter(count);
    }
  }, [count]);

  useEffect(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  // Format number with commas
  const formatNumber = (num: number) => {
    return num.toLocaleString();
  };

  if (isLoading) {
    return (
      <div className={cn("text-center leading-none", className)}>
        <div className="flex items-center justify-center space-x-2">
          <div className="h-6 w-12 bg-blue-200 rounded animate-pulse"></div>
          <div className="h-6 w-24 bg-blue-200 rounded animate-pulse"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return null; // Don't show anything if there's an error
  }

  return (
    <div className={cn("text-center leading-none", className)}>
      <div className="flex items-center justify-center space-x-2">
        <span className="text-lg font-semibold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent tracking-wide">
          {formatNumber(displayCount)}
        </span>
        <span className="text-lg text-muted-foreground font-medium">
          Resumes Created
        </span>
      </div>
    </div>
  );
};

export default ResumeCounter;
