import { act, fireEvent, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { renderLocalized } from '../../../../test/render-localized';
import { navigation } from '../../../../test/navigation-mock';
import pt from '@/messages/pt-BR/common.json';
import { Header } from './header.component';

vi.mock('@/i18n/navigation', () => import('../../../../test/navigation-mock'));

describe('Header - Unit Test', () => {
  it('Should mark the current route and open keyboard-accessible mobile navigation', async () => {
    // Given: a product detail route with the mobile menu closed.
    navigation.pathname = '/products/propostas-em-dia';
    const user = userEvent.setup();
    renderLocalized(<Header />);
    const currentProduct = screen
      .getByRole('link', { name: pt.navigation.products })
      .getAttribute('aria-current');

    // When: opening the mobile navigation and closing with Escape.
    const toggle = screen.getByRole('button', { name: pt.navigation.openMenu });
    await user.click(toggle);
    const navs = screen.getAllByRole('navigation', { name: pt.navigation.main });
    const menuHome = within(navs[1]).getByRole('link', { name: pt.navigation.home });
    const openedFocus = document.activeElement;
    await user.keyboard('{Escape}');

    // Then: the current route is marked, opening focuses a link and Escape restores the toggle.
    expect(currentProduct).toBe('page');
    expect(openedFocus).toBe(menuHome);
    expect(toggle).toHaveFocus();
    expect(toggle).toHaveAttribute('aria-expanded', 'false');
    expect(screen.getAllByRole('navigation', { name: pt.navigation.main })).toHaveLength(1);
  });

  it('Should close mobile navigation when following a link', async () => {
    // Given: the home route and an open menu.
    navigation.pathname = '/';
    const user = userEvent.setup();
    renderLocalized(<Header />);
    const currentHome = screen
      .getByRole('link', { name: pt.navigation.home })
      .getAttribute('aria-current');

    await user.click(screen.getByRole('button', { name: pt.navigation.openMenu }));

    // When: selecting a mobile navigation anchor.
    const navs = screen.getAllByRole('navigation', { name: pt.navigation.main });
    await user.click(within(navs[1]).getByRole('link', { name: pt.navigation.about }));

    // Then: Home is marked current, the menu closes and the target retains its fragment.
    expect(currentHome).toBe('page');
    expect(screen.getByRole('button', { name: pt.navigation.openMenu })).toHaveAttribute(
      'aria-expanded',
      'false',
    );
    expect(screen.getByRole('link', { name: pt.navigation.about })).toHaveAttribute(
      'href',
      '/#laboratory',
    );
  });

  it('Should apply scroll hysteresis and remove browser listeners on unmount', () => {
    // Given: an unscrolled page with event cleanup observed.
    Object.defineProperty(window, 'scrollY', { configurable: true, value: 0 });
    const remove = vi.spyOn(window, 'removeEventListener');
    const { container, unmount } = renderLocalized(<Header />);
    const header = container.querySelector('header');

    // When: crossing the upper threshold and then moving within the hysteresis interval.
    Object.defineProperty(window, 'scrollY', { configurable: true, value: 96 });
    act(() => fireEvent.scroll(window));
    const upperState = header?.getAttribute('data-scrolled');
    Object.defineProperty(window, 'scrollY', { configurable: true, value: 80 });
    act(() => fireEvent.scroll(window));
    const intermediateState = header?.getAttribute('data-scrolled');
    Object.defineProperty(window, 'scrollY', { configurable: true, value: 64 });
    act(() => fireEvent.scroll(window));
    const lowerState = header?.getAttribute('data-scrolled');
    unmount();

    // Then: hysteresis retains the active state between thresholds and unmount removes its listener.
    expect(upperState).toBe('true');
    expect(intermediateState).toBe('true');
    expect(lowerState).toBe('false');
    expect(remove).toHaveBeenCalledWith('scroll', expect.any(Function));
  });
});
