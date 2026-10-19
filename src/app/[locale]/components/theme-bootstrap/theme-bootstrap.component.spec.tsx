import { render, screen } from '@testing-library/react';
import { renderToString } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { THEME_STORAGE_KEY } from '@/constants/theme.constants';
import { useTheme } from '@/hooks/use-theme/use-theme.hook';
import { ThemeBootstrap } from './theme-bootstrap.component';

const Probe = () => {
  const { theme, isHydrated } = useTheme();

  return <output>{`${theme}:${isHydrated}`}</output>;
};

describe('ThemeBootstrap - Unit Test', () => {
  it('Should preserve the saved theme during hydration and mark the document ready', () => {
    // Given: server markup with a client-side light preference already applied by the bootstrap script.
    const markup = renderToString(
      <>
        <ThemeBootstrap script="" locale="pt-BR" />
        <Probe />
      </>,
    );

    const container = document.createElement('div');
    container.innerHTML = markup;
    document.body.append(container);
    localStorage.setItem(THEME_STORAGE_KEY, '"light"');
    document.documentElement.dataset.theme = 'light';

    // When: hydrating the existing markup rather than mounting a client-only tree.
    const { unmount } = render(
      <>
        <ThemeBootstrap script="" locale="pt-BR" />
        <Probe />
      </>,
      { container, hydrate: true },
    );

    // Then: bootstrap and the hook agree on the persisted theme without resetting it to dark.
    expect(document.documentElement).toHaveAttribute('data-theme', 'light');
    expect(document.documentElement).toHaveAttribute('data-theme-ready', 'true');
    expect(screen.getByRole('status')).toHaveTextContent('light:true');
    unmount();
    container.remove();
  });
});
