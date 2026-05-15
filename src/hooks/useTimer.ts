'use client';
import { useState, useEffect, useRef } from 'react';

export function useTimer(initialSeconds: number, onExpire?: () => void) {
  const [seconds, setSeconds] = useState(initialSeconds);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setSeconds(s => {
          if (s <= 1) {
            setIsRunning(false);
            onExpire?.();
            return 0;
          }
          return s - 1;
        });
      }, 1000);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [isRunning, onExpire]);

  const start = () => setIsRunning(true);
  const pause = () => setIsRunning(false);
  const reset = (newSeconds?: number) => {
    setIsRunning(false);
    setSeconds(newSeconds ?? initialSeconds);
  };

  const format = () => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const urgency = seconds < 30 ? 'red' : seconds < 60 ? 'amber' : 'green';

  return { seconds, format, start, pause, reset, isRunning, urgency };
}
