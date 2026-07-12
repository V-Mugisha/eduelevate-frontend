import { useState, useEffect } from "react";

export default function useDebounce<T>(value: T, delayMilliseconds: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delayMilliseconds);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delayMilliseconds]);

  return debouncedValue;
}
