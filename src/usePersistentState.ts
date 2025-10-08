import { useState } from 'react';
import { STORAGE_KEY } from './utils';
import { WorksheetData } from './types';
import { defaultWorksheet } from './data';

export const usePersistentWorksheet = () => {
  const [data, setData] = useState<WorksheetData>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return { ...defaultWorksheet(), ...JSON.parse(stored) } as WorksheetData;
      }
    } catch (error) {
      console.error('Failed to parse stored worksheet', error);
    }
    return defaultWorksheet();
  });

  const save = () => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      console.error('Failed to persist worksheet', error);
    }
  };

  const reset = () => {
    const fresh = defaultWorksheet();
    setData(fresh);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error('Failed to clear worksheet', error);
    }
  };

  return { data, setData, save, reset } as const;
};
