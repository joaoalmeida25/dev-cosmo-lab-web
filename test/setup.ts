import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach, beforeEach, vi } from 'vitest';

// jsdom has no native modal, animations, layout or scrolling. These stubs isolate unit behavior; they do not validate native browser or mobile behavior.
if (typeof HTMLDialogElement !== 'undefined') {
  Object.defineProperties(HTMLDialogElement.prototype, {
    showModal: {
      configurable: true,
      value() {
        this.setAttribute('open', '');
      },
    },
    close: {
      configurable: true,
      value() {
        this.removeAttribute('open');
      },
    },
  });
  Object.defineProperties(HTMLElement.prototype, {
    getAnimations: { configurable: true, value: () => [] },
    scrollIntoView: { configurable: true, value: () => undefined },
  });
}

beforeEach(() => {
  // Every test must explicitly supply its HTTP response; real delivery is forbidden.
  vi.stubGlobal(
    'fetch',
    vi.fn(() => Promise.reject(new Error('Unexpected HTTP request'))),
  );
});

afterEach(() => {
  cleanup();
  vi.useRealTimers();

  if (typeof document !== 'undefined') {
    localStorage.clear();
    document.documentElement.removeAttribute('data-theme');
    document.documentElement.removeAttribute('data-theme-ready');
    document.body.style.overflow = '';
  }
});
