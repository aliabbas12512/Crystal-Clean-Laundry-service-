'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { BusinessSettings } from './types';
import { DEFAULT_SETTINGS } from './defaultSettings';

const SettingsContext = createContext<BusinessSettings>(DEFAULT_SETTINGS);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<BusinessSettings>(DEFAULT_SETTINGS);

  useEffect(() => {
    fetch('/api/settings')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && data.businessName && Array.isArray(data.packages) && data.packages.length > 0) {
          setSettings(data);
        }
      })
      .catch(() => {
        // Network error / offline — keep DEFAULT_SETTINGS.
      });
  }, []);

  return <SettingsContext.Provider value={settings}>{children}</SettingsContext.Provider>;
}

export function useSettings(): BusinessSettings {
  return useContext(SettingsContext);
}
