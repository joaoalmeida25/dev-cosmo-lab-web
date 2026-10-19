import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ThemedArtwork } from './themed-artwork.component';

const props = { darkSrc: '/dark.webp', lightSrc: '/light.webp', width: 1200, height: 675 };

describe('ThemedArtwork - Unit Test', () => {
  it('Should prepare theme-specific responsive image sets without inserting eagerly loaded images', () => {
    // Given: distinct desktop/mobile imagery and light dimensions.
    const { container } = render(
      <ThemedArtwork
        {...props}
        lightWidth={1000}
        lightHeight={600}
        mobileDarkSrc="/mobile-dark.webp"
        mobileLightSrc="/mobile-light.webp"
        alt="Cosmic laboratory"
        className="artwork"
      />,
    );

    // When: reading the accessible artwork and its CSS image sources.
    const artwork = screen.getByRole('img', { name: 'Cosmic laboratory' });

    // Then: CSS can select the active theme/viewport without loading two image elements.
    expect(artwork.style.getPropertyValue('--artwork-dark')).toContain('dark.webp');
    expect(artwork.style.getPropertyValue('--artwork-light')).toContain('light.webp');
    expect(artwork.style.getPropertyValue('--artwork-mobile-dark')).toContain('mobile-dark.webp');
    expect(artwork.style.getPropertyValue('--artwork-mobile-light')).toContain('mobile-light.webp');
    expect(container.querySelector('img')).toBeNull();
  });

  it('Should keep purely decorative artwork hidden and omit absent mobile sources', () => {
    // Given: artwork without meaningful alternative text or mobile variants.
    const { container } = render(<ThemedArtwork {...props} />);

    // When: resolving its DOM presentation contract.
    const artwork = container.firstElementChild;

    // Then: decorative imagery stays outside the accessible tree.
    expect(artwork).toHaveAttribute('aria-hidden', 'true');
    expect(artwork).not.toHaveAttribute('role');
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
  });
});
