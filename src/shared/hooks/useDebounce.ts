/**
 * Generic Debounce Hook
 * PRD Checklist 3.2: Delays updating value until specified timeout has elapsed
 * Prevents triggering excessive re-computations or API calls on rapid input changes
 */
import { useState, useEffect } from 'react';

/**
 * Hook to debounce any fast-changing value (e.g. search input)
 * @param value The value to debounce
 * @param delay Milliseconds to wait before updating debounced value (default: 400ms)
 * @returns The debounced value
 */
export function useDebounce<T>(value: T, delay: number = 400): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}

export default useDebounce;
