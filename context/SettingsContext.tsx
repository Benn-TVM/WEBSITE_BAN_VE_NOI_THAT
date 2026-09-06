'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

interface SettingsData {
  hotline: string;
  cleanHotline: string;
  supportEmail: string;
  bankName: string;
  bankAccountNo: string;
  bankAccountName: string;
  momoPhone: string;
  refreshSettings: () => Promise<void>;
  loaded: boolean;
}

const defaultSettings: SettingsData = {
  hotline: '0987.069.242',
  cleanHotline: '0987069242',
  supportEmail: 'hotro@banvenoithat.vn',
  bankName: 'Vietcombank',
  bankAccountNo: '9988776655',
  bankAccountName: 'NGUYEN VAN QUAN TRI',
  momoPhone: '0987069242',
  refreshSettings: async () => {},
  loaded: false,
};

const SettingsContext = createContext<SettingsData>(defaultSettings);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<SettingsData>(defaultSettings);

  const fetchSettings = async () => {
    try {
      const res = await fetch('/api/settings', { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        const rawHotline = data.HOTLINE || '0987.069.242';
        const cleanHotline = rawHotline.replace(/[^0-9]/g, '') || '0987069242';
        const rawMomo = data.MOMO_PHONE || '0987069242';
        const cleanMomo = rawMomo.replace(/[^0-9]/g, '') || '0987069242';

        setSettings({
          hotline: rawHotline,
          cleanHotline: cleanHotline,
          supportEmail: data.SUPPORT_EMAIL || 'hotro@banvenoithat.vn',
          bankName: data.BANK_NAME || 'Vietcombank',
          bankAccountNo: data.BANK_ACCOUNT_NO || '9988776655',
          bankAccountName: data.BANK_ACCOUNT_NAME || 'NGUYEN VAN QUAN TRI',
          momoPhone: cleanMomo,
          refreshSettings: fetchSettings,
          loaded: true,
        });
      }
    } catch (err) {
      console.error('Error fetching global settings:', err);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  return (
    <SettingsContext.Provider value={settings}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  return useContext(SettingsContext);
}
