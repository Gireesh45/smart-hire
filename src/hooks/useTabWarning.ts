'use client';
import { useState, useEffect } from 'react';

export function useTabWarning(active: boolean) {
  const [showWarning, setShowWarning] = useState(false);
  const [warningCount, setWarningCount] = useState(0);

  useEffect(() => {
    if (!active) return;

    const handleVisibilityChange = () => {
      if (document.hidden) {
        setShowWarning(true);
        setWarningCount(c => c + 1);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [active]);

  return { showWarning, warningCount, dismissWarning: () => setShowWarning(false) };
}
