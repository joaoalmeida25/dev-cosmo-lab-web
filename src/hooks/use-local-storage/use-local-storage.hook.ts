'use client';

import { useCallback, useMemo, useSyncExternalStore, type SetStateAction } from 'react';

const LOCAL_STORAGE_CHANGE_EVENT = 'dev-cosmo-lab-local-storage-change';
const pendingValues = new Map<string, string>();

const readStorage = (key: string): string | null => {
  if (typeof window === 'undefined') return null;

  const pendingValue = pendingValues.get(key);
  if (pendingValue !== undefined) return pendingValue;

  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
};

const parseValue = <T>(serializedValue: string | null | undefined, initialValue: T): T => {
  if (serializedValue == null) return initialValue;

  try {
    return JSON.parse(serializedValue) as T;
  } catch {
    return initialValue;
  }
};

const subscribe = (onStoreChange: () => void) => {
  if (typeof window === 'undefined') return () => {};

  const onStorage = (event: StorageEvent) => {
    if (event.key === null) {
      pendingValues.clear();
    } else {
      pendingValues.delete(event.key);
    }
    onStoreChange();
  };

  window.addEventListener('storage', onStorage);
  window.addEventListener(LOCAL_STORAGE_CHANGE_EVENT, onStoreChange);

  return () => {
    window.removeEventListener('storage', onStorage);
    window.removeEventListener(LOCAL_STORAGE_CHANGE_EVENT, onStoreChange);
  };
};

const getServerSnapshot = () => undefined;

export const useLocalStorage = <T>(key: string, initialValue: T) => {
  const getSnapshot = useCallback(() => readStorage(key), [key]);

  const serializedValue = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const value = useMemo(
    () => parseValue(serializedValue, initialValue),
    [serializedValue, initialValue],
  );

  const setValue = useCallback(
    (nextValue: SetStateAction<T>) => {
      if (typeof window === 'undefined') return;

      const currentValue = parseValue(readStorage(key), initialValue);
      const resolvedValue =
        typeof nextValue === 'function'
          ? (nextValue as (previousValue: T) => T)(currentValue)
          : nextValue;

      let serializedValue: string | undefined;
      try {
        serializedValue = JSON.stringify(resolvedValue);
      } catch {
        return;
      }
      if (serializedValue === undefined) return;

      try {
        window.localStorage.setItem(key, serializedValue);
        pendingValues.delete(key);
      } catch {
        pendingValues.set(key, serializedValue);
      }

      window.dispatchEvent(new Event(LOCAL_STORAGE_CHANGE_EVENT));
    },
    [key, initialValue],
  );

  return { value, setValue, isHydrated: serializedValue !== undefined };
};
