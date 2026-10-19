import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import en from '@/messages/en/product-details.json';
import es from '@/messages/es/product-details.json';
import pt from '@/messages/pt-BR/product-details.json';
import proposals from '@/features/products/data/propostas-em-dia.json';
import type { IProductSummaryProps } from '../../product-details.types';
import { ProductSummary } from './product-summary.component';

const summary: IProductSummaryProps = {
  name: proposals.name,
  type: 'Kit digital',
  subtitle: proposals.content['pt-BR'].subtitle,
  description: proposals.content['pt-BR'].description,
  status: 'Disponível',
  stageNote: null,
  price: 'R$ 29,90',
  action: {
    href: proposals.commercial.checkoutUrl,
    label: pt.buy,
    accessibleLabel: pt.buyLabel.replace('{name}', proposals.name),
  },
  demonstration: {
    href: proposals.details.demonstrationUrl,
    label: pt.demonstration,
    accessibleLabel: pt.demonstrationLabel.replace('{name}', proposals.name),
  },
  specifications: [{ label: pt.specifications.format, value: pt.values['digital-files'] }],
};

describe('ProductSummary - Unit Test', () => {
  it.each([pt, en, es])(
    'Should preserve localized demonstration names, action order and safe new tabs for locale %#',
    (messages) => {
      // Given: approved kit content, confirmed checkout and the localized demonstration action.
      const accessibleLabel = messages.demonstrationLabel.replace('{name}', proposals.name);
      const demonstration = {
        href: proposals.details.demonstrationUrl,
        label: messages.demonstration,
        accessibleLabel,
      };

      // When: rendering the real product summary with both commercial actions.
      const { container } = render(<ProductSummary {...summary} demonstration={demonstration} />);
      const buy = screen.getByRole('link', { name: summary.action?.accessibleLabel });
      const demo = screen.getByRole('link', { name: accessibleLabel });
      const specifications = container.querySelector('dl');

      // Then: purchase precedes demonstration, both have icons and the demonstration precedes specifications.
      expect(screen.getAllByRole('link')).toEqual([buy, demo]);
      expect(buy).toHaveAttribute('href', proposals.commercial.checkoutUrl);
      expect(demo).toHaveAttribute('href', proposals.details.demonstrationUrl);
      expect(demo).toHaveAttribute('target', '_blank');
      expect(demo).toHaveAttribute('rel', 'noopener noreferrer');
      expect(demo).toHaveTextContent(messages.demonstration);
      expect(buy.querySelector('svg')).toHaveAttribute('aria-hidden', 'true');
      expect(demo.querySelector('svg')).toHaveAttribute('aria-hidden', 'true');
      expect(
        specifications &&
          demo.compareDocumentPosition(specifications) & Node.DOCUMENT_POSITION_FOLLOWING,
      ).toBeTruthy();
      expect(screen.getByText('R$ 29,90')).toBeInTheDocument();
    },
  );

  it('Should retain purchase, price and specifications when demonstration is absent', () => {
    // Given: the approved kit summary without a demonstration destination.
    const props = { ...summary, demonstration: null };

    // When: rendering this optional-action state.
    render(<ProductSummary {...props} />);

    // Then: only the confirmed purchase remains, alongside the price and file format.
    expect(screen.getAllByRole('link')).toHaveLength(1);
    expect(screen.getByRole('link', { name: summary.action?.accessibleLabel })).toHaveAttribute(
      'href',
      proposals.commercial.checkoutUrl,
    );
    expect(
      screen.queryByRole('link', { name: summary.demonstration?.accessibleLabel }),
    ).not.toBeInTheDocument();
    expect(screen.getByText('R$ 29,90')).toBeInTheDocument();
    expect(screen.getByText(pt.values['digital-files'])).toBeInTheDocument();
  });

  it('Should preserve demonstration without inventing an unavailable purchase action', () => {
    // Given: a summary with a confirmed demonstration but no commercial destination.
    const props = { ...summary, action: null };

    // When: rendering the demonstration-only state.
    render(<ProductSummary {...props} />);

    // Then: no buy link appears and the single destination remains the approved demonstration.
    expect(screen.getAllByRole('link')).toHaveLength(1);
    expect(
      screen.getByRole('link', { name: summary.demonstration?.accessibleLabel }),
    ).toHaveAttribute('href', proposals.details.demonstrationUrl);
    expect(
      screen.queryByRole('link', { name: summary.action?.accessibleLabel }),
    ).not.toBeInTheDocument();
  });

  it('Should show supplied stage guidance without price, specifications or fictional actions', () => {
    // Given: an unavailable product presentation with all optional commercial fields absent.
    const props = {
      ...summary,
      price: null,
      action: null,
      demonstration: null,
      specifications: [],
      stageNote: 'Scope and availability are still being defined.',
    };

    // When: rendering this explicitly noncommercial state.
    const { container } = render(<ProductSummary {...props} />);

    // Then: guidance remains visible and no empty specification list or commercial link is created.
    expect(screen.getByText(props.stageNote)).toBeInTheDocument();
    expect(screen.queryByRole('link')).not.toBeInTheDocument();
    expect(screen.queryByText('R$ 29,90')).not.toBeInTheDocument();
    expect(container.querySelector('dl')).not.toBeInTheDocument();
    expect(screen.getByRole('heading', { name: props.name })).toHaveProperty('tagName', 'H2');
  });
});
