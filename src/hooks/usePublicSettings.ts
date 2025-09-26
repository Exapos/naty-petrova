'use client';
import { useState, useEffect } from 'react';

interface PublicSettings {
  googleAnalytics?: string;
  googleTagManager?: string;
}

export function usePublicSettings() {
  const [settings, setSettings] = useState<PublicSettings>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const response = await fetch('/api/settings/public');
        
        if (response.ok) {
          const data = await response.json();
          setSettings(data.settings || {});
        }
      } catch (error) {
        console.error('Error loading public settings:', error);
      } finally {
        setLoading(false);
      }
    };

    loadSettings();
  }, []);

  return { settings, loading };
}