import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { ProductGallery } from './product-gallery.component';

const images = [
  { src: '/assets/devcosmo/products/propostas-em-dia/01.webp', alt: 'Overview' },
  { src: '/assets/devcosmo/products/propostas-em-dia/02.webp', alt: 'Dashboard' },
  { src: '/assets/devcosmo/products/propostas-em-dia/03.webp', alt: 'Pipeline' },
];

const labels = {
  region: 'Product images',
  previous: 'Previous',
  next: 'Next',
  select: 'Select',
  positions: ['1 of 3', '2 of 3', '3 of 3'],
  unavailable: 'No images available',
};

describe('ProductGallery - Unit Test', () => {
  it('Should select thumbnails and wrap previous and next navigation', async () => {
    // Given: a gallery with three ordered images.
    const user = userEvent.setup();
    render(<ProductGallery images={images} labels={labels} />);

    // When: navigating before the first image, after the last and by thumbnail.
    await user.click(screen.getByRole('button', { name: 'Previous' }));
    const previousImage = screen.getByRole('img', { name: 'Pipeline' }).getAttribute('alt');
    await user.click(screen.getByRole('button', { name: 'Next' }));
    const wrappedImage = screen.getByRole('img', { name: 'Overview' }).getAttribute('alt');
    await user.click(screen.getByRole('button', { name: 'Select: Dashboard' }));

    // Then: both ends wrap and thumbnail selection updates the live position.
    expect(previousImage).toBe('Pipeline');
    expect(wrappedImage).toBe('Overview');
    expect(screen.getByRole('img', { name: 'Dashboard' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Select: Dashboard' })).toHaveAttribute(
      'aria-pressed',
      'true',
    );
    expect(screen.getByText('2 of 3')).toHaveAttribute('aria-live', 'polite');
  });

  it('Should handle arrows, Home and End while ignoring unrelated keys', async () => {
    // Given: focus inside the gallery.
    const user = userEvent.setup();
    render(<ProductGallery images={images} labels={labels} />);
    await user.click(screen.getByRole('button', { name: 'Select: Overview' }));

    // When: navigating by the supported keyboard keys.
    await user.keyboard('{ArrowRight}');
    const arrowImage = screen.getByRole('img', { name: 'Dashboard' }).getAttribute('alt');
    await user.keyboard('{End}');
    const lastImage = screen.getByRole('img', { name: 'Pipeline' }).getAttribute('alt');
    await user.keyboard('{ArrowLeft}{Home}x');

    // Then: arrows and End select their destinations, Home resets and unrelated input does not change it.
    expect(arrowImage).toBe('Dashboard');
    expect(lastImage).toBe('Pipeline');
    expect(screen.getByRole('img', { name: 'Overview' })).toBeInTheDocument();
  });

  it.each([{ items: [] }, { items: images.slice(0, 1) }])(
    'Should omit navigation for zero or one image',
    async ({ items }) => {
      // Given: a gallery without multiple selectable images.
      const user = userEvent.setup();
      render(<ProductGallery images={items} labels={labels} />);

      // When: an arrow key reaches the region.
      screen.getByRole('region').setAttribute('tabindex', '0');
      screen.getByRole('region').focus();
      await user.keyboard('{ArrowRight}');

      // Then: no unavailable navigation action appears.
      expect(screen.queryByRole('button')).not.toBeInTheDocument();

      if (items.length === 0) {
        expect(screen.getByText(labels.unavailable)).toBeInTheDocument();
      } else {
        expect(screen.getByRole('img', { name: 'Overview' })).toBeInTheDocument();
      }
    },
  );
});
