'use client';
import { useState, useEffect } from 'react';

const COOKIE_KEY = 'cookie_consent_analytics';

export function useCookieConsent() {
  const [consent, setConsent] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkConsent = () => {
      try {
        const stored = localStorage.getItem(COOKIE_KEY);
        if (stored === 'true') {
          setConsent(true);
        } else if (stored === 'false') {
          setConsent(false);
        } else {
          setConsent(null); // Not decided yet
        }
      } catch {
        // localStorage not available
        setConsent(null);
      } finally {
        setLoading(false);
      }
    };

    checkConsent();

    // Listen for storage changes (in case consent is updated in another tab)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === COOKIE_KEY) {
        checkConsent();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return { consent, loading };
}