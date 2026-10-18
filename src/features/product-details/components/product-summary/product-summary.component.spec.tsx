import assert from 'node:assert/strict';
import { test } from 'node:test';
import { renderToStaticMarkup } from 'react-dom/server';
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

test('demonstration uses the product URL, a localized accessible name and a safe new tab', () => {
  for (const messages of [pt, en, es]) {
    const accessibleLabel = messages.demonstrationLabel.replace('{name}', proposals.name);
    const html = renderToStaticMarkup(
      <ProductSummary
        {...summary}
        demonstration={{
          href: proposals.details.demonstrationUrl,
          label: messages.demonstration,
          accessibleLabel,
        }}
      />,
    );
    const links = Array.from(html.matchAll(/<a\b[^>]*>[\s\S]*?<\/a>/g), (match) => match[0]);

    assert.equal(links.length, 2);
    assert.match(links[0] ?? '', /lucide-shopping-bag/);
    assert.match(links[1] ?? '', /lucide-circle-play/);
    assert.ok((links[0] ?? '').indexOf('<svg') < (links[0] ?? '').lastIndexOf(pt.buy));
    assert.ok(
      (links[1] ?? '').indexOf('<svg') < (links[1] ?? '').lastIndexOf(messages.demonstration),
    );
    assert.ok(links[0]?.includes(`href="${proposals.commercial.checkoutUrl}"`));
    assert.ok(links[1]?.includes(`href="${proposals.details.demonstrationUrl}"`));
    assert.ok(links[1]?.includes(`aria-label="${accessibleLabel}"`));
    assert.ok(links[1]?.includes(messages.demonstration));
    assert.match(links[1] ?? '', /target="_blank"/);
    assert.match(links[1] ?? '', /rel="noopener noreferrer"/);
    assert.ok(html.indexOf(proposals.details.demonstrationUrl) < html.indexOf('<dl'));
    assert.ok(html.includes(summary.price ?? ''));
  }
});

test('without a demonstration the commercial CTA, price and specifications remain available', () => {
  const html = renderToStaticMarkup(<ProductSummary {...summary} demonstration={null} />);

  assert.equal(Array.from(html.matchAll(/<a\b/g)).length, 1);
  assert.ok(html.includes(`href="${proposals.commercial.checkoutUrl}"`));
  assert.ok(html.includes(pt.buy));
  assert.ok(html.includes(summary.price ?? ''));
  assert.ok(html.includes(pt.values['digital-files']));
  assert.ok(!html.includes(proposals.details.demonstrationUrl));
});

test('a demonstration does not invent a commercial action', () => {
  const html = renderToStaticMarkup(<ProductSummary {...summary} action={null} />);

  assert.equal(Array.from(html.matchAll(/<a\b/g)).length, 1);
  assert.ok(html.includes(`href="${proposals.details.demonstrationUrl}"`));
  assert.ok(!html.includes(proposals.commercial.checkoutUrl));
});
