'use client';

import { useEffect, useRef } from 'react';
import type { ReactNode } from 'react';

interface IMotionRevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  variant?: 'content' | 'artwork';
  duration?: number;
}

// Progressive enhancement: SSR/no-JS content stays visible. One observer per
// reveal disconnects after entry; only opacity and transform are animated.
export const MotionReveal = ({
  children,
  className = '',
  delay = 0,
  variant = 'content',
  duration,
}: IMotionRevealProps) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element || !('IntersectionObserver' in window) || !element.animate) return;

    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    let animation: Animation | undefined;
    let revealed = false;
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting) || revealed) return;
        revealed = true;
        observer.disconnect();
        element.dataset.motion = 'revealing';
        animation = element.animate(
          [
            {
              opacity: 0,
              transform:
                variant === 'artwork' ? 'translateY(24px) scale(0.992)' : 'translateY(22px)',
            },
            { opacity: 1, transform: 'none' },
          ],
          {
            duration: duration ?? (variant === 'artwork' ? 650 : 560),
            delay,
            easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
          },
        );
        animation.onfinish = () => {
          element.dataset.motion = 'revealed';
        };
      },
      { threshold: 0.18, rootMargin: '0px 0px -8% 0px' },
    );

    const syncPreference = () => {
      if (preference.matches) {
        observer.disconnect();
        animation?.cancel();
        element.dataset.motion = 'reduced';
      } else if (!revealed) {
        element.dataset.motion = 'observing';
        observer.observe(element);
      }
    };
    // Keyboard focus must never wait for a reveal or remain partly transparent.
    const finishOnFocus = () => {
      revealed = true;
      observer.disconnect();
      animation?.cancel();
      element.dataset.motion = 'revealed';
    };

    syncPreference();
    preference.addEventListener('change', syncPreference);
    element.addEventListener('focusin', finishOnFocus);
    return () => {
      observer.disconnect();
      animation?.cancel();
      preference.removeEventListener('change', syncPreference);
      element.removeEventListener('focusin', finishOnFocus);
    };
  }, [delay, duration, variant]);

  return (
    <div ref={ref} data-motion-reveal className={className}>
      {children}
    </div>
  );
};
