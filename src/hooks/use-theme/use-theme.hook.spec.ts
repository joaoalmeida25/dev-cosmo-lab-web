import { act, renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { THEME_STORAGE_KEY } from '@/constants/theme.constants';
import { useTheme } from './use-theme.hook';

describe('UseTheme - Unit Test', () => {
  it.each(['"dark"', '"light"', '"invalid"', '{}', 'broken'])(
    'Should validate saved preference %s and apply the corresponding DOM theme',
    (saved) => {
      // Given: a persisted preference arriving from an untrusted browser boundary.
      localStorage.setItem(THEME_STORAGE_KEY, saved);

      // When: hydrating the theme.
      const { result } = renderHook(() => useTheme());

      // Then: only light/dark reach the document; invalid values use dark.
      const expected = saved === '"light"' ? 'light' : 'dark';
      expect(result.current.theme).toBe(expected);
      expect(document.documentElement).toHaveAttribute('data-theme', expected);
      expect(document.documentElement.style.colorScheme).toBe(expected);
    },
  );

  it('Should toggle consecutively, persist and synchronize multiple consumers', () => {
    // Given: two consumers using the default dark theme.
    const first = renderHook(() => useTheme());
    const second = renderHook(() => useTheme());

    // When: toggling twice and explicitly selecting light.
    act(() => first.result.current.toggleTheme());
    const firstToggle = second.result.current.theme;
    act(() => second.result.current.toggleTheme());
    const secondToggle = first.result.current.theme;
    act(() => first.result.current.setTheme('light'));

    // Then: consecutive toggles alternate correctly and explicit selection synchronizes persistence and DOM.
    expect(firstToggle).toBe('light');
    expect(secondToggle).toBe('dark');
    expect(second.result.current.theme).toBe('light');
    expect(localStorage.getItem(THEME_STORAGE_KEY)).toBe('"light"');
    expect(document.documentElement).toHaveAttribute('data-theme', 'light');
  });
});
