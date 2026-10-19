import { act, renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { useCatalogFeedback } from './use-catalog-feedback.hook';

describe('UseCatalogFeedback - Unit Test', () => {
  it('Should keep feedback for its minimum duration and stop after pending navigation completes', () => {
    // Given: a controlled clock and idle navigation.
    vi.useFakeTimers();
    const { result, rerender } = renderHook(({ pending }) => useCatalogFeedback(pending), {
      initialProps: { pending: false },
    });

    // When: starting feedback, finishing its minimum interval and completing navigation.
    const initiallyUpdating = result.current.updating;
    act(() => result.current.startFeedback());
    act(() => vi.advanceTimersByTime(219));
    const beforeMinimum = result.current.updating;
    rerender({ pending: true });
    act(() => vi.advanceTimersByTime(1));
    const pendingAfterMinimum = result.current.updating;
    rerender({ pending: false });

    // Then: feedback is initially idle, spans the minimum and pending interval, then stops.
    expect(initiallyUpdating).toBe(false);
    expect(beforeMinimum).toBe(true);
    expect(pendingAfterMinimum).toBe(true);
    expect(result.current.updating).toBe(false);
  });

  it('Should restart timers for consecutive actions, expire a stalled navigation and clean up', () => {
    // Given: stalled navigation with feedback already running.
    vi.useFakeTimers();
    const { result, unmount } = renderHook(() => useCatalogFeedback(true));
    act(() => result.current.startFeedback());
    act(() => vi.advanceTimersByTime(5000));

    // When: another action restarts feedback before the old maximum expires.
    act(() => result.current.startFeedback());
    act(() => vi.advanceTimersByTime(5999));
    const beforeMaximum = result.current.updating;
    act(() => vi.advanceTimersByTime(1));
    const afterMaximum = result.current.updating;
    act(() => result.current.startFeedback());
    unmount();

    // Then: the renewed maximum is respected and unmount cancels both active timers.
    expect(beforeMaximum).toBe(true);
    expect(afterMaximum).toBe(false);
    expect(vi.getTimerCount()).toBe(0);
  });

  it('Should cleanly unmount before any feedback has been requested', () => {
    // Given: a hook with no active timers.
    vi.useFakeTimers();
    const { unmount } = renderHook(() => useCatalogFeedback(false));

    // When: unmounting before user interaction.
    unmount();

    // Then: no timer was scheduled or retained.
    expect(vi.getTimerCount()).toBe(0);
  });
});
