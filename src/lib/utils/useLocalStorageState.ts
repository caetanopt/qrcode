"use client";

import { useEffect, useState } from "react";

const STORAGE_VERSION = 1;

interface StoredValue<T> {
  version: number;
  value: T;
}

function readFromStorage<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw) as StoredValue<T>;
    if (parsed.version !== STORAGE_VERSION) return fallback;
    return parsed.value;
  } catch {
    return fallback;
  }
}

export function useLocalStorageState<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(() => readFromStorage(key, initialValue));
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setValue(readFromStorage(key, initialValue));
    setHydrated(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  useEffect(() => {
    if (!hydrated || typeof window === "undefined") return;
    try {
      const payload: StoredValue<T> = { version: STORAGE_VERSION, value };
      window.localStorage.setItem(key, JSON.stringify(payload));
    } catch {
      // Storage may be unavailable (private browsing, quota exceeded); ignore.
    }
  }, [key, value, hydrated]);

  function clear() {
    setValue(initialValue);
    if (typeof window !== "undefined") {
      window.localStorage.removeItem(key);
    }
  }

  return [value, setValue, clear] as const;
}
