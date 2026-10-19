import { act, renderHook } from '@testing-library/react';
import { renderToString } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';
import { useLocalStorage } from './use-local-storage.hook';

const resolve = (value: unknown) => (typeof value === 'number' ? value : 0);

const ServerProbe = () => {
  const { value, isHydrated } = useLocalStorage('server', 5, resolve);

  return `${value}:${isHydrated}`;
};

describe('UseLocalStorage - Unit Test', () => {
  it.each([null, '{broken', '"invalid"', 'null'])(
    'Should fall back for missing or invalid storage %s',
    (stored) => {
      // Given: missing, malformed or invalid persisted JSON.
      if (stored !== null) {
        localStorage.setItem('fallback', stored);
      }

      // When: reading through the validated storage boundary.
      const { result } = renderHook(() => useLocalStorage('fallback', 0, resolve));

      // Then: consumers receive the typed fallback and hydration completes.
      expect(result.current.value).toBe(0);
      expect(result.current.isHydrated).toBe(true);
    },
  );

  it('Should synchronize instances, functional updates and external storage events', () => {
    // Given: two hook instances reading the same persisted value.
    localStorage.setItem('shared', '3');
    const first = renderHook(() => useLocalStorage('shared', 0, resolve));
    const second = renderHook(() => useLocalStorage('shared', 0, resolve));

    // When: updating consecutively and then receiving a cross-tab storage change.
    act(() => {
      first.result.current.setValue((current) => current + 1);
      first.result.current.setValue((current) => current + 1);
    });
    const synchronizedValue = second.result.current.value;
    localStorage.setItem('shared', '9');
    act(() => window.dispatchEvent(new StorageEvent('storage', { key: 'shared' })));

    // Then: consecutive updates synchronize before the external value replaces them in both instances.
    expect(synchronizedValue).toBe(5);
    expect(first.result.current.value).toBe(9);
    expect(second.result.current.value).toBe(9);
    expect(localStorage.getItem('shared')).toBe('9');
  });

  it('Should retain a memory fallback when persistence is blocked and invalidate it on clear', () => {
    // Given: a browser denying storage writes.
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new DOMException('Blocked', 'SecurityError');
    });
    const { result } = renderHook(() => useLocalStorage('blocked', 0, resolve));

    // When: writing locally and then receiving a storage clear event.
    act(() => result.current.setValue(8));
    const memoryValue = result.current.value;
    act(() => window.dispatchEvent(new StorageEvent('storage', { key: null })));

    // Then: the memory fallback works before clear invalidates it.
    expect(memoryValue).toBe(8);
    expect(result.current.value).toBe(0);
  });

  it('Should survive blocked reads and ignore unserializable updates', () => {
    // Given: unavailable storage and a hook whose next value cannot be serialized.
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('Unavailable');
    });
    const { result } = renderHook(() =>
      useLocalStorage<unknown>('serialize', null, (value) => value),
    );

    const cyclic: { self?: unknown } = {};
    cyclic.self = cyclic;

    // When: attempting cyclic and undefined values.
    act(() => result.current.setValue(cyclic));
    act(() => result.current.setValue(undefined));

    // Then: no partial value escapes and no storage exception reaches the UI.
    expect(result.current.value).toBeNull();
  });

  it('Should use the server snapshot without accessing browser persistence', () => {
    // Given: storage spies that would expose an SSR access.
    const read = vi.spyOn(Storage.prototype, 'getItem');

    // When: rendering a hook consumer on the server.
    const markup = renderToString(<ServerProbe />);

    // Then: SSR uses the initial value and explicitly reports no hydration.
    expect(markup).toBe('5:false');
    expect(read).not.toHaveBeenCalled();
  });

  it('Should remove subscribers on unmount', () => {
    // Given: a subscribed storage consumer.
    const remove = vi.spyOn(window, 'removeEventListener');
    const { unmount } = renderHook(() => useLocalStorage('cleanup', 0, resolve));

    // When: removing the consumer.
    unmount();

    // Then: browser listeners no longer retain its callback.
    expect(remove).toHaveBeenCalledWith('storage', expect.any(Function));
    expect(remove).toHaveBeenCalledWith('dev-cosmo-lab-local-storage-change', expect.any(Function));
  });
});

describe('UseLocalStorage - Unit Test', () => {
  it('Should make server-side setter calls inert when the browser window is absent', () => {
    // Given: a server-rendered hook consumer without browser globals.
    const BrowserlessProbe = () => {
      const { value, setValue } = useLocalStorage('server-update', 3, resolve);
      setValue(9);

      return String(value);
    };

    vi.stubGlobal('window', undefined);

    // When: a server consumer invokes the persistence setter.
    let markup = '';

    try {
      markup = renderToString(<BrowserlessProbe />);
    } finally {
      vi.unstubAllGlobals();
    }

    // Then: SSR remains stable and cannot access unavailable storage.
    expect(markup).toBe('3');
  });
});
