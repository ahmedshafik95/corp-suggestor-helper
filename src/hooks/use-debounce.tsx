
import { useState, useEffect, useRef } from 'react';

export function useDebounce<T>(value: T, delay: number = 300): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    // Clear previous timer on new value
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    
    // Set a new timer
    timerRef.current = window.setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    
    // Cleanup function to clear timer if component unmounts or value changes
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [value, delay]);

  return debouncedValue;
}
