'use client';

import { useEffect, useRef, useState } from 'react';

// Keep fast local updates perceptible without delaying navigation or controls.
const MINIMUM_FEEDBACK_MS = 220;
const MAXIMUM_FEEDBACK_MS = 6000;

export const useCatalogFeedback = (pending: boolean) => {
  const [minimumActive, setMinimumActive] = useState(false);
  const [expired, setExpired] = useState(false);
  const minimumTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const maximumTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (minimumTimer.current !== null) clearTimeout(minimumTimer.current);
      if (maximumTimer.current !== null) clearTimeout(maximumTimer.current);
    },
    [],
  );

  const startFeedback = () => {
    if (minimumTimer.current !== null) clearTimeout(minimumTimer.current);
    if (maximumTimer.current !== null) clearTimeout(maximumTimer.current);
    setMinimumActive(true);
    setExpired(false);
    minimumTimer.current = setTimeout(() => setMinimumActive(false), MINIMUM_FEEDBACK_MS);
    maximumTimer.current = setTimeout(() => setExpired(true), MAXIMUM_FEEDBACK_MS);
  };

  return { updating: minimumActive || (pending && !expired), startFeedback };
};
